# MongoDB Atlas Setup Guide

## Step 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email (or use Google/GitHub)
3. Choose **FREE** tier (M0 Sandbox - perfect for demos)

## Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE** tier (Shared)
3. Select a cloud provider (AWS recommended)
4. Choose a region closest to you
5. Cluster name: `trust-wallet-demo` (or keep default)
6. Click **"Create"** (will take 2-3 minutes)

## Step 3: Create Database User

1. You'll see a **"Security Quickstart"** screen
2. Choose **Username and Password** authentication
3. Create credentials:
   - Username: `trustwallet`
   - Password: Click "Autogenerate Secure Password" (copy it!)
   - Or set your own: `DemoWallet2026`
4. Click **"Create User"**

## Step 4: Add IP Address

1. Scroll down to **"Where would you like to connect from?"**
2. Click **"Add My Current IP Address"**
3. OR click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is fine for a demo project
4. Click **"Finish and Close"**

## Step 5: Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select **Driver: Node.js**
4. Copy the connection string (looks like this):
   ```
   mongodb+srv://trustwallet:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **IMPORTANT:** Replace `<password>` with your actual password!

## Step 6: Update Your .env File

Copy your connection string and I'll update the backend/.env file for you!

**Example:**
```
mongodb+srv://trustwallet:DemoWallet2026@cluster0.abc123.mongodb.net/trust-wallet-demo?retryWrites=true&w=majority
```

---

## 🎯 Once You Have the Connection String

Just paste it here and I'll:
1. Update the backend/.env file
2. Seed the database with 10 demo users
3. Start both frontend and backend
4. You'll be ready to login at http://localhost:3000

**Please share your MongoDB Atlas connection string when ready!** 🚀
