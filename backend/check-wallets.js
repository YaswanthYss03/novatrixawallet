const mongoose = require('mongoose');
const Wallet = require('./models/Wallet');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('=== All Wallets in Database ===\n');
  const wallets = await Wallet.find();
  console.log(`Total wallets: ${wallets.length}\n`);
  
  for (const wallet of wallets) {
    console.log(`Address: ${wallet.walletAddress}`);
    console.log(`User ID: ${wallet.userId}`);
    console.log('---');
  }
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
