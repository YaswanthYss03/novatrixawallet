const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Wallet = require('../models/Wallet');

// @route   GET /api/admin/transactions
// @desc    Get all transactions across all users
// @access  Admin only
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate({
        path: 'fromWallet',
        populate: { path: 'userId', select: 'email userId' }
      })
      .sort({ timestamp: -1 })
      .limit(500); // Limit to last 500 transactions

    // Format response with user details
    const formattedTransactions = transactions.map(tx => ({
      _id: tx._id,
      hash: tx.transactionHash,
      from: tx.fromWallet?.userId?.email || 'Unknown',
      fromWalletAddress: tx.fromWallet?.walletAddress || 'Unknown',
      to: tx.toAddress,
      token: tx.token,
      amount: tx.amount,
      gasFee: tx.gasFee,
      status: tx.status,
      type: tx.type,
      isExternal: tx.isExternal || false,
      network: tx.network,
      timestamp: tx.timestamp
    }));

    res.json({ 
      count: formattedTransactions.length,
      transactions: formattedTransactions 
    });
  } catch (err) {
    console.error('Admin get transactions error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with wallet balances and activity
// @access  Admin only
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .populate('walletId');

    // Get transaction counts for each user
    const usersWithActivity = await Promise.all(users.map(async (user) => {
      const transactionCount = await Transaction.countDocuments({ 
        fromWallet: user.walletId?._id 
      });

      return {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        name: user.name || '',
        mobile: user.mobile || '',
        walletAddress: user.walletId?.walletAddress || 'No wallet',
        balances: user.walletId?.balances || {},
        transactionCount,
        createdAt: user.createdAt
      };
    }));

    res.json({ 
      count: usersWithActivity.length,
      users: usersWithActivity 
    });
  } catch (err) {
    console.error('Admin get users error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/admin/transaction/:id/status
// @desc    Update transaction status
// @access  Admin only
router.put('/transaction/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const validStatuses = ['Success', 'Pending', 'Failed', 'Processing'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value' });
    }

    // Get the transaction before updating
    const transaction = await Transaction.findById(id).populate('fromWallet');

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    const previousStatus = transaction.status;

    // If changing from "Processing" to "Success" for external transaction, deduct balance
    if (previousStatus === 'Processing' && status === 'Success' && transaction.isExternal) {
      const wallet = await Wallet.findById(transaction.fromWallet._id);
      
      if (wallet) {
        const totalRequired = transaction.amount + transaction.gasFee;
        
        // Check if sufficient balance
        if (wallet.balances[transaction.token] >= totalRequired) {
          wallet.balances[transaction.token] -= totalRequired;
          await wallet.save();
          console.log(`✅ Balance deducted: ${totalRequired} ${transaction.token} from wallet ${wallet.walletAddress}`);
        } else {
          return res.status(400).json({ 
            msg: 'Insufficient balance to complete transaction',
            required: totalRequired,
            available: wallet.balances[transaction.token]
          });
        }
      }
    }

    // Update transaction status
    transaction.status = status;
    await transaction.save();

    // Populate for response
    await transaction.populate({
      path: 'fromWallet',
      populate: { path: 'userId', select: 'email' }
    });

    res.json({ 
      msg: previousStatus === 'Processing' && status === 'Success' 
        ? 'Transaction completed and balance deducted' 
        : 'Transaction status updated',
      transaction: {
        _id: transaction._id,
        hash: transaction.transactionHash,
        status: transaction.status,
        from: transaction.fromWallet?.userId?.email || 'Unknown'
      }
    });
  } catch (err) {
    console.error('Admin update transaction error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/admin/activity
// @desc    Get complete activity log (all transaction types)
// @access  Admin only
router.get('/activity', adminAuth, async (req, res) => {
  try {
    const { type, userId } = req.query;
    
    let query = {};
    
    // Filter by type if provided
    if (type && ['send', 'receive', 'swap', 'stake'].includes(type)) {
      query.type = type;
    }
    
    // Filter by user if provided
    if (userId) {
      const user = await User.findOne({ userId });
      if (user && user.walletId) {
        query.fromWallet = user.walletId;
      }
    }

    const activities = await Transaction.find(query)
      .populate({
        path: 'fromWallet',
        populate: { path: 'userId', select: 'email userId name' }
      })
      .sort({ timestamp: -1 })
      .limit(1000);

    const formattedActivities = activities.map(activity => ({
      _id: activity._id,
      user: activity.fromWallet?.userId?.email || 'Unknown',
      userName: activity.fromWallet?.userId?.name || 'N/A',
      type: activity.type,
      token: activity.token,
      amount: activity.amount,
      to: activity.toAddress,
      from: activity.fromWallet?.walletAddress || 'Unknown',
      status: activity.status,
      isExternal: activity.isExternal || false,
      hash: activity.transactionHash,
      timestamp: activity.timestamp
    }));

    res.json({ 
      count: formattedActivities.length,
      activities: formattedActivities 
    });
  } catch (err) {
    console.error('Admin get activity error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Admin only
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalTransactions = await Transaction.countDocuments();
    const processingTransactions = await Transaction.countDocuments({ status: 'Processing' });
    const externalTransactions = await Transaction.countDocuments({ isExternal: true });

    // Get total volume by token
    const volumeByToken = await Transaction.aggregate([
      { $match: { type: 'send' } },
      { $group: { _id: '$token', totalVolume: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalTransactions,
      processingTransactions,
      externalTransactions,
      volumeByToken
    });
  } catch (err) {
    console.error('Admin get stats error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
