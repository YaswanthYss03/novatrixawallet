const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.user.id);
    
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Admin auth error:', err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = adminAuth;
