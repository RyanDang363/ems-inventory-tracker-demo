# 🚑 EMS Inventory Tracker

A full-stack web application for managing medical supply inventory for ambulance companies. Features real-time tracking, Google Forms integration for employee supply requests, and a comprehensive manager dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18.2.0-blue)

---

## 📋 Features

### For Managers

- **📊 Real-time Dashboard** - Overview of inventory status, low stock alerts, and recent activity
- **📦 Inventory Management** - Add, edit, and delete supplies with category organization
- **⚠️ Low Stock Alerts** - Automatic warnings for items below threshold levels
- **📈 Analytics & Reports** - Charts showing usage trends and most-used supplies
- **📝 Transaction History** - Complete audit trail of all inventory movements
- **🔍 Search & Filter** - Quickly find supplies by name, category, or location

### For Employees

- **📱 Google Forms Integration** - Simple form to log items taken
- **🤖 Automatic Updates** - Inventory decrements automatically when form is submitted
- **📲 Mobile Friendly** - Access form via QR code or link from any device

### Technical Features

- **⚡ Fast & Modern** - Built with React, Vite, and Tailwind CSS
- **🗄️ SQLite Database** - Lightweight, zero-configuration database
- **🔒 Data Validation** - Ensures data integrity at API level
- **📊 Visual Indicators** - Color-coded stock status badges
- **🎨 Beautiful UI** - Modern, professional design with smooth animations

---

## 🛠️ Tech Stack

### Backend

- **Node.js** + **Express** - REST API server
- **SQLite** + **better-sqlite3** - Database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

### Frontend

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Chart.js** + **react-chartjs-2** - Data visualization
- **Lucide React** - Icon library

### Integration

- **Google Forms** - Employee interface
- **Google Apps Script** - Form-to-API bridge

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd ems_inventory_tracker
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Initialize the database with sample data
npm run init-db

# Start the backend server
npm start
```

The backend API will be running at `http://localhost:3000`

**Backend Scripts:**

- `npm start` - Start the server
- `npm run dev` - Start with auto-reload (Node 18+)
- `npm run init-db` - Initialize/reset database with sample data

### Step 3: Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

**Frontend Scripts:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

---

## 🚀 Quick Start

### 1. Access the Dashboard

Open your browser and navigate to `http://localhost:5173`

You'll see the manager dashboard with:

- Total supplies count
- Low stock alerts
- Recent activity
- Category breakdown

### 2. Explore the Inventory

Click "All Inventory" in the sidebar to:

- View all supplies with their quantities
- Add new supplies
- Edit existing supplies
- Delete supplies
- Search and filter by category

### 3. Check Low Stock Items

Click "Low Stock Alerts" to see:

- Critical items (at or below minimum threshold)
- Warning items (slightly above threshold)
- Visual progress bars for stock levels

### 4. View Transaction History

Click "Transactions" to see:

- Recent inventory movements
- Usage statistics
- Charts showing trends
- Most used supplies

### 5. Set Up Google Forms Integration

Follow the detailed guide in [GOOGLE_FORMS_SETUP.md](./GOOGLE_FORMS_SETUP.md) to:

- Create employee supply request form
- Configure Google Apps Script
- Connect form submissions to your API
- Test the integration

---

## 📁 Project Structure

```
ems_inventory_tracker/
├── backend/
│   ├── database/
│   │   ├── db.js              # Database connection
│   │   ├── init.js            # Database initialization & seeding
│   │   └── inventory.db       # SQLite database file
│   ├── routes/
│   │   ├── supplies.js        # Supply CRUD endpoints
│   │   ├── transactions.js    # Transaction endpoints
│   │   ├── dashboard.js       # Dashboard statistics
│   │   └── categories.js      # Category endpoints
│   ├── server.js              # Express server setup
│   ├── package.json
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   │   ├── StatCard.jsx   # Statistics card component
│   │   │   └── StockBadge.jsx # Stock status badge
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── Inventory.jsx  # Inventory management
│   │   │   ├── LowStock.jsx   # Low stock alerts
│   │   │   └── Transactions.jsx # Transaction history
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # React entry point
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── GOOGLE_FORMS_SETUP.md      # Google Forms integration guide
└── README.md                  # This file
```

