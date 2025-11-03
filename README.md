# EMS Inventory Tracker

A modern inventory management system for Emergency Medical Services (EMS) teams to track medical supplies, monitor stock levels, and integrate with Google Forms for easy supply usage reporting.

## Features

- **Real-time Dashboard** - Overview of inventory status, low stock alerts, and recent activity
- **Inventory Management** - Full CRUD operations for managing medical supplies
- **Low Stock Alerts** - Visual alerts for supplies running low or out of stock
- **Transaction History** - Complete audit trail of all inventory changes
- **Google Forms Integration** - Allow EMTs to report supply usage via Google Forms
- **Category Organization** - Supplies organized by medical categories
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18, TailwindCSS, Recharts, Lucide Icons
- **Backend**: Node.js, Express, SQLite
- **Deployment**: Vercel-ready configuration

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ems_inventory_tracker
```

2. Install backend dependencies:

```bash
cd backend
npm install
```

3. Initialize the database:

```bash
npm run init-db
```

4. Start the backend server:

```bash
npm start
```

5. In a new terminal, install frontend dependencies:

```bash
cd frontend
npm install
```

6. Start the frontend development server:

```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Inventory Management

- `GET /api/inventory/supplies` - Get all supplies
- `GET /api/inventory/low-stock` - Get low stock items
- `GET /api/inventory/dashboard` - Get dashboard statistics
- `GET /api/inventory/categories` - Get all categories
- `POST /api/inventory/supplies` - Add new supply
- `PUT /api/inventory/supplies/:id` - Update supply
- `DELETE /api/inventory/supplies/:id` - Delete supply
- `GET /api/inventory/transactions` - Get transaction history

### Google Forms Integration

- `POST /api/google-forms/submit` - Submit supply usage from Google Forms
- `GET /api/google-forms/test` - Test endpoint connectivity

## Google Forms Integration

To integrate with Google Forms:

1. Create a Google Form with fields:

   - Employee Name (Short answer, required)
   - Supply Item (Dropdown, required)
   - Quantity (Number, required)

2. Add Google Apps Script to the form:

   - Go to Form Settings → Script Editor
   - Copy the script from `google-forms-script.js`
   - Update the `API_ENDPOINT` to your deployed backend URL
   - Set up a trigger for "On form submit"

3. Test the integration by submitting a form

## Deployment

### Backend (Vercel)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy backend:

```bash
cd backend
vercel
```

3. Set environment variables in Vercel dashboard

### Frontend (Vercel)

1. Build the frontend:

```bash
cd frontend
npm run build
```

2. Deploy to Vercel:

```bash
vercel --prod
```

3. Update the API URL in your frontend code to point to your deployed backend

## Database Schema

- **categories** - Medical supply categories
- **supplies** - Individual supply items with stock levels
- **transactions** - History of all inventory changes

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3000
NODE_ENV=development
```

For production, set these in your hosting platform's environment variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.
