# 📁 Complete File-by-File Explanation & Tech Stack Breakdown

## 🏗️ Project Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│                    Port: 5173                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Dashboard │  │Inventory │  │Low Stock │  │Transactions│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTP/REST API (fetch)
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                    BACKEND (Express)                          │
│                    Port: 3000                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Supplies  │  │Trans.    │  │Dashboard │  │Categories│    │
│  │Routes    │  │Routes    │  │Routes    │  │Routes    │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└────────────────────┬─────────────────────────────────────────┘
                     │ SQL Queries
                     │
┌────────────────────▼─────────────────────────────────────────┐
│              DATABASE (SQLite)                                 │
│         backend/database/inventory.db                          │
└───────────────────────────────────────────────────────────────┘
```

---

## 📂 Root Directory Files

### **`README.md`**
**Purpose:** Main project documentation  
**Tech Stack Role:** Documentation (Markdown)  
**What it does:**
- Complete project overview
- Installation instructions
- API documentation
- Deployment guides
- Troubleshooting tips

---

### **`START_HERE.md`**
**Purpose:** Quick start guide for new users  
**Tech Stack Role:** User documentation  
**What it does:**
- Step-by-step getting started instructions
- Feature overview
- Testing instructions

---

### **`SETUP_GUIDE.md`**
**Purpose:** Detailed setup instructions  
**Tech Stack Role:** Setup documentation  
**What it does:**
- Prerequisites
- Installation steps
- Configuration guide

---

### **`FEATURES.md`**
**Purpose:** Feature documentation with visual descriptions  
**Tech Stack Role:** Feature documentation  
**What it does:**
- Lists all features
- Screenshots/descriptions
- User workflows

---

### **`GOOGLE_FORMS_SETUP.md`**
**Purpose:** Google Forms integration guide  
**Tech Stack Role:** Integration documentation  
**What it does:**
- How to set up Google Forms
- Apps Script configuration
- Connection to API

---

### **`PROJECT_SUMMARY.md`**
**Purpose:** High-level project summary  
**Tech Stack Role:** Project overview  
**What it does:**
- Project goals
- Architecture overview
- Technology choices

---

### **`google-forms-sample.js`**
**Purpose:** Sample Google Apps Script code  
**Tech Stack Role:** Google Apps Script integration  
**What it does:**
- Copy-paste script for Google Forms
- Handles form submission
- Sends POST request to `/api/transactions/submit`
- Error handling and logging

**Key Functions:**
- `onFormSubmit(e)` - Triggered when form is submitted
- Extracts form data (employee name, supply name, quantity)
- Sends JSON payload to Express API
- Handles errors and sends notifications

**Tech Stack Integration:**
- Uses Google Apps Script runtime
- Makes HTTP requests to Express backend
- Connects Google Forms (external) → Express API (backend)

---

### **`start.sh`** & **`start.ps1`**
**Purpose:** Automated startup scripts  
**Tech Stack Role:** Development tooling (Bash/PowerShell)  
**What it does:**
- Checks Node.js installation
- Installs dependencies if needed
- Initializes database if missing
- Starts backend and frontend servers
- Runs both in background

**Tech Stack Integration:**
- Orchestrates Node.js processes
- Manages npm package installation
- Coordinates Express + Vite servers

---

### **`test-api.sh`** & **`test-api.ps1`**
**Purpose:** API testing scripts  
**Tech Stack Role:** Testing tooling (curl commands)  
**What it does:**
- Tests Express API endpoints
- Validates API responses
- Health check verification

---

### **`.gitignore`**
**Purpose:** Git ignore rules  
**Tech Stack Role:** Version control configuration  
**What it does:**
- Excludes `node_modules/`
- Excludes database files
- Excludes build artifacts
- Excludes environment files

---

## 🔧 Backend Files (`backend/`)

### **`backend/package.json`**
**Purpose:** Node.js project configuration  
**Tech Stack Role:** Dependency management (npm)  
**What it does:**
- Lists dependencies: `express`, `cors`, `better-sqlite3`, `dotenv`
- Defines scripts: `start`, `dev`, `init-db`
- Sets ES modules (`"type": "module"`)

**Key Dependencies:**
- **express** - Web framework for REST API
- **cors** - Cross-origin resource sharing middleware
- **better-sqlite3** - SQLite database driver
- **dotenv** - Environment variable loader

---

### **`backend/server.js`**
**Purpose:** Express server entry point  
**Tech Stack Role:** Backend server (Express.js)  
**What it does:**
- Creates Express app instance
- Configures middleware (CORS, JSON parsing)
- Registers route handlers
- Sets up error handling
- Starts HTTP server on port 3000

**Express Features Used:**
- `express()` - App creation
- `app.use()` - Middleware registration
- `app.use('/api/...', router)` - Route mounting
- `app.listen()` - Server startup

**Tech Stack Integration:**
- Coordinates all backend routes
- Handles HTTP requests/responses
- Provides REST API foundation

---

### **`backend/database/db.js`**
**Purpose:** SQLite database connection  
**Tech Stack Role:** Database access layer (better-sqlite3)  
**What it does:**
- Creates SQLite database connection
- Enables foreign key constraints
- Exports singleton database instance
- Handles file path resolution (ES modules)

**Tech Stack Integration:**
- Used by all route files to query database
- Provides prepared statements for SQL queries
- Manages database connection lifecycle

---

### **`backend/database/init.js`**
**Purpose:** Database initialization and seeding  
**Tech Stack Role:** Database setup script  
**What it does:**
- Creates database tables (categories, supplies, transactions)
- Creates indexes for performance
- Seeds 9 medical categories
- Seeds 37 sample EMS supplies
- Adds 6 sample transactions

**Tech Stack Integration:**
- Runs once during setup (`npm run init-db`)
- Sets up database schema
- Populates initial data

---

### **`backend/database/inventory.db`**
**Purpose:** SQLite database file  
**Tech Stack Role:** Data persistence (SQLite)  
**What it does:**
- Stores all application data
- Contains 3 tables with relationships
- Binary SQLite format

**Tech Stack Integration:**
- Accessed via `better-sqlite3` driver
- File-based database (no server needed)
- Single file contains entire database

---

### **`backend/routes/supplies.js`**
**Purpose:** Supply CRUD API endpoints  
**Tech Stack Role:** Express Router (REST API)  
**What it does:**
- `GET /api/supplies` - List all supplies with stock status
- `GET /api/supplies/low` - Get low stock items
- `GET /api/supplies/:id` - Get single supply
- `POST /api/supplies` - Create new supply
- `PUT /api/supplies/:id` - Update supply
- `DELETE /api/supplies/:id` - Delete supply
- `GET /api/supplies/search/:query` - Search supplies

**Tech Stack Integration:**
- Uses Express Router
- Queries SQLite via `db.prepare()`
- Returns JSON responses
- Handles validation and errors

---

### **`backend/routes/transactions.js`**
**Purpose:** Transaction API endpoints  
**Tech Stack Role:** Express Router (REST API)  
**What it does:**
- `GET /api/transactions` - List transactions (paginated)
- `GET /api/transactions/supply/:supplyId` - Get transactions for a supply
- `POST /api/transactions` - Create transaction (manual)
- `POST /api/transactions/submit` - **Google Forms webhook endpoint**
- `GET /api/transactions/stats` - Usage statistics

**Tech Stack Integration:**
- Receives POST from Google Apps Script
- Updates SQLite database atomically (transactions)
- Updates supply quantities
- Returns success/error responses

**Key Endpoint - `/api/transactions/submit`:**
- Receives: `{ supply_name, quantity, employee_name, notes }`
- Finds supply by name
- Creates transaction record
- Updates supply quantity
- Returns updated supply info

---

### **`backend/routes/dashboard.js`**
**Purpose:** Dashboard statistics API  
**Tech Stack Role:** Express Router (REST API)  
**What it does:**
- `GET /api/dashboard/stats` - Overall statistics
- `GET /api/dashboard/category-summary` - Category breakdown
- `GET /api/dashboard/usage-trends` - Usage trends over time

**Tech Stack Integration:**
- Aggregates data from multiple tables
- Calculates statistics (totals, averages, counts)
- Provides data for React dashboard
- Uses SQL JOINs to combine data

---

### **`backend/routes/categories.js`**
**Purpose:** Category API endpoints  
**Tech Stack Role:** Express Router (REST API)  
**What it does:**
- `GET /api/categories` - List all categories with supply counts
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create new category

**Tech Stack Integration:**
- Manages category data
- Used by Inventory page for dropdowns
- Provides category filtering data

---

## 🎨 Frontend Files (`frontend/`)

### **`frontend/package.json`**
**Purpose:** React project configuration  
**Tech Stack Role:** Dependency management (npm)  
**What it does:**
- Lists dependencies: `react`, `react-router-dom`, `chart.js`, `lucide-react`
- Lists devDependencies: `vite`, `tailwindcss`, `@vitejs/plugin-react`
- Defines scripts: `dev`, `build`, `preview`

**Key Dependencies:**
- **react** - UI library
- **react-router-dom** - Client-side routing
- **chart.js** + **react-chartjs-2** - Data visualization
- **lucide-react** - Icon library
- **vite** - Build tool and dev server
- **tailwindcss** - CSS framework

---

### **`frontend/index.html`**
**Purpose:** HTML entry point  
**Tech Stack Role:** HTML document  
**What it does:**
- Base HTML structure
- Contains `<div id="root">` for React mounting
- Loads main.jsx via Vite

**Tech Stack Integration:**
- Vite processes this file
- React mounts into `#root` div
- Entry point for entire frontend

