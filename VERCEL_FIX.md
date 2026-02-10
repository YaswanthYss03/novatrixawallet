# Vercel Deployment Fix

## The Issue
Your project has a monorepo structure with `frontend` and `backend` folders, but Vercel is trying to deploy from the root directory.

## Solution: Configure Root Directory in Vercel Dashboard

### Step 1: Go to Your Vercel Project Settings
1. Go to [vercel.com](https://vercel.com) and log in
2. Select your project: **novatrixawallet**
3. Click on **Settings** tab

### Step 2: Configure Root Directory
1. In Settings, go to **General** section
2. Find **Root Directory** setting
3. Click **Edit**
4. Enter: `frontend`
5. Click **Save**

### Step 3: Configure Build Settings (if needed)
In **Build & Development Settings**:
- **Framework Preset**: Next.js (should auto-detect)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### Step 4: Configure Environment Variables
1. In Settings, go to **Environment Variables** section
2. Add the following variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://novatrixawallet.onrender.com/api`
   - **Environment**: Production, Preview, Development (check all)
3. Click **Save**

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger deployment

## What This Does
By setting Root Directory to `frontend`, Vercel will:
- Look for `package.json` in `/frontend/package.json` ✅
- Run all commands from the frontend directory ✅
- Deploy only the Next.js app (not the backend) ✅

## Backend Configuration
Your backend is already deployed separately on Render at:
- **Backend URL**: `https://novatrixawallet.onrender.com`

Make sure your frontend `.env` or `next.config.js` has:
```bash
NEXT_PUBLIC_API_URL=https://novatrixawallet.onrender.com/api
```

## Verify Deployment
After redeploying, check:
1. Frontend loads: `https://novatrixawallet.vercel.app`
2. No 404 errors in console
3. API calls go to your Render backend

## Alternative: Deploy Frontend to Root (Not Recommended)
If you can't change settings, you could move frontend files to root:
```bash
mv frontend/* .
mv frontend/.* .
rmdir frontend
```
But this breaks your local development setup, so the dashboard configuration is better.
