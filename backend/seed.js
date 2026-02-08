const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Wallet = require('./models/Wallet');

// Demo users data - Only user01 has 5000 USDT, all others have empty wallets
const demoUsers = [
  { email: 'user01@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 5000, BNB: 0, MATIC: 0 } },
  { email: 'user02@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user03@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user04@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user05@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user06@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user07@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user08@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user09@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } },
  { email: 'user10@demo.com', password: 'demo123', balances: { BTC: 0, ETH: 0, USDT: 0, BNB: 0, MATIC: 0 } }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    await User.deleteMany({});
    await Wallet.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo123', salt);

    // Create users and wallets
    for (let i = 0; i < demoUsers.length; i++) {
      const userData = demoUsers[i];
      const userId = `user${String(i + 1).padStart(2, '0')}`;

      // Create user
      const user = new User({
        userId,
        email: userData.email,
        password: hashedPassword
      });

      // Create wallet
      const walletAddress = '0x' + Math.random().toString(36).substring(2, 15).toUpperCase() + Math.random().toString(36).substring(2, 15).toUpperCase();
      const wallet = new Wallet({
        walletAddress,
        userId: user._id,
        balances: userData.balances
      });

      await wallet.save();
      user.walletId = wallet._id;
      await user.save();

      console.log(`✅ Created ${userId} - ${userData.email} (USDT: ${userData.balances.USDT})`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Email: user01@demo.com (USDT: 5,000) - ONLY user with balance');
    console.log('Email: user02-user10@demo.com (Empty wallets)');
    console.log('Password: demo123\n');

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seedDatabase();
