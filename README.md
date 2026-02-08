# Trust Wallet Clone - Demo

![Trust Wallet Demo](https://img.shields.io/badge/Status-Demo-green)
![License](https://img.shields.io/badge/License-Educational-blue)

**⚠️ DISCLAIMER: This is a DEMO/EDUCATIONAL project. NO real blockchain transactions. NO private keys. For learning purposes only.**

## 🎯 Features

- ✅ Trust Wallet–like mobile-responsive UI
- ✅ Live cryptocurrency prices (CoinGecko API)
- ✅ 10 demo user accounts with simulated balances
- ✅ Simulated gas fees for multiple networks
- ✅ Send tokens with network selection
- ✅ Swap tokens with slippage tolerance
- ✅ Market page with live prices & charts
- ✅ **Token detail pages with interactive charts**
- ✅ **Buy/Sell functionality on token pages**
- ✅ Receive page with wallet address
- ✅ Transaction history tracking
- ✅ **Settings & profile management**
- ✅ **Earn page with staking options**
- ✅ JWT authentication
- ✅ MongoDB database

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (React, TypeScript)
- **Tailwind CSS** (Mobile-first design)
- **Lucide React** (Icons)
- **Axios** (API calls)

### Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **CoinGecko API** (Market prices)

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running locally (or use MongoDB Atlas)

### 1. Clone or navigate to the project

```bash
cd /home/yashwanth/Desktop/WALLET
```

### 2. Install dependencies

```bash
npm run install:all
```

This will install dependencies for root, frontend, and backend.

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
sudo systemctl start mongodb
# or
mongod
```

Or update `backend/.env` with your MongoDB Atlas connection string.

### 4. Seed the database (10 demo users)

```bash
cd backend
npm run seed
```

This creates 10 demo users:
- **Email:** `user01@demo.com` ➜ `user10@demo.com`
- **Password:** `demo123`
- **User 01 has 10,000 USDT** (as requested)

### 5. Start the development servers

```bash
# From root directory
npm run dev
```

This starts:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

## 🔐 Demo Credentials

| Email | Password | USDT Balance |
|-------|----------|--------------|
| user01@demo.com | demo123 | **10,000** |
| user02@demo.com | demo123 | 3,500 |
| user03@demo.com | demo123 | 5,000 |
| user04@demo.com | demo123 | 1,500 |
| user05@demo.com | demo123 | 8,000 |
| user06@demo.com | demo123 | 800 |
| user07@demo.com | demo123 | 6,500 |
| user08@demo.com | demo123 | 2,000 |
| user09@demo.com | demo123 | 12,000 |
| user10@demo.com | demo123 | 7,500 |

## 🌐 Supported Cryptocurrencies

- **BTC** - Bitcoin
- **ETH** - Ethereum
- **USDT** - Tether
- **BNB** - Binance Coin
- **MATIC** - Polygon

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Wallet
- `GET /api/wallet/balance` - Get wallet balance (Protected)
- `PUT /api/wallet/balance` - Update balance (Protected)

### Market
- `GET /api/market/prices` - Get live crypto prices
- `GET /api/market/gas-fees` - Get simulated gas fees

### Transactions
- `POST /api/transaction/send` - Send crypto (Protected)
- `GET /api/transaction/history` - Transaction history (Protected)

## 📱 Pages

- **/** - Home (Wallet overview with live balances)
- **/login** - Login page with quick demo user selection
- **/token/[symbol]** - **Token detail page with chart, buy/sell, holdings** ⭐ NEW
- **/send** - Send crypto with network & gas fee selection
- **/swap** - Swap tokens with live exchange rates
- **/receive** - Receive crypto (wallet address & QR code)
- **/market** - Live market prices with interactive charts
- **/history** - Transaction history
- **/settings** - **User settings & profile** ⭐ NEW
- **/earn** - **Staking & earning options** ⭐ NEW
- **/rewards** - Rewards & staking programs (placeholder)
- **/discover** - Educational content (placeholder)

## 🎨 UI Design

The UI closely matc with floating trade button
- Mobile-first responsive design
- Smooth transitions and hover effects
- Interactive charts with Chart.js)
- Green accent color (#00D982)
- Rounded buttons and cards
- Bottom navigation
- Mobile-first responsive design

## ⚙️ Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trust-wallet-demo
JWT_SECRET=demo_jwt_secret_key_for_development_only
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Deployment Notes

**This is a DEMO project.** For production:
1. Use strong JWT secrets
2. Add rate limiting
3. Add input validation
4. Use HTTPS
5. Add proper error handling
6. Never store real private keys

## 📝 License

Educational/Demo purposes only. Not for commercial use.

## 🙏 Credits

- UI Design inspired by **Trust Wallet**
- Market data from **CoinGecko API**
- Icons from **Lucide React**

---

**Made with GitHub Copilot** 🤖
