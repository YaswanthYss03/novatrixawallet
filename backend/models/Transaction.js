const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  fromWallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true
  },
  toAddress: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true,
    enum: ['BTC', 'ETH', 'USDT', 'BNB', 'MATIC']
  },
  amount: {
    type: Number,
    required: true
  },
  network: {
    type: String,
    required: true,
    enum: ['Ethereum', 'BNB Chain', 'Polygon', 'Bitcoin']
  },
  gasFee: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Success',
    enum: ['Success', 'Pending', 'Failed']
  },
  transactionHash: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'send',
    enum: ['send', 'receive', 'swap', 'stake']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
