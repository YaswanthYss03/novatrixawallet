# 🚀 Quick Deployment Guide for Nova Trixa Wallet

## ✅ Step 1: Push to GitHub (5 minutes)

### Option A: Using GitHub Desktop (Easiest)
1. Download and install GitHub Desktop
2. File → Add Local Repository → Select `/home/yashwanth/Desktop/WALLET`
3. Click "Publish repository"
4. Name it "nova-trixa-wallet", make it Public or Private
5. Click "Publish repository"

### Option B: Using Command Line
1. Go to https://github.com/new
2. Repository name: `nova-trixa-wallet`
3. Make it Public
4. **DON'T** initialize with README
5. Copy the repository URL (looks like: `https://github.com/YOUR_USERNAME/nova-trixa-wallet.git`)

Then run these commands:
```bash
cd /home/yashwanth/Desktop/WALLET
git remote add origin https://github.com/YOUR_USERNAME/nova-trixa-wallet.git
git branch -M main
git push -u origin main
```

---

## 🔧 Step 2: Deploy Backend to Render (10 minutes)

1. **Go to https://render.com** and sign in with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect your GitHub repository** (`nova-trixa-wallet`)

4. **Configure the service:**
   ```
   Name: nova-trixa-backend
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```

5. **Add Environment Variables** (click "Add Environment Variable"):
   ```
   MONGODB_URI = mongodb+srv://wallet:Wallet12345@cluster0.x5cqv29.mongodb.net/trust-wallet-demo
   PORT = 5000
   FRONTEND_URL = https://your-app.vercel.app
   NODE_ENV = production
   ```
   (Don't worry about FRONTEND_URL yet, we'll update it after deploying frontend)

6. **Click "Create Web Service"** - Wait 5-10 minutes for deployment

7. **Copy your Render URL** (e.g., `https://nova-trixa-backend.onrender.com`)
   - You'll need this for the next step!

---

## 🌐 Step 3: Deploy Frontend to Vercel (5 minutes)

1. **Go to https://vercel.com** and sign in with GitHub

2. **Click "Add New" → "Project"**

3. **Import your GitHub repository** (`nova-trixa-wallet`)

4. **Configure the project:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm install && npm run build
   Output Directory: .next
   ```

5. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL = https://YOUR-RENDER-URL.onrender.com/api
   ```
   Replace `YOUR-RENDER-URL` with the URL you got from Render in Step 2
   Example: `https://nova-trixa-backend.onrender.com/api`

6. **Click "Deploy"** - Wait 3-5 minutes

7. **Copy your Vercel URL** (e.g., `https://nova-trixa-wallet.vercel.app`)

---

## 🔄 Step 4: Update Backend CORS (2 minutes)

Now that you have your Vercel URL, update the backend:

1. Go back to **Render Dashboard**
2. Click on your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` with your Vercel URL:
   ```
   FRONTEND_URL = https://nova-trixa-wallet.vercel.app
   ```
5. Click **Save Changes**
6. Service will automatically restart

---

## 🎉 Step 5: Test Your Live Website!

1. Visit your Vercel URL (e.g., `https://nova-trixa-wallet.vercel.app`)

2. **Login with:**
   ```
   Username: user01@demo.com
   Password: demo123
   ```

3. **Test features:**
   - ✅ View wallet balance ($4,892.16)
   - ✅ Check crypto, prediction, and watch tabs
   - ✅ Send USDT to another user
   - ✅ Swap tokens (e.g., 10 USDT → BTC)
   - ✅ View real-time market data
   - ✅ Check transaction history

---

## 📝 Important Notes

### ⚠️ Free Tier Limitations
- **Render Free**: Backend sleeps after 15 minutes of inactivity
  - First request may take 30-50 seconds to wake up
  - Subsequent requests are instant
- **Vercel Free**: Unlimited (frontend is always instant)
- **MongoDB Atlas**: Free tier with 512MB storage

### 🔐 Security
- Change MongoDB credentials before going production
- Update JWT_SECRET in backend .env on Render
- Never commit .env files (already in .gitignore)

### 🐛 Troubleshooting

**Problem: CORS errors**
- Solution: Make sure FRONTEND_URL in Render exactly matches your Vercel URL
- Don't forget to restart Render service after changing env variables

**Problem: API calls timeout**
- Solution: Wait 30-50 seconds on first request (Render waking up)
- Keep the site active or upgrade to Render paid plan

**Problem: Swap/Send not working**
- Solution: Check browser console for errors
- Verify NEXT_PUBLIC_API_URL in Vercel includes `/api` at the end

---

## 🎯 Your Live URLs

After deployment, your app will be available at:

**Frontend (Vercel):** `https://nova-trixa-wallet.vercel.app`
**Backend (Render):** `https://nova-trixa-backend.onrender.com`

---

## 🔄 Making Changes

After deployment, to update your app:

1. Make changes to your code locally
2. Commit: `git add . && git commit -m "Your change description"`
3. Push: `git push`
4. **Vercel and Render will auto-deploy!** (takes 2-3 minutes)

---

## 💡 Pro Tips

1. **Auto-deploy**: Both Vercel and Render auto-deploy when you push to main branch
2. **Custom domain**: Add your own domain in Vercel settings
3. **Analytics**: Enable Vercel Analytics for visitor tracking
4. **Monitoring**: Check Render logs for backend errors
5. **Wake up backend**: Create a cron job to ping your backend every 14 minutes

Enjoy your live crypto wallet! 🎊
