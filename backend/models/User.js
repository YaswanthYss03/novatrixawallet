const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  name: {
    type: String,
    default: ''
  },
  mobile: {
    type: String,
    default: ''
  },
  notificationSettings: {
    pushNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
    priceAlerts: { type: Boolean, default: true },
    transactionAlerts: { type: Boolean, default: true },
    marketUpdates: { type: Boolean, default: false }
  },
  walletId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
