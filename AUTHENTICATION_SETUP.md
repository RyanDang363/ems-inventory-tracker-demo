# 🔐 Authentication Setup Guide

User authentication has been added to the EMS Inventory Tracker. This guide explains how to use it.

---

## ✅ What's Been Added

### Backend:
- ✅ JWT-based authentication
- ✅ User registration and login endpoints
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Auth middleware
- ✅ Users table in database

### Frontend:
- ✅ Login page
- ✅ Register page
- ✅ Auth context/provider
- ✅ Protected routes
- ✅ Token storage
- ✅ Auto-logout on token expiry

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `jsonwebtoken` - JWT token generation/verification
- `bcryptjs` - Password hashing

### 2. Initialize Database

```bash
cd backend
npm run init-db
```

This creates:
- Users table
- Default admin user (username: `admin`, password: `admin123`)

### 3. Start Backend

```bash
cd backend
npm start
```

### 4. Start Frontend

```bash
cd frontend
npm run dev
```

### 5. Login

1. Open `http://localhost:5173`
2. You'll be redirected to `/login`
3. Use default credentials:
   - **Username:** `admin`
   - **Password:** `蓝屏123`
4. Or register a new account

---

## 📝 Default Credentials

**Username:** `admin`  
**Password:** `admin123`

**⚠️ IMPORTANT:** Change this password in production!

---

## 🔑 API Endpoints

### Public Endpoints (No Auth Required):

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@ems.local",
    "role": "manager"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

### Protected Endpoints (Auth Required):

All other endpoints now require authentication:
- `GET /api/supplies` - Requires token
- `POST /api/supplies` - Requires token
- `GET /api/dashboard/stats` - Requires token
- etc.

**Request Format:**
```http
GET /api/supplies
Authorization: Bearer <your-token>
```

---

## 🛡️ How Authentication Works

### Flow:

1. **User logs in** → Backend validates credentials
2. **Backend returns JWT token** → Token stored in localStorage
3. **Frontend includes token** → In `Authorization` header for all API calls
4. **Backend verifies token** → Middleware checks token on protected routes
5. **Request proceeds** → If valid, or 401 if invalid/expired

### Token Storage:

- Stored in `localStorage` as `token`
- Automatically included in API requests
- Expires after 7 days (configurable)
- Automatically cleared on logout or expiry

---

## 🔧 Configuration

### Environment Variables

Create `.env` file in `backend/`:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

**For Production:**
- Use a strong, random JWT_SECRET
- Consider shorter expiry times
- Use HTTPS only

---

## 📋 Protected Routes

### Backend Routes:

These routes require authentication:
- `/api/supplies/*` - All supply operations
- `/api/transactions/*` - All transaction operations (except `/submit`)
- `/api/dashboard/*` - Dashboard statistics
- `/api/categories/*` - Category management

### Public Routes:

- `/api/auth/*` - Authentication endpoints
- `/api/transactions/submit` - Google Forms endpoint (public)
- `/health` - Health check

### Frontend Routes:

Protected (require login):
- `/dashboard`
- `/inventory`
- `/low-stock`
- `/transactions`

Public:
- `/login`
- `/register`

---

## 🎨 Using Authentication in Components

### Using Auth Context:

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout, token } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Calls:

```javascript
import { apiCall } from '../utils/api';

// GET request
const response = await apiCall('/api/supplies');
const data = await response.json();

// POST request
const response = await apiCall('/api/supplies', {
  method: 'POST',
  body: JSON.stringify({
    name: 'New Supply',
    // ...
  })
});
```

---

## 🔄 Migration Guide

### For Existing Users:

If you have an existing database:

1. **Backup your database:**
   ```bash
   cp backend/database/inventory.db backend/database/inventory.db.backup
   ```

2. **Reinitialize database:**
   ```bash
   cd backend
   npm run init-db
   ```

   ⚠️ **Warning:** This will reset your database! Make sure to backup first.

3. **Create admin user:**
   The init script creates a default admin user automatically.

### For Google Forms:

The Google Forms endpoint (`/api/transactions/submit`) remains **public** so employees can still submit forms without authentication.

**For production, consider:**
- Adding API key authentication
- Rate limiting
- IP whitelisting

---

## 🐛 Troubleshooting

### "Access token required" Error

**Problem:** API returns 401 error

**Solutions:**
- Check if you're logged in
- Verify token is in localStorage: `localStorage.getItem('token')`
- Try logging out and back in
- Check token hasn't expired

### Can't Login

**Problem:** Login fails

**Solutions:**
- Verify backend is running
- Check default credentials: `admin` / `admin123`
- Check browser console for errors
- Verify database is initialized

### Redirect Loop

**Problem:** Keeps redirecting to login

**Solutions:**
- Clear localStorage: `localStorage.clear()`
- Check token is valid: Try `/api/auth/verify`
- Restart backend server

### Google Forms Not Working

**Problem:** Form submissions fail

**Solutions:**
- Verify `/api/transactions/submit` endpoint is public (it should be)
- Check backend logs for errors
- Verify API URL in Apps Script

---

## 🔒 Security Best Practices

### Already Implemented:
- ✅ Password hashing (bcrypt)
- ✅ JWT tokens
- ✅ Token expiration
- ✅ Protected routes
- ✅ Secure password storage

### Recommended for Production:
- [ ] Use HTTPS only
- [ ] Strong JWT_SECRET (32+ random characters)
- [ ] Shorter token expiry (1-2 hours)
- [ ] Refresh tokens for long sessions
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout after failed attempts
- [ ] Password complexity requirements
- [ ] Two-factor authentication (optional)
- [ ] Session management
- [ ] Audit logging

---

## 📊 User Roles

Currently supports:
- `manager` - Full access (default)

Future roles (not yet implemented):
- `employee` - Read-only access
- `admin` - Full access + user management

---

## 🎯 Next Steps

1. **Test authentication:**
   - Login with default credentials
   - Register new user
   - Try accessing protected routes without login

2. **Customize:**
   - Change default admin password
   - Adjust token expiry
   - Add role-based permissions

3. **Deploy:**
   - Set strong JWT_SECRET
   - Use HTTPS
   - Configure CORS for production domain

---

## 📝 Summary

✅ **Authentication is now enabled!**

- Default login: `admin` / `admin123`
- All dashboard routes require login
- Google Forms endpoint remains public
- Tokens expire after 7 days
- Auto-logout on token expiry

**Happy secure tracking! 🔐**