---

### **`frontend/vite.config.js`**
**Purpose:** Vite build configuration  
**Tech Stack Role:** Build tool configuration  
**What it does:**
- Configures React plugin
- Sets dev server port (5173)
- Sets up API proxy: `/api/*` → `http://localhost:3000`

**Tech Stack Integration:**
- Vite uses this for dev server
- Proxy forwards API calls to Express backend
- Enables CORS-free frontend development

**Key Configuration:**
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
  }
}
```
This allows React to call `/api/supplies` and Vite forwards it to Express.

---

### **`frontend/tailwind.config.js`**
**Purpose:** Tailwind CSS configuration  
**Tech Stack Role:** CSS framework configuration  
**What it does:**
- Configures content paths (where to look for classes)
- Defines custom colors (ems-blue, ems-red, ems-green)
- Extends default theme

**Tech Stack Integration:**
- Tailwind scans files for class usage
- Generates CSS from utility classes
- Provides design system colors

---

### **`frontend/postcss.config.js`**
**Purpose:** PostCSS configuration  
**Tech Stack Role:** CSS processing  
**What it does:**
- Configures Tailwind CSS plugin
- Configures Autoprefixer (vendor prefixes)

**Tech Stack Integration:**
- Processes CSS files
- Compiles Tailwind utilities
- Adds browser prefixes

---

### **`frontend/src/main.jsx`**
**Purpose:** React application entry point  
**Tech Stack Role:** React initialization  
**What it does:**
- Imports React and ReactDOM
- Imports App component
- Imports global CSS
- Renders App into DOM root
- Wraps in StrictMode for development checks

**Tech Stack Integration:**
- First JavaScript file executed
- Mounts React app
- Connects React to DOM

---

### **`frontend/src/index.css`**
**Purpose:** Global CSS styles  
**Tech Stack Role:** Styling (Tailwind CSS)  
**What it does:**
- Imports Tailwind directives (`@tailwind base/components/utilities`)
- Sets global font family
- Custom scrollbar styling
- Base body styles

**Tech Stack Integration:**
- Tailwind processes this file
- Generates utility classes
- Provides base styles

---

### **`frontend/src/App.jsx`**
**Purpose:** Main React application component  
**Tech Stack Role:** React Router setup + Layout  
**What it does:**
- Sets up React Router with BrowserRouter
- Defines routes: `/dashboard`, `/inventory`, `/low-stock`, `/transactions`
- Provides layout structure (Sidebar + Header + Main content)
- Manages sidebar open/close state
- Handles navigation

**Tech Stack Integration:**
- Uses React Router for client-side routing
- Renders different page components based on URL
- Provides consistent layout across pages

**Key Features:**
- Responsive sidebar (mobile/desktop)
- Header with title
- Route matching and navigation

---

### **`frontend/src/components/Sidebar.jsx`**
**Purpose:** Navigation sidebar component  
**Tech Stack Role:** React component (UI)  
**What it does:**
- Displays navigation menu
- Shows active route highlighting
- Responsive (mobile/desktop)
- Uses Lucide React icons
- Links to all pages

**Tech Stack Integration:**
- Uses React Router's `Link` and `useLocation`
- Uses Lucide React for icons
- Uses Tailwind CSS for styling

---

### **`frontend/src/components/StatCard.jsx`**
**Purpose:** Reusable statistics card component  
**Tech Stack Role:** React component (UI)  
**What it does:**
- Displays a statistic (title, value, subtitle)
- Shows icon with color coding
- Used in Dashboard page

**Tech Stack Integration:**
- Pure React component (no API calls)
- Receives props from parent
- Uses Tailwind CSS for styling

---

### **`frontend/src/components/StockBadge.jsx`**
**Purpose:** Stock status badge component  
**Tech Stack Role:** React component (UI)  
**What it does:**
- Displays colored badge for stock status
- Three states: "Critical Low" (red), "Low Stock" (yellow), "In Stock" (green)
- Used throughout app to show supply status

**Tech Stack Integration:**
- Pure React component
- Uses Tailwind CSS classes
- Conditional rendering based on status prop

---

### **`frontend/src/pages/Dashboard.jsx`**
**Purpose:** Main dashboard page  
**Tech Stack Role:** React page component  
**What it does:**
- Fetches dashboard stats from `/api/dashboard/stats`
- Displays 4 stat cards (Total Supplies, Critical Low, Low Stock, Recent Activity)
- Shows critical supplies table
- Shows recent activity feed
- Shows category breakdown
- Shows top users

**Tech Stack Integration:**
- Uses `fetch()` to call Express API
- Uses `useState` and `useEffect` hooks
- Uses StatCard and StockBadge components
- Uses Lucide React icons
- Displays data from SQLite via Express API

**Data Flow:**
```
Dashboard.jsx → fetch('/api/dashboard/stats') 
→ Express Router → dashboard.js 
→ SQLite queries → JSON response 
→ React state → UI rendering
```

---

### **`frontend/src/pages/Inventory.jsx`**
**Purpose:** Inventory management page  
**Tech Stack Role:** React page component  
**What it does:**
- Lists all supplies in a table
- Search and filter functionality
- Add/Edit/Delete supplies
- Modal forms for create/edit
- Category filtering
- Stock badge display

**Tech Stack Integration:**
- Uses `fetch()` for CRUD operations
- GET `/api/supplies` - List supplies
- POST `/api/supplies` - Create supply
- PUT `/api/supplies/:id` - Update supply
- DELETE `/api/supplies/:id` - Delete supply
- GET `/api/categories` - Get categories for dropdown

**Features:**
- Real-time search filtering
- Category dropdown filter
- Form validation
- Confirmation dialogs for delete

---

### **`frontend/src/pages/LowStock.jsx`**
**Purpose:** Low stock alerts page  
**Tech Stack Role:** React page component  
**What it does:**
- Fetches low stock items from `/api/supplies/low`
- Displays supplies below threshold
- Shows progress bars for stock levels
- Color-coded alerts (Critical/Warning)

**Tech Stack Integration:**
- Uses `fetch('/api/supplies/low')`
- Express routes to SQLite query
- Calculates stock percentages
- Visual indicators with Tailwind CSS

---

### **`frontend/src/pages/Transactions.jsx`**
**Purpose:** Transaction history page  
**Tech Stack Role:** React page component  
**What it does:**
- Lists all transactions
- Shows usage statistics
- Displays charts (Line, Bar, Doughnut)
- Time range filtering (7/30/90 days)
- Most used supplies visualization

**Tech Stack Integration:**
- Uses Chart.js via `react-chartjs-2`
- Fetches from `/api/transactions`
- Fetches stats from `/api/transactions/stats`
- Visualizes SQLite data
- Uses Lucide React icons

**Charts:**
- Line chart: Daily activity trends
- Bar chart: Most used supplies
- Doughnut chart: Category distribution

---

## 🔄 Complete Data Flow Example

### **Scenario: Employee submits Google Form**

```
1. Employee fills Google Form
   ↓