---

## 🔌 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Endpoints

#### Supplies

**GET /supplies**

- Get all supplies with stock status
- Returns: Array of supply objects

**GET /supplies/low**

- Get supplies below or near minimum threshold
- Returns: Array of low-stock supplies

**GET /supplies/:id**

- Get single supply by ID
- Returns: Supply object

**POST /supplies**

- Create new supply
- Body: `{ name, category_id, current_quantity, min_threshold, unit, location, description }`
- Returns: Created supply object

**PUT /supplies/:id**

- Update existing supply
- Body: Same as POST
- Returns: Updated supply object

**DELETE /supplies/:id**

- Delete supply
- Returns: Success message

#### Transactions

**GET /transactions**

- Get transaction history
- Query params: `limit` (default: 100), `offset` (default: 0)
- Returns: Array of transactions with pagination

**GET /transactions/supply/:supplyId**

- Get transactions for specific supply
- Returns: Array of transactions

**POST /transactions**

- Create transaction (manual entry)
- Body: `{ supply_id, quantity_change, reason, employee_name, notes }`
- Returns: Transaction confirmation

**POST /transactions/submit**

- Create transaction from Google Form
- Body: `{ supply_name, quantity, employee_name, notes }`
- Returns: Transaction confirmation with updated quantity

**GET /transactions/stats**

- Get transaction statistics
- Query params: `days` (default: 30)
- Returns: Usage statistics and trends

#### Dashboard

**GET /dashboard/stats**

- Get comprehensive dashboard statistics
- Returns: Inventory stats, critical supplies, recent activity, top users

**GET /dashboard/category-summary**

- Get supplies grouped by category
- Returns: Category breakdown with counts

**GET /dashboard/usage-trends**

- Get usage trends over time
- Query params: `days` (default: 30)
- Returns: Daily usage data by category

#### Categories

**GET /categories**

- Get all categories
- Returns: Array of categories with supply counts

**POST /categories**

- Create new category
- Body: `{ name }`
- Returns: Created category

---

## 🗃️ Database Schema

### Tables

**categories**

- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT, UNIQUE)
- `created_at` (DATETIME)

**supplies**

- `id` (INTEGER, PRIMARY KEY)
- `name` (TEXT)
- `category_id` (INTEGER, FOREIGN KEY)
- `current_quantity` (INTEGER)
- `min_threshold` (INTEGER)
- `unit` (TEXT)
- `location` (TEXT)
- `description` (TEXT)
- `created_at` (DATETIME)
- `last_updated` (DATETIME)

**transactions**

- `id` (INTEGER, PRIMARY KEY)
- `supply_id` (INTEGER, FOREIGN KEY)
- `quantity_change` (INTEGER)
- `reason` (TEXT)
- `employee_name` (TEXT)
- `notes` (TEXT)
- `timestamp` (DATETIME)

### Sample Data

The database is seeded with:

- 9 medical supply categories
- 37 common EMS supplies
- Sample transaction history

Categories include:

- Airway Management
- Breathing & Oxygen
- Medications
- Bandages & Dressings
- IV Supplies
- Diagnostic Equipment
- Patient Care
- Trauma Supplies
- Personal Protection

---

## 🎨 UI Screenshots

### Dashboard

Displays overview statistics, critical supplies, recent activity, and category breakdown.

### Inventory Management

Full CRUD interface for managing supplies with search and filter capabilities.

### Low Stock Alerts

Color-coded alerts showing critical and warning-level supplies with visual progress bars.

### Transaction History

Complete audit trail with charts showing usage trends and most-used supplies.

---

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database/inventory.db
```

### Frontend Proxy

The frontend is configured to proxy API requests to the backend. See `frontend/vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:3000'
  }
}
```

---

## 🚢 Deployment

### Backend Deployment Options

**Option 1: Traditional VPS (DigitalOcean, Linode, AWS EC2)**

```bash
# Install Node.js on server
# Clone repository
# Install dependencies
cd backend && npm install
npm run init-db
npm start

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name ems-api
pm2 startup
pm2 save
```

**Option 2: Heroku**

```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

