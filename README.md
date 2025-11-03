# EMS Inventory Tracker

A full-stack inventory management system built for Emergency Medical Services teams. This was my solution to help EMS managers track medical supplies, monitor stock levels, and handle supply usage reporting from field staff.

**[Live Demo](https://emsinventorytracker.vercel.app)** - Try it out with demo credentials shown on the login page.

## What It Does

When I started this project, I wanted to solve a real problem: EMS teams need to track medical supplies efficiently, but most solutions are either too complex or too expensive. This app gives managers a clean dashboard to:

- Monitor inventory levels in real-time
- Get alerts when supplies run low
- Track who used what supplies and when
- Manage inventory directly from the dashboard

Field staff can report supply usage through a simple Google Form, which automatically updates the database. No manual data entry needed.

## Tech Stack

**Frontend:** React, TailwindCSS, Recharts  
**Backend:** Node.js, Express, MongoDB Atlas  
**Deployment:** Vercel (single deployment)  
**Authentication:** JWT tokens

I chose MongoDB Atlas because I needed a cloud database that persists data across deployments. Vercel's serverless functions don't maintain state, so SQLite wasn't an option.

## Getting Started

You'll need Node.js 18+ and a MongoDB Atlas account (free tier works fine).

```bash
# Clone and install
git clone https://github.com/RyanDang363/ems-inventory-tracker-demo.git
cd ems-inventory-tracker-demo

# Backend setup
cd backend
npm install
# Create .env file with your MongoDB connection string
npm run seed  # Populates database with sample data

# Frontend setup
cd ../frontend
npm install
npm run dev
```

The app runs on `http://localhost:5173`. Default login credentials are `manager1` / `password123`.

## Google Forms Integration

One of the cooler features is the Google Forms integration. Field staff fill out a form, and it automatically updates inventory. Here's how I set it up:

1. Create a Google Form with three fields: Employee Name, Supply Item (dropdown), and Quantity
2. Add the Apps Script from `google-forms-script.js` to your form
3. Update the `API_ENDPOINT` variable to your deployed URL
4. Set up a trigger for "On form submit"

The script sends form data to the backend API, which updates the database and records the transaction. It handles edge cases like when someone requests more supplies than available (sets quantity to 0 instead of going negative).

## Project Structure

```
backend/
  ├── routes/        # API endpoints
  ├── models/        # Mongoose schemas
  ├── database/      # DB connection and seeding
  └── middleware/    # Auth middleware

frontend/
  ├── src/
  │   ├── pages/     # Main views
  │   ├── components/ # Reusable components
  │   └── utils/     # API client
```

## API Overview

**Public endpoints:**

- `POST /api/auth/login` - Manager login
- `POST /api/google-forms/submit` - Google Forms submission

**Protected endpoints (require JWT):**

- `GET /api/inventory/supplies` - List all supplies
- `GET /api/inventory/dashboard` - Dashboard stats
- `PUT /api/inventory/supplies/:id` - Update supply
- `DELETE /api/inventory/supplies/:id` - Delete supply

All inventory management routes require authentication. The Google Forms endpoint is intentionally public so it can be called from Google Apps Script.

## Environment Variables

Create a `backend/.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

For Vercel deployment, add these same variables in your project settings.

## Notes on Security

This is a demo project, so I kept some things simple:

- Passwords are stored in plaintext (would use bcrypt in production)
- No rate limiting on public endpoints (would add this for production)
- JWT tokens expire after 7 days

The authentication system works, but a production app would need additional security layers.

## Deployment

The app is configured for a single Vercel deployment. After connecting your GitHub repo, Vercel automatically deploys on every push to main. Make sure to set environment variables in Vercel's dashboard.

## License

MIT
