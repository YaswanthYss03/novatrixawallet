const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Wallet = require('../models/Wallet');
const User = require('../models/User');

// @route   GET /api/wallet/balance
// @desc    Get wallet balance for logged-in user
// @access  Private
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('walletId');
    if (!user || !user.walletId) {
      return res.status(404).json({ msg: 'Wallet not found' });
    }

    res.json({
      walletAddress: user.walletId.walletAddress,
      balances: user.walletId.balances
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/wallet/balance
// @desc    Update wallet balance (demo only)
// @access  Private
router.put('/balance', auth, async (req, res) => {
  try {
    const { token, amount } = req.body;

    const user = await User.findById(req.user.id);
    const wallet = await Wallet.findById(user.walletId);

    if (!wallet.balances.hasOwnProperty(token)) {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    wallet.balances[token] = amount;
    await wallet.save();

    res.json({
      msg: 'Balance updated',
      balances: wallet.balances
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