**Option 3: Railway / Render**

- Connect your GitHub repository
- Set build command: `cd backend && npm install`
- Set start command: `cd backend && npm start`

### Frontend Deployment Options

**Option 1: Vercel**

```bash
cd frontend
npm run build
vercel --prod
```

**Option 2: Netlify**

```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

**Option 3: Static Hosting (GitHub Pages, AWS S3)**

```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting provider
```

### Important Notes

- Update API endpoint in frontend after backend deployment
- Configure CORS in backend for your frontend domain
- Set up SSL/HTTPS for production
- Configure database backups
- Update Google Apps Script with production API URL

---

## 🛡️ Security Considerations

### For Production:

1. **Add Authentication**

   - Implement JWT or session-based auth
   - Protect manager dashboard routes

2. **API Key for Forms**

   - Add API key validation for Google Forms endpoint
   - Include key in Apps Script headers

3. **HTTPS Only**

   - Use SSL certificates (Let's Encrypt)
   - Redirect HTTP to HTTPS

4. **Environment Variables**

   - Never commit `.env` files
   - Use secure secret management

5. **Database Backups**

   - Implement automated backups
   - Test restore procedures

6. **Rate Limiting**

   - Implement rate limiting on API endpoints
   - Prevent abuse of public endpoints

7. **Input Validation**
   - Already implemented on API level
   - Consider adding sanitization

---

## 🧪 Testing

### Manual Testing

**Test Inventory CRUD:**

```bash
# Create supply
curl -X POST http://localhost:3000/api/supplies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Supply",
    "category_id": 1,
    "current_quantity": 50,
    "min_threshold": 10,
    "unit": "units",
    "location": "Cabinet A"
  }'

# Get all supplies
curl http://localhost:3000/api/supplies
```

**Test Transaction:**

```bash
# Submit transaction (like Google Form would)
curl -X POST http://localhost:3000/api/transactions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "supply_name": "Gauze Pads 4x4",
    "quantity": 5,
    "employee_name": "John Doe",
    "notes": "Patient care"
  }'
```

### Database Reset

```bash
cd backend
npm run init-db
```

This will reset the database to initial state with sample data.

---

## 🤝 Contributing

Contributions are welcome! Here's how to contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m 'Add some feature'`
5. Push: `git push origin feature-name`
6. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 💡 Future Enhancements

Potential features for future development:

- [ ] User authentication and role-based access
- [ ] Email notifications for critical low stock
- [ ] Barcode scanning for supplies
- [ ] Mobile app (React Native)
- [ ] Export reports to PDF/Excel
- [ ] Supplier management and auto-ordering
- [ ] Multi-location support
- [ ] Advanced analytics and forecasting
- [ ] Integration with accounting software
- [ ] Shift-based inventory checks
- [ ] Equipment maintenance tracking

---

## 🆘 Troubleshooting

### Backend won't start

- Check if port 3000 is available
- Verify Node.js version (18+)
- Run `npm install` in backend directory
- Check database permissions

### Frontend won't load

- Check if port 5173 is available
- Verify backend is running first
- Run `npm install` in frontend directory
- Clear browser cache

### Google Forms not working

- Verify API URL is publicly accessible
- Check Apps Script execution log
- Ensure supply names match exactly
- Test API endpoint with curl/Postman

### Database issues

- Run `npm run init-db` to reset
- Check file permissions on inventory.db
- Verify SQLite is installed

---

## 📧 Support

For questions, issues, or suggestions:

- Open an issue on GitHub
- Check existing documentation
- Review API logs for errors

---

## 🙏 Acknowledgments

- Built with modern web technologies
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Charts by [Chart.js](https://www.chartjs.org/)

---

## 📊 Project Stats

- **Lines of Code:** ~3,500+
- **Files:** 25+
- **Dependencies:** Minimal, focused set
- **Database Size:** ~100KB (with sample data)
- **Build Time:** < 10 seconds

---

**Made with ❤️ for EMS professionals**

🚑 Stay safe, stay stocked! 🚑
