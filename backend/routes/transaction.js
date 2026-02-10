const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Wallet = require('../models/Wallet');
const User = require('../models/User');

// @route   POST /api/transaction/send
// @desc    Create a demo transaction with user-to-user transfer support
// @access  Private
router.post('/send', auth, async (req, res) => {
  try {
    const { toAddress, token, amount, network, gasFee } = req.body;

    const user = await User.findById(req.user.id);
    const senderWallet = await Wallet.findById(user.walletId);

    // Check if sufficient balance (including gas fee)
    const totalRequired = parseFloat(amount) + parseFloat(gasFee);
    if (senderWallet.balances[token] < totalRequired) {
      return res.status(400).json({ msg: 'Insufficient balance (including gas fee)' });
    }

    // Try to find receiver wallet to determine if internal or external
    const receiverWallet = await Wallet.findOne({ walletAddress: toAddress });
    let receiverCredited = false;
    let transactionStatus = 'Processing'; // Default to processing for external addresses
    let isExternal = true;
    
    if (receiverWallet) {
      // Internal transaction: Deduct from sender and credit receiver immediately
      senderWallet.balances[token] -= totalRequired;
      await senderWallet.save();

      // Credit receiver's balance
      if (!receiverWallet.balances[token]) {
        receiverWallet.balances[token] = 0;
      }
      receiverWallet.balances[token] += parseFloat(amount);
      await receiverWallet.save();
      receiverCredited = true;
      transactionStatus = 'Success';
      isExternal = false;
    } else {
      // External transaction: Don't deduct balance yet - wait for admin approval
      // Balance will be deducted when admin marks transaction as "Success"
    }

    // Create transaction hash
    const transactionHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create sender's transaction record
    const senderTransaction = new Transaction({
      fromWallet: senderWallet._id,
      toAddress,
      token,
      amount: parseFloat(amount),
      network,
      gasFee: parseFloat(gasFee),
      status: transactionStatus,
      transactionHash,
      type: 'send',
      isExternal
    });
    await senderTransaction.save();

    // Create receiver's transaction record if they're a demo user
    if (receiverWallet) {
      const receiverTransaction = new Transaction({
        fromWallet: receiverWallet._id,
        toAddress: senderWallet.walletAddress,
        token,
        amount: parseFloat(amount),
        network,
        gasFee: 0, // Receiver doesn't pay gas
        status: 'Success',
        transactionHash,
        type: 'receive'
      });
      await receiverTransaction.save();
    }

    res.json({
      msg: isExternal ? 'External transaction initiated - processing' : 'Transaction successful',
      transaction: {
        hash: transactionHash,
        status: transactionStatus,
        amount,
        isExternal,
        token,
        network,
        gasFee,
        receiverCredited
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/transaction/swap
// @desc    Execute token swap
// @access  Private
router.post('/swap', auth, async (req, res) => {
  try {
    const { fromToken, toToken, fromAmount, toAmount, network, gasFee } = req.body;

    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findById(user.walletId);

    // Check if sufficient balance (including gas fee)
    const totalRequired = parseFloat(fromAmount) + parseFloat(gasFee);
    if (wallet.balances[fromToken] < totalRequired) {
      return res.status(400).json({ msg: 'Insufficient balance (including gas fee)' });
    }

    // Execute swap: deduct fromToken, add toToken
    wallet.balances[fromToken] -= totalRequired;
    
    if (!wallet.balances[toToken]) {
      wallet.balances[toToken] = 0;
    }
    wallet.balances[toToken] += parseFloat(toAmount);
    
    await wallet.save();

    // Create transaction hash
    const transactionHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // Create swap transaction record
    const swapTransaction = new Transaction({
      fromWallet: wallet._id,
      toAddress: wallet.walletAddress, // Swap is to self
      token: fromToken,
      amount: parseFloat(fromAmount),
      network,
      gasFee: parseFloat(gasFee),
      status: 'Success',
      transactionHash,
      type: 'swap'
    });
    await swapTransaction.save();

    res.json({
      msg: 'Swap successful',
      transaction: {
        hash: transactionHash,
        status: 'Success',
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        network,
        gasFee
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/transaction/history
// @desc    Get transaction history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findById(user.walletId);

    const transactions = await Transaction.find({ fromWallet: wallet._id })
      .sort({ timestamp: -1 })
      .limit(50);

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
