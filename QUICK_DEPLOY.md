# 🚀 Quick Deploy to GitHub & Vercel

## Step 1: Push to GitHub

```bash
# Initialize git and push to GitHub
git init
git add .
git commit -m "Initial commit: EMS Inventory Tracker"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/ems-inventory-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Backend Deployment:

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project" → Import your GitHub repo
3. **Configure:**
   - Root Directory: `backend`
   - Framework: Other
   - Add Environment Variables:
     ```
     NODE_ENV=production
     JWT_SECRET=your-secure-random-string-here
     JWT_EXPIRES_IN=7d
     DATABASE_URL=your-database-url
     FRONTEND_URL=https://your-frontend.vercel.app
     ```
4. Deploy!

### Frontend Deployment:

1. Add another new project in Vercel
2. Import same GitHub repo
3. **Configure:**
   - Root Directory: `frontend`
   - Framework: Vite
   - Add Environment Variable:
     ```
     VITE_API_URL=https://your-backend.vercel.app
     ```
4. Deploy!

## Step 3: Database Setup

### Option A: Use Vercel Postgres (Easiest)

1. In your backend project on Vercel
2. Go to Storage → Create Database → Postgres
3. It auto-adds connection variables
4. Run init script via Vercel CLI:
   ```bash
   npm i -g vercel
   vercel link
   vercel env pull
   cd backend && node database/init.js
   ```

### Option B: Use Turso (SQLite Cloud)

1. Sign up at [turso.tech](https://turso.tech)
2. Create database
3. Get connection URL
4. Add as DATABASE_URL in Vercel

## ✅ You're Done!

Your app is live at:

- Frontend: `https://your-project.vercel.app`
- Backend API: `https://your-project-backend.vercel.app`

Default login:

- Username: `admin`
- Password: `admin123`

---

**Need detailed instructions?** See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
