const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile (name, mobile)
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, mobile } = req.body;
    
    // Validate input
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ msg: 'Name is required' });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        name: name.trim(),
        mobile: mobile?.trim() || ''
      },
      { new: true }
    ).select('-password');

    res.json({ 
      msg: 'Profile updated successfully',
      user
    });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