2. Google Form submits
   ↓
3. google-forms-sample.js (Apps Script) triggers
   ↓
4. Apps Script extracts form data
   ↓
5. POST request to: http://localhost:3000/api/transactions/submit
   Body: {
     supply_name: "Gauze Pads 4x4",
     quantity: 5,
     employee_name: "John Smith",
     notes: "Used on call"
   }
   ↓
6. Express server.js receives request
   ↓
7. Routes to backend/routes/transactions.js
   ↓
8. transactions.js handles POST /submit
   ↓
9. Queries SQLite via db.js:
   - Find supply by name
   - Create transaction record
   - Update supply quantity
   ↓
10. SQLite (inventory.db) updates:
    - transactions table: INSERT new row
    - supplies table: UPDATE current_quantity
   ↓
11. Express returns JSON response:
    {
      success: true,
      new_quantity: 195,
      ...
    }
   ↓
12. Manager opens Dashboard.jsx
   ↓
13. Dashboard.jsx fetches /api/dashboard/stats
   ↓
14. Express queries SQLite for aggregated stats
   ↓
15. React renders updated statistics
   ↓
16. Manager sees updated inventory levels
```

---

## 🎯 Tech Stack Summary by Layer

### **Frontend Layer:**
- **React 18** - Component library
- **React Router** - Client-side routing
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling framework
- **Chart.js** - Data visualization
- **Lucide React** - Icons

### **Backend Layer:**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **better-sqlite3** - Database driver
- **CORS** - Cross-origin middleware
- **dotenv** - Environment variables

### **Database Layer:**
- **SQLite** - Embedded database
- **SQL** - Query language
- **Foreign Keys** - Data integrity

### **Integration Layer:**
- **Google Apps Script** - Form automation
- **HTTP/REST** - API communication
- **JSON** - Data format

### **Tooling Layer:**
- **npm** - Package manager
- **Git** - Version control
- **Bash/PowerShell** - Automation scripts

---

## 🏗️ Architecture Patterns Used

1. **MVC Pattern:** Routes (Controller) → Database (Model) → JSON (View)
2. **Component Pattern:** Reusable React components
3. **REST API:** Standard HTTP methods (GET, POST, PUT, DELETE)
4. **Single Responsibility:** Each file has one clear purpose
5. **Separation of Concerns:** Frontend/Backend/Database separated
6. **Singleton Pattern:** Database connection (db.js)

---

This architecture provides a clean, maintainable, and scalable foundation for the EMS Inventory Tracker application! 🚑

