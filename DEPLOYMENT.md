# Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (sign up at vercel.com)
- Render account (sign up at render.com)
- MongoDB Atlas account (already have: mongodb+srv://wallet:Wallet12345@cluster0.x5cqv29.mongodb.net/trust-wallet-demo)

## Step 1: Push to GitHub

1. Go to GitHub and create a new repository (e.g., "nova-trixa-wallet")
2. Don't initialize with README (we already have code)
3. Copy the repository URL

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: nova-trixa-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

5. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://wallet:Wallet12345@cluster0.x5cqv29.mongodb.net/trust-wallet-demo`
   - `PORT`: `5000`
   - `FRONTEND_URL`: `https://your-app.vercel.app` (update after deploying frontend)

6. Click "Create Web Service"
7. Copy the Render URL (e.g., https://nova-trixa-backend.onrender.com)

## Step 3: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Output Directory**: `.next`

5. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-render-backend.onrender.com/api`

6. Click "Deploy"
7. Copy the Vercel URL

## Step 4: Update CORS

1. Go back to Render dashboard
2. Update the `FRONTEND_URL` environment variable with your actual Vercel URL
3. Restart the backend service

## Testing

1. Visit your Vercel frontend URL
2. Login with: `user01@demo.com` / `demo123`
3. Test all features (send, swap, market data, etc.)

## Important Notes

- Free Render services sleep after 15 minutes of inactivity (first request may take 30s to wake up)
- MongoDB Atlas connection is already configured
- Both frontend and backend are now connected via environment variables
- CORS is properly configured to allow your Vercel domain

## Troubleshooting

If you get CORS errors:
1. Make sure `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Restart the Render service after updating environment variables

If API calls fail:
1. Check that `NEXT_PUBLIC_API_URL` in Vercel is correct
2. Make sure it includes `/api` at the end
3. Redeploy the frontend after changing environment variables
