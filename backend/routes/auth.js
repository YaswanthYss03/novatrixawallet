const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Generate userId
    const userCount = await User.countDocuments();
    const userId = `user${String(userCount + 1).padStart(2, '0')}`;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      userId,
      email,
      password: hashedPassword
    });

    // Create wallet for user
    const walletAddress = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const wallet = new Wallet({
      walletAddress,
      userId: user._id,
      balances: {
        BTC: 0,
        ETH: 0,
        USDT: 0,
        BNB: 0,
        MATIC: 0
      }
    });

    await wallet.save();
    user.walletId = wallet._id;
    await user.save();

    // Create JWT
    const payload = {
      user: {
        id: user._id,
        userId: user.userId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.userId, walletAddress });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate('walletId');
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('User found:', user.userId);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    console.log('Password matched, generating token...');

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined!');
      return res.status(500).json({ msg: 'Server configuration error' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user._id,
        userId: user.userId
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT sign error:', err);
          return res.status(500).json({ msg: 'Error generating token' });
        }
        console.log('Login successful for:', email);
        res.json({
          token,
          userId: user.userId,
          walletAddress: user.walletId.walletAddress
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json({
      userId: user.userId,
      email: user.email,
      name: user.name || '',
      mobile: user.mobile || ''
    });
  } catch (err) {
    console.error('Profile fetch error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (mobile !== undefined) user.mobile = mobile;

    await user.save();

    res.json({
      msg: 'Profile updated successfully',
      userId: user.userId,
      email: user.email,
      name: user.name,
      mobile: user.mobile
    });
  } catch (err) {
    console.error('Profile update error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ msg: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    console.error('Password change error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/auth/notification-settings
// @desc    Get notification settings
// @access  Private
router.get('/notification-settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.notificationSettings || {
      pushNotifications: true,
      emailNotifications: true,
      priceAlerts: true,
      transactionAlerts: true,
      marketUpdates: false
    });
  } catch (err) {
    console.error('Notification settings fetch error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/auth/notification-settings
// @desc    Update notification settings
// @access  Private
router.put('/notification-settings', auth, async (req, res) => {
  try {
    const { pushNotifications, emailNotifications, priceAlerts, transactionAlerts, marketUpdates } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.notificationSettings = {
      pushNotifications: pushNotifications !== undefined ? pushNotifications : user.notificationSettings?.pushNotifications || true,
      emailNotifications: emailNotifications !== undefined ? emailNotifications : user.notificationSettings?.emailNotifications || true,
      priceAlerts: priceAlerts !== undefined ? priceAlerts : user.notificationSettings?.priceAlerts || true,
      transactionAlerts: transactionAlerts !== undefined ? transactionAlerts : user.notificationSettings?.transactionAlerts || true,
      marketUpdates: marketUpdates !== undefined ? marketUpdates : user.notificationSettings?.marketUpdates || false
    };

    await user.save();

    res.json({
      msg: 'Notification settings updated successfully',
      settings: user.notificationSettings
    });
  } catch (err) {
    console.error('Notification settings update error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
