# 🔐 Google Sign-In (OAuth) Setup Guide

This guide will help you set up Google Sign-In authentication for your EMS Inventory Tracker.

---

## 📋 Prerequisites

- Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Backend server running
- Frontend server running

---

## 🚀 Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

### 1.2 Enable Google+ API

1. Go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click **"Enable"**

### 1.3 Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen first:
   - Choose **"External"** (or Internal if using Google Workspace)
   - Fill in required fields:
     - App name: **"EMS Inventory Tracker"**
     - User support email: Your email
     - Developer contact: Your email
   - Click **"Save and Continue"**
   - Add scopes: `userinfo.email`, `userinfo.profile`
   - Add test users (if in testing mode)
   - Save

4. Create OAuth Client ID:
   - Application type: **"Web application"**
   - Name: **"EMS Inventory Tracker Web Client"**
   - Authorized JavaScript origins:
     ```
     http://localhost:5173
     http://localhost:3000
     ```
     (Add your production URLs when deploying)
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/google/callback
     ```
     (Add production URL: `https://your-domain.com/api/auth/google/callback`)
   - Click **"Create"**

5. **Copy your credentials:**
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `xxxxx` (click "Show" to reveal)

---

## 🔧 Step 2: Configure Backend Environment Variables

### 2.1 Create/Update `.env` file

In `backend/` directory, create or update `.env`:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Backend URL (for OAuth callback)
BACKEND_URL=http://localhost:3000

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development
```

### 2.2 Install Dependencies

```bash
cd backend
npm install
```

This installs `google-auth-library`.

---

## 🗄️ Step 3: Update Database Schema

The database schema has been updated to support Google OAuth users. If you have an existing database:

**Option A: Reinitialize (Wipes existing data):**
```bash
cd backend
npm run init-db
```

**Option B: Manual Migration (Preserves data):**
```sql
-- Run these SQL commands on your database
ALTER TABLE users ADD COLUMN google_id TEXT UNIQUE;
-- Make username and password_hash nullable for OAuth users
-- Note: SQLite doesn't support ALTER COLUMN, so you'd need to recreate the table
```

---

## ✅ Step 4: Test Google Sign-In

### 4.1 Start Backend

```bash
cd backend
npm start
```

### 4.2 Start Frontend

```bash
cd frontend
npm run dev
```

### 4.3 Test Sign-In

1. Open `http://localhost:5173`
2. Click **"Sign in with Google"** button
3. You'll be redirected to Google
4. Sign in with your Google account
5. Authorize the application
6. You'll be redirected back and logged in!

---

## 🔄 How It Works

### Flow:

```
1. User clicks "Sign in with Google"
   ↓
2. Frontend requests OAuth URL from backend
   ↓
3. Backend generates Google OAuth URL
   ↓
4. User redirected to Google
   ↓
5. User authorizes application
   ↓
6. Google redirects to /api/auth/google/callback?code=xxx
   ↓
7. Backend exchanges code for tokens
   ↓
8. Backend gets user info from Google
   ↓
9. Backend creates/finds user in database
   ↓
10. Backend generates JWT token
   ↓
11. Backend redirects to frontend with token
   ↓
12. Frontend stores token and logs user in
```

---

## 🎯 Features

✅ **Automatic Account Creation** - New users are created automatically  
✅ **Account Linking** - Links Google account to existing email-based accounts  
✅ **Seamless Login** - Users can use Google or email/password  
✅ **JWT Tokens** - Same authentication system as email/password  
✅ **Secure** - Uses Google's OAuth 2.0 flow  

---

## 🔒 Security Considerations

### Already Implemented:
- ✅ OAuth 2.0 standard flow
- ✅ Token verification
- ✅ Secure token exchange
- ✅ Database user creation

### Recommended:
- [ ] Verify email domain (for organization-only access)
- [ ] Require specific Google Workspace domain
- [ ] Add rate limiting on OAuth endpoints
- [ ] Log OAuth sign-ins for audit
- [ ] Handle account linking conflicts

---

## 🐛 Troubleshooting

### "Google OAuth not configured"

**Problem:** Error when clicking Google Sign-In button

**Solutions:**
- ✅ Check `.env` file has `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- ✅ Restart backend server after adding env variables
- ✅ Verify credentials are correct

### "Redirect URI mismatch"

**Problem:** Google shows "redirect_uri_mismatch" error

**Solutions:**
- ✅ Check redirect URI in Google Console matches exactly:
  - Development: `http://localhost:3000/api/auth/google/callback`
  - Production: `https://your-domain.com/api/auth/google/callback`
- ✅ Check authorized JavaScript origins include frontend URL
- ✅ Wait a few minutes after updating (Google caches settings)

### "User not created"

**Problem:** Google sign-in works but user not in database

**Solutions:**
- ✅ Check backend logs for errors
- ✅ Verify database permissions
- ✅ Check if email already exists (may link to existing account)

### "Token invalid"

**Problem:** After Google sign-in, token doesn't work

**Solutions:**
- ✅ Check JWT_SECRET is set correctly
- ✅ Verify token is being stored in localStorage
- ✅ Check backend `/api/auth/verify` endpoint

---

## 📝 Production Deployment

### Update Google Cloud Console:

1. Add production URLs to **Authorized JavaScript origins**:
   ```
   https://your-frontend-domain.com
   ```

2. Add production redirect URI:
   ```
   https://your-backend-domain.com/api/auth/google/callback
   ```

### Update Environment Variables:

```env
GOOGLE_CLIENT_ID=your-production-client-id
GOOGLE_CLIENT_SECRET=your-production-client-secret
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

### Notes:

- **HTTPS Required** - Google OAuth requires HTTPS in production
- **Domain Verification** - May need to verify domain ownership
- **OAuth Consent Screen** - Update with production app details

---

## 🎨 Customization

### Restrict to Specific Domain:

Edit `backend/routes/googleAuth.js`:

```javascript
// After getting user info from Google
const emailDomain = email.split('@')[1];
if (emailDomain !== 'yourcompany.com') {
  return res.redirect(`${FRONTEND_URL}/login?error=invalid_domain`);
}
```

### Auto-assign Roles:

```javascript
// In googleAuth.js callback handler
const role = emailDomain === 'admin.yourcompany.com' ? 'admin' : 'manager';
```

---

## 📊 Database Schema

Users table now supports:
- `google_id` - Google user ID (unique)
- `username` - Can be null for OAuth-only users
- `password_hash` - Can be null for OAuth-only users
- `email` - Required (from Google)

---

## ✅ Checklist

- [ ] Google Cloud project created
- [ ] OAuth credentials created
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Database schema updated
- [ ] Backend restarted
- [ ] Tested Google Sign-In
- [ ] Production URLs configured (when deploying)

---

## 🎉 You're Done!

Google Sign-In is now enabled! Users can:
- Sign in with Google account
- Automatically create accounts
- Link Google to existing accounts
- Use either Google or email/password login

**Happy secure authentication! 🔐**

