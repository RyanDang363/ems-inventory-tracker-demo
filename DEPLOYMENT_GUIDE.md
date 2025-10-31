# 🚀 Deployment Guide - GitHub & Vercel

This guide will walk you through deploying your EMS Inventory Tracker to GitHub and Vercel.

---

## 📋 Prerequisites

- [GitHub account](https://github.com)
- [Vercel account](https://vercel.com) (free tier works)
- Git installed locally
- Node.js installed locally

---

## 🔧 Part 1: Push to GitHub

### Step 1: Initialize Git Repository

```bash
# In your project root directory
git init
git add .
git commit -m "Initial commit: EMS Inventory Tracker"
```

### Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click **"New"** or **"+"** → **"New repository"**
3. Name it: `ems-inventory-tracker`
4. Keep it **Public** (or Private if you prefer)
5. **DON'T** initialize with README (we already have one)
6. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/ems-inventory-tracker.git
git branch -M main
git push -u origin main
```

---

## 🌐 Part 2: Deploy Backend to Vercel

### Step 1: Prepare Backend for Deployment

The backend needs to use a cloud database for production. Options:

#### Option A: Use Vercel Postgres (Recommended)
1. Will be set up automatically during deployment
2. Free tier available

#### Option B: Use Turso (SQLite in the cloud)
1. Sign up at [turso.tech](https://turso.tech)
2. Create a database
3. Get your connection URL

### Step 2: Deploy Backend

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Configure Project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend` (click Edit and select)
   - **Build Command:** `npm install`
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:

   ```
   NODE_ENV = production
   JWT_SECRET = [generate-a-secure-random-string]
   JWT_EXPIRES_IN = 7d
   FRONTEND_URL = https://your-frontend.vercel.app
   BACKEND_URL = https://your-backend.vercel.app
   
   # If using Google OAuth (optional):
   GOOGLE_CLIENT_ID = your-client-id
   GOOGLE_CLIENT_SECRET = your-client-secret
   
   # Database (Vercel will auto-add if using Vercel Postgres)
   # Or add your Turso/other database URL:
   # DATABASE_URL = your-database-url
   ```

6. Click **"Deploy"**

7. **Note your backend URL:** `https://your-project-backend.vercel.app`

### Step 3: Set Up Database

#### If using Vercel Postgres:
1. In Vercel Dashboard, go to your backend project
2. Go to **"Storage"** tab
3. Click **"Create Database"** → **"Postgres"**
4. Follow the setup wizard
5. It will automatically add connection environment variables

#### Initialize Database Schema:
You'll need to run the initialization script. Options:

**Option 1: Use Vercel CLI**
```bash
npm i -g vercel
vercel link
vercel env pull
cd backend
node database/init.js
```

**Option 2: Manual SQL**
Connect to your database and run the SQL from `backend/database/init.js`

---

## 🎨 Part 3: Deploy Frontend to Vercel

### Step 1: Update Frontend Configuration

1. Update API URL in `frontend/vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
```

2. Create `frontend/.env.production`:
```
VITE_API_URL=https://your-backend.vercel.app
```

### Step 2: Deploy Frontend

1. Go to [Vercel](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository (it will show as already imported)
4. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (click Edit and select)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Add Environment Variables:**
   ```
   VITE_API_URL = https://your-backend.vercel.app
   ```

6. Click **"Deploy"**

7. **Note your frontend URL:** `https://your-project-frontend.vercel.app`

### Step 3: Update Backend CORS

Go back to your backend project in Vercel:
1. Update the `FRONTEND_URL` environment variable to your actual frontend URL
2. Redeploy the backend

---

## 🔐 Part 4: Update Google OAuth (if using)

If you set up Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Go to your OAuth credentials
3. Add to **Authorized JavaScript origins:**
   ```
   https://your-frontend.vercel.app
   ```
4. Add to **Authorized redirect URIs:**
   ```
   https://your-backend.vercel.app/api/auth/google/callback
   ```

---

## ✅ Part 5: Verify Deployment

### Test Your Application:

1. **Visit your frontend URL:** `https://your-frontend.vercel.app`
2. **Login with:**
   - Username: `admin`
   - Password: `admin123`
3. **Test all features:**
   - ✓ View dashboard
   - ✓ Manage inventory
   - ✓ View transactions
   - ✓ Check low stock alerts

### Test Google Forms Integration:

Update your Google Forms script with the new backend URL:
```javascript
var API_ENDPOINT = 'https://your-backend.vercel.app/api/transactions/submit';
```

---

## 🔄 Continuous Deployment

**Automatic Deployments:**
- Every push to `main` branch will trigger automatic deployment
- Both frontend and backend will update automatically

**Manual Deployment:**
```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main
# Vercel automatically deploys!
```

---

## 🛠️ Troubleshooting

### "Database connection failed"
- Check DATABASE_URL environment variable
- Ensure database is accessible from Vercel's servers
- Check database credentials

### "CORS error"
- Verify FRONTEND_URL in backend environment variables
- Check that backend URL in frontend is correct
- Clear browser cache

### "404 on page refresh"
- Frontend `vercel.json` should have the rewrite rule
- Check that SPA routing is configured

### "Authentication not working"
- Verify JWT_SECRET is the same in backend
- Check that cookies/localStorage are working
- Verify CORS settings allow credentials

---

## 🎯 Quick Deployment Checklist

### Backend:
- [ ] Database URL configured
- [ ] JWT_SECRET set
- [ ] FRONTEND_URL set
- [ ] Google OAuth credentials (optional)
- [ ] Database initialized
- [ ] Test endpoint: `https://your-backend.vercel.app/health`

### Frontend:
- [ ] VITE_API_URL set to backend URL
- [ ] Build successful
- [ ] Routes working
- [ ] API calls working

### Post-Deployment:
- [ ] Login working
- [ ] Data persisting
- [ ] Google Forms integration (if used)
- [ ] Google OAuth (if configured)

---

## 📝 Environment Variables Summary

### Backend (.env):
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=your-database-url
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
BACKEND_URL=https://your-backend.vercel.app
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
```

### Frontend (.env):
```env
VITE_API_URL=https://your-backend.vercel.app
```

---

## 🚀 You're Live!

Congratulations! Your EMS Inventory Tracker is now deployed and accessible worldwide.

**Share your app:**
- Frontend: `https://your-project.vercel.app`
- API Health: `https://your-api.vercel.app/health`

**Next Steps:**
- Set up custom domain (optional)
- Add monitoring (Vercel Analytics)
- Set up error tracking (Sentry)
- Configure backups for database

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Turso Database](https://docs.turso.tech)
- [GitHub Actions](https://docs.github.com/en/actions)

---

**Need Help?** 
- Check Vercel deployment logs
- Review function logs in Vercel dashboard
- Ensure all environment variables are set correctly
