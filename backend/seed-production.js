const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Wallet = require('./models/Wallet');
require('dotenv').config();

// 5 random users with pattern: randomword@novatrixawallet.com / randomword@123
// Plus 1 super admin for monitoring
const users = [
  { word: 'phoenix', usdt: 10000, isAdmin: false }, // User with 10k USDT
  { word: 'stellar', usdt: 0, isAdmin: false },
  { word: 'quantum', usdt: 0, isAdmin: false },
  { word: 'nebula', usdt: 0, isAdmin: false },
  { word: 'cosmic', usdt: 0, isAdmin: false },
  { word: 'admin', usdt: 0, isAdmin: true } // Super admin account
];

async function seedProduction() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data (optional - comment out if you want to keep existing users)
    await User.deleteMany({});
    await Wallet.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    for (let i = 0; i < users.length; i++) {
      const { word, usdt, isAdmin } = users[i];
      const userId = `user${String(i + 1).padStart(2, '0')}`;
      const email = `${word}@novatrixawallet.com`;
      const password = `${word}@123`;

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        userId,
        email,
        password: hashedPassword,
        isAdmin: isAdmin || false
      });

      // Create wallet
      const walletAddress = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const wallet = new Wallet({
        walletAddress,
        userId: user._id,
        balances: {
          BTC: 0,
          ETH: 0,
          USDT: usdt,
          BNB: 0,
          MATIC: 0
        }
      });

      await wallet.save();
      user.walletId = wallet._id;
      await user.save();

      console.log(`✅ Created: ${email} ${isAdmin ? '(SUPER ADMIN)' : '(' + (usdt > 0 ? usdt + ' USDT' : 'Empty wallet') + ')'}`);
    }

    console.log('\n🎉 Production seed completed!');
    console.log('\n📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    users.forEach((u, i) => {
      console.log(`${u.isAdmin ? '🔐 Admin' : `User ${i + 1}`}: ${u.word}@novatrixawallet.com / ${u.word}@123 ${u.isAdmin ? '(Super Admin)' : u.usdt > 0 ? '(10,000 USDT)' : ''}`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

seedProduction();