# 🚀 Quick Setup Guide

## Prerequisites Check

✅ Node.js installed
❌ MongoDB needs to be installed

## Step 1: Install MongoDB

### Option A: Install MongoDB Community Edition (Recommended)

```bash
# Import MongoDB GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

### Option B: Use MongoDB Atlas (Cloud - No Installation Needed)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a free cluster
4. Get your connection string
5. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trust-wallet-demo
   ```

### Option C: Use Docker (Easiest)

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Verify it's running
docker ps
```

## Step 2: Seed the Database

Once MongoDB is running:

```bash
cd /home/yashwanth/Desktop/WALLET/backend
npm run seed
```

This creates 10 demo users with balances.

## Step 3: Start the Application

### Terminal 1: Start Backend
```bash
cd /home/yashwanth/Desktop/WALLET/backend
npm run dev
```

Backend will run at **http://localhost:5000**

### Terminal 2: Start Frontend
```bash
cd /home/yashwanth/Desktop/WALLET/frontend
npm run dev
```

Frontend will run at **http://localhost:3000**

### OR: Start Both Together
```bash
cd /home/yashwanth/Desktop/WALLET
npm run dev
```

## Step 4: Login and Test

1. Open http://localhost:3000/login
2. Use demo credentials:
   - **Email:** `user01@demo.com`
   - **Password:** `demo123`
   - **USDT Balance:** 10,000

## 🎯 Quick Test Commands

```bash
# Check if backend is running
curl http://localhost:5000/api/health

# Check market prices
curl http://localhost:5000/api/market/prices

# Check gas fees
curl http://localhost:5000/api/market/gas-fees
```

## 📱 What Works Now

✅ Login/Authentication
✅ Wallet home page with live prices
✅ Token list with USD values
✅ 24h price changes
✅ Mobile-responsive UI matching Trust Wallet
✅ 10 demo users with different balances

## 🔜 Coming Soon

- Send tokens page
- Swap tokens page
- Market page with charts
- Transaction history
- Network selection

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Or check if Docker container is running
docker ps | grep mongo
```

### Port Already in Use
```bash
# Check what's using port 5000
lsof -i :5000

# Check what's using port 3000
lsof -i :3000
```

### Clear and Reseed Database
```bash
cd /home/yashwanth/Desktop/WALLET/backend
mongo trust-wallet-demo --eval "db.dropDatabase()"
npm run seed
```

## Need Help?

Let me know which option you want to use for MongoDB:
1. Install locally (most control)
2. Use MongoDB Atlas (no installation, cloud-based)
3. Use Docker (easiest if you have Docker)
