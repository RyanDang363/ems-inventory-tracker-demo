# EMS Inventory Tracker

A modern inventory management system for Emergency Medical Services (EMS) teams to track medical supplies, monitor stock levels, and integrate with Google Forms for easy supply usage reporting.

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://emsinventorytracker.vercel.app)

## Features

- **Dashboard** - Real-time overview of inventory status and low stock alerts
- **Inventory Management** - Track and manage medical supplies with full CRUD operations
- **Low Stock Monitoring** - Automatic alerts for supplies running low
- **Transaction History** - Complete audit trail of inventory changes
- **Manager Authentication** - Secure login system with JWT tokens
- **Google Forms Integration** - Allow field staff to report supply usage via forms
- **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

**Frontend**
- React 18 with React Router
- TailwindCSS for styling
- Recharts for data visualization
- Axios for API calls

**Backend**
- Node.js with Express
- MongoDB Atlas (cloud database)
- Mongoose ODM
- JWT authentication

**Deployment**
- Vercel (frontend + backend combined)
- MongoDB Atlas (database)

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RyanDang363/ems-inventory-tracker-demo.git
cd ems-inventory-tracker-demo
```

2. **Set up environment variables**

Create `backend/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

3. **Install dependencies and seed database**
```bash
# Backend
cd backend
npm install
npm run seed

# Frontend
cd ../frontend
npm install
```

4. **Run locally**
```bash
# Terminal 1 - Backend (from backend/)
npm start

# Terminal 2 - Frontend (from frontend/)
npm run dev
```

5. **Access the app**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

### Default Login Credentials

- **Username:** `manager1` | **Password:** `password123`
- **Username:** `manager2` | **Password:** `password123`

## Google Forms Integration

1. Create a Google Form with these fields:
   - **Employee Name** (Short answer, required)
   - **Supply Item** (Dropdown, required) - populate with supply names from your inventory
   - **Quantity** (Number, required)

2. Add the Google Apps Script:
   - Open your form → Click the 3 dots menu → Script editor
   - Copy the code from `google-forms-script.js`
   - Update `API_ENDPOINT` to your deployed URL
   - Save and authorize the script

3. Set up form trigger:
   - In Apps Script editor → Triggers (clock icon)
   - Add trigger: `onFormSubmit` → Head → From form → On form submit

## Deployment

The app is configured for single Vercel deployment (frontend + backend combined).

1. **Push to GitHub** (already connected)
```bash
git push
```

2. **Environment Variables on Vercel**

Set these in your Vercel project settings:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to `production`

3. **Deploy**

Vercel will automatically deploy on every push to main branch.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Manager login
- `GET /api/auth/verify` - Verify JWT token

### Inventory (Protected)
- `GET /api/inventory/supplies` - Get all supplies
- `GET /api/inventory/low-stock` - Get low stock items  
- `GET /api/inventory/dashboard` - Get dashboard stats
- `PUT /api/inventory/supplies/:id` - Update supply
- `DELETE /api/inventory/supplies/:id` - Delete supply

### Google Forms (Public)
- `POST /api/google-forms/submit` - Submit supply usage

## Database Schema

**Users**
- username, password, fullName

**Categories**
- name (Airway Management, Medications, etc.)

**Supplies**
- name, category_id, current_quantity, min_threshold, unit, description

**Transactions**
- supply_id, quantity_change, type, employee_name, timestamp

## License

MIT

## Author

Ryan Dang
