const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    console.log('Fetching profile for user ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found with ID:', req.user.id);
      return res.status(404).json({ msg: 'User not found' });
    }
    console.log('User found:', { userId: user.userId, email: user.email, mobile: user.mobile });
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

    // Get current user
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prepare update object
    const updateData = { name: name.trim() };
    
    // Only allow mobile update if user doesn't have one yet
    if (!currentUser.mobile || currentUser.mobile === '') {
      if (mobile && mobile.trim().length > 0) {
        updateData.mobile = mobile.trim();
      }
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
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
