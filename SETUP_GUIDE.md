# 🚀 Quick Setup Guide

Follow these steps to get your EMS Inventory Tracker up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Terminal/Command Prompt access

---

## Step 1: Backend Setup (2 minutes)

Open a terminal and navigate to the backend folder:

```bash
cd backend
```

**Install dependencies:**

```bash
npm install
```

**Initialize the database with sample data:**

```bash
npm run init-db
```

You should see:

```
🗄️  Initializing database...
✅ Tables created successfully
✅ Categories seeded
✅ Supplies seeded
✅ Sample transactions added
🎉 Database initialization complete!
```

**Start the backend server:**

```bash
npm start
```

You should see:

```
🚀 EMS Inventory API running on http://localhost:3000
📊 Environment: development
```

**✅ Backend is ready!** Leave this terminal running.

---

## Step 2: Frontend Setup (2 minutes)

Open a **new terminal window** and navigate to the frontend folder:

```bash
cd frontend
```

**Install dependencies:**

```bash
npm install
```

**Start the development server:**

```bash
npm run dev
```

You should see:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**✅ Frontend is ready!**

---

## Step 3: Access the Application

Open your web browser and go to:

```
http://localhost:5173
```

You should see the **EMS Inventory Tracker Dashboard** with:

- Sample inventory data
- Statistics cards
- Recent transactions
- Category breakdown

### Try It Out:

1. **View All Inventory**: Click "All Inventory" in the sidebar
2. **Add a Supply**: Click the "Add Supply" button
3. **Check Low Stock**: Click "Low Stock Alerts" to see items that need restocking
4. **View Transactions**: Click "Transactions" to see usage history and charts

---

## Step 4: Test the System

### Test Adding a Supply:

1. Go to "All Inventory"
2. Click "Add Supply"
3. Fill in the form:
   - Name: "Test Bandages"
   - Category: Select "Bandages & Dressings"
   - Current Quantity: 50
   - Min Threshold: 20
   - Unit: "boxes"
   - Location: "Cabinet A"
4. Click "Create Supply"
5. ✅ Your new supply appears in the list!

### Test a Transaction (Simulating Google Form):

Open a new terminal and run:

```bash
curl -X POST http://localhost:3000/api/transactions/submit \
  -H "Content-Type: application/json" \
  -d '{
    "supply_name": "Gauze Pads 4x4",
    "quantity": 5,
    "employee_name": "Your Name",
    "notes": "Testing the system"
  }'
```

**Expected response:**

```json
{
  "success": true,
  "message": "Successfully recorded: 5 Gauze Pads 4x4 taken by Your Name",
  "previous_quantity": 200,
  "new_quantity": 195
}
```

**✅ Check your dashboard** - you should see:

- Updated quantity for Gauze Pads
- New transaction in Recent Activity
- Updated statistics

---

## Step 5: Google Forms Setup (Optional, 10 minutes)

To enable employees to submit supply requests via Google Forms:

Follow the detailed guide in **[GOOGLE_FORMS_SETUP.md](./GOOGLE_FORMS_SETUP.md)**

Quick overview:

1. Create a Google Form with employee name, supply item, and quantity fields
2. Add Google Apps Script to send form data to your API
3. For local testing, use ngrok or localtunnel to make your API publicly accessible
4. Share the form link with your team

---

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**

```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in backend/.env
```

**Database errors:**

```bash
# Reset the database
cd backend
npm run init-db
```

### Frontend Issues

**Port 5173 already in use:**

- Close other Vite instances
- Or change port in `frontend/vite.config.js`

**Can't connect to API:**

- Make sure backend is running on port 3000
- Check browser console for errors
- Verify API is accessible at `http://localhost:3000/health`

**Module not found errors:**

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Next Steps

### Customize Your Inventory

1. **Add Real Supplies**:

   - Go to "All Inventory" → "Add Supply"
   - Add all your actual medical supplies

2. **Delete Sample Data** (optional):

   - You can delete the sample supplies one by one
   - Or modify `backend/database/init.js` to start fresh

3. **Update Categories**:
   - The system comes with 9 medical categories
   - You can use the API to add more if needed

### Set Up Google Forms

Follow [GOOGLE_FORMS_SETUP.md](./GOOGLE_FORMS_SETUP.md) to:

- Create the employee submission form
- Connect it to your API
- Share with your team

### Production Deployment

When ready to deploy for real use:

1. Deploy backend to a hosting service (Railway, Render, Heroku)
2. Deploy frontend to Vercel, Netlify, or similar
3. Update Google Forms script with production API URL
4. Set up SSL/HTTPS
5. Configure backups

See the **Deployment** section in [README.md](./README.md) for details.

---

## Quick Reference

### Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Access Points

- **Dashboard**: http://localhost:5173
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### Key Files

- Backend config: `backend/.env`
- Database: `backend/database/inventory.db`
- API routes: `backend/routes/`
- Frontend pages: `frontend/src/pages/`

---

## Need Help?

- **Full documentation**: [README.md](./README.md)
- **Google Forms setup**: [GOOGLE_FORMS_SETUP.md](./GOOGLE_FORMS_SETUP.md)
- **API documentation**: See README.md → API Documentation section

---

## Success Checklist

- [ ] Backend installed and running on port 3000
- [ ] Frontend installed and running on port 5173
- [ ] Can access dashboard at http://localhost:5173
- [ ] Database initialized with sample data
- [ ] Can add/edit/delete supplies
- [ ] Can view transactions and statistics
- [ ] (Optional) Google Forms connected and tested

---

**🎉 Congratulations! Your EMS Inventory Tracker is ready to use!**

Happy tracking! 🚑
