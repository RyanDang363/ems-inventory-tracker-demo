# 📋 Step-by-Step: Google Forms Integration

A complete walkthrough for setting up Google Forms to automatically update your inventory.

---

## 🎯 Overview: How It Works

```
Employee fills Google Form
         ↓
Form submission triggers Apps Script
         ↓
Script extracts form data
         ↓
POST request to Express API (/api/transactions/submit)
         ↓
Express validates and updates SQLite database
         ↓
Inventory quantity decreases automatically
         ↓
Manager sees update in dashboard
```

---

## ✅ Prerequisites

- [ ] Backend server running (`npm start` in `backend/`)
- [ ] Database initialized (`npm run init-db` in `backend/`)
- [ ] Google account (Gmail)
- [ ] (For local testing) Public URL tunnel (ngrok/localtunnel)

---

## 📝 Step 1: Create the Google Form

### 1.1 Create New Form

1. Go to [Google Forms](https://forms.google.com)
2. Click **"+ Blank"** or **"+"** to create new form
3. Title it: **"EMS Supply Request"**

### 1.2 Add Form Fields

Add these fields in **exact order** (important for script!):

#### **Field 1: Employee Name**
- Click **"+ Add question"**
- Question type: **Short answer**
- Question: **"What is your name?"**
- Mark as **Required** ✓
- Description: "Enter your full name"

#### **Field 2: Supply Item**
- Click **"+ Add question"**
- Question type: **Dropdown** (important!)
- Question: **"Which supply are you taking?"**
- Mark as **Required** ✓
- Description: "Select the item from the list"

**Add Options:** (You'll populate these from your inventory)
- Click **"Add option"** for each supply
- Or use the script helper later to auto-populate

**Initial options to add manually:**
```
Oropharyngeal Airways (Adult)
Nasopharyngeal Airways
Endotracheal Tubes (7.5mm)
Laryngoscope Blades
Oxygen Masks (Non-Rebreather)
Nasal Cannulas
Bag Valve Masks (Adult)
Oxygen Tubing
Epinephrine 1mg/mL
Aspirin 325mg
Nitroglycerin Spray
Glucose Gel
Naloxone (Narcan) 4mg
Gauze Pads 4x4
Trauma Dressings
Elastic Bandages
Adhesive Tape
Chest Seals
IV Catheters 18G
IV Catheters 20G
Saline Solution 1000mL
IV Start Kits
Tourniquets
Blood Pressure Cuffs
Stethoscopes
Pulse Oximeter Probes
Thermometer Probe Covers
Gloves (Large)
Gloves (Medium)
N95 Respirators
Face Shields
Blankets
Vomit Bags
Cervical Collars (Adjustable)
Splints (SAM Splints)
Backboards
Combat Tourniquets (CAT)
```

#### **Field 3: Quantity**
- Click **"+ Add question"**
- Question type: **Short answer**
- Question: **"How many units are you taking?"**
- Mark as **Required** ✓
- Click **"⋮" (three dots)** → **"Response validation"**
  - Validation: **Number**
  - Number: **Greater than** → **0**
- Description: "Enter the quantity"

#### **Field 4: Notes (Optional)**
- Click **"+ Add question"**
- Question type: **Paragraph**
- Question: **"Additional notes (optional)"**
- Mark as **Not required**
- Description: "Any additional information (patient case, reason, etc.)"

### 1.3 Configure Form Settings

1. Click **⚙️ Settings** (gear icon)
2. **General tab:**
   - ✓ Collect email addresses (optional but helpful)
   - ✓ Limit to 1 response (if you want)
3. **Responses tab:**
   - ✓ Accept responses
4. Click **"Send"** button (top right)
   - Get the form link to share with employees
   - Copy the link (you'll need it later)

---

## 🔧 Step 2: Get Your API Endpoint URL

### For Local Development (Testing):

You need to make your local server publicly accessible. Choose one:

#### Option A: ngrok (Recommended)

1. Install ngrok: `brew install ngrok` (Mac) or download from [ngrok.com](https://ngrok.com)
2. Start your backend: `cd backend && npm start`
3. In new terminal, run: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Your API endpoint: `https://abc123.ngrok.io/api/transactions/submit`

#### Option B: localtunnel

1. Install: `npm install -g localtunnel`
2. Start your backend: `cd backend && npm start`
3. In new terminal, run: `lt --port 3000`
4. Copy the URL provided
5. Your API endpoint: `https://your-url.loca.lt/api/transactions/submit`

### For Production:

Use your deployed backend URL:
```
https://your-domain.com/api/transactions/submit
```

**Note:** Make sure your backend has CORS enabled (already configured in `server.js`).

---

## 📜 Step 3: Add Google Apps Script

### 3.1 Open Script Editor

1. In your Google Form, click **"⋮" (three dots)** in top right
2. Select **"Script editor"**
3. A new tab opens with Google Apps Script editor

### 3.2 Copy the Script

1. Delete any existing code in the editor
2. Open `google-forms-sample.js` from your project
3. Copy **entire contents**
4. Paste into Google Apps Script editor

### 3.3 Configure the Script

**Find this line (around line 7):**
```javascript
const API_ENDPOINT = 'http://localhost:3000/api/transactions/submit';
```

**Replace with your actual API URL:**
```javascript
// For ngrok/local testing:
const API_ENDPOINT = 'https://abc123.ngrok.io/api/transactions/submit';

// OR for production:
const API_ENDPOINT = 'https://your-domain.com/api/transactions/submit';
```

### 3.4 Save the Script

1. Click **File → Save** (or `Ctrl+S` / `Cmd+S`)
2. Name it: **"EMS Inventory Form Handler"**

---

## 🔐 Step 4: Authorize the Script

### 4.1 Set Up the Trigger

1. In the script editor, find the function `setupFormTrigger()` (around line 158)
2. Click the **function dropdown** (top) and select **"setupFormTrigger"**
3. Click **▶️ Run** button
4. You'll see **"Authorization required"** popup
5. Click **"Review permissions"**
6. Select your Google account
7. Click **"Advanced"** → **"Go to [Project Name] (unsafe)"**
8. Click **"Allow"**

**What this does:** Grants the script permission to:
- Read form responses
- Send HTTP requests to your API
- (Optional) Send emails

### 4.2 Verify Trigger Setup

1. Check the **Execution log** (bottom of script editor)
2. You should see: `✅ Form trigger set up successfully`
3. If there are errors, make sure you authorized properly

---

## 🧪 Step 5: Test the Integration

### 5.1 Test API Connection

1. In script editor, select function **"testAPIConnection"**
2. Click **▶️ Run**
3. Check execution log:
   - ✅ `API is reachable!` = Success
   - ❌ `Cannot reach API` = Check your URL and server

### 5.2 Submit Test Form

1. Open your Google Form (use the share link)
2. Fill out test submission:
   - Name: "Test User"
   - Supply: Select any supply (e.g., "Gauze Pads 4x4")
   - Quantity: 1
   - Notes: "Testing integration"
3. Click **"Submit"**

### 5.3 Verify Results

**Check the Apps Script execution log:**
1. Go back to Script Editor
2. Click **"Executions"** tab (left sidebar)
3. Find latest execution
4. Click to view logs

**You should see:**
```
📝 Form submitted, processing...
Employee: Test User
Supply: Gauze Pads 4x4
Quantity: 1
📤 Sending to API: https://...
Response code: 201
✅ SUCCESS: Successfully recorded: 1 Gauze Pads 4x4 taken by Test User
Previous quantity: 200
New quantity: 199
```

**Check your dashboard:**
1. Open your React dashboard (`http://localhost:5173`)
2. Go to **"All Inventory"**
3. Find "Gauze Pads 4x4"
4. Quantity should be **199** (decreased by 1)
5. Go to **"Transactions"**
6. You should see the new transaction!

---

## 🔄 Step 6: Auto-Populate Supply Dropdown (Optional)

Instead of manually adding supplies, use the helper function:

### 6.1 Update Supply List

1. In Script Editor, select function **"updateSupplyDropdown"**
2. Click **▶️ Run**
3. Check execution log: `✅ Updated dropdown with X supplies`

**What this does:**
- Fetches all supplies from your API
- Updates the dropdown with current inventory
- Automatically syncs with your database

**Note:** Run this whenever you add new supplies to keep the form updated.

---

## 🚨 Troubleshooting

### Problem: "Cannot reach API"

**Solutions:**
- ✅ Make sure backend is running (`npm start` in `backend/`)
- ✅ Check API URL is correct (must be HTTPS for production)
- ✅ For localhost, use ngrok/localtunnel
- ✅ Verify CORS is enabled in Express (should be already)

### Problem: "Supply not found"

**Solutions:**
- ✅ Supply name must match **exactly** (case-sensitive)
- ✅ Check your inventory database for exact names
- ✅ Run `updateSupplyDropdown()` to sync form with database
- ✅ Verify supply exists: `GET /api/supplies`

### Problem: "Script error" or authorization issues

**Solutions:**
- ✅ Re-run `setupFormTrigger()` function
- ✅ Re-authorize-clean up and grant permissions again
- ✅ Check execution log for specific error messages

### Problem: Form submits but inventory doesn't update

**Solutions:**
- ✅ Check Apps Script execution log for errors
- ✅ Verify API endpoint is correct
- ✅ Check backend server logs for errors
- ✅ Test API directly with curl:
  ```bash
  curl -X POST http://localhost:3000/api/transactions/submit \
    -H "Content-Type: application/json" \
    -d '{
      "supply_name": "Gauze Pads 4x4",
      "quantity": 1,
      "employee_name": "Test User",
      "notes": "Test"
    }'
  ```

---

## 📧 Step 7: Enable Email Notifications (Optional)

### 7.1 Error Notifications

Edit `sendErrorNotification()` function (around line 127):

1. Find this line:
   ```javascript
   const recipient = 'manager@yourcompany.com';
   ```
2. Replace with your manager's email
3. Uncomment the email line (around line 151):
   ```javascript
   MailApp.sendEmail(recipient, subject, body);
   ```

### 7.2 Confirmation Emails

To send confirmation emails to employees:

1. Uncomment line 87 in `onFormSubmit()`:
   ```javascript
   sendConfirmationEmail(employeeName, supplyName, quantity, responseBody.new_quantity);
   ```
2. Uncomment line 122 in `sendConfirmationEmail()`:
   ```javascript
   MailApp.sendEmail(recipient, subject, body);
   ```

**Note:** Emails are sent from the Google account that owns the form.

---

## 🎯 Production Deployment Checklist

Before deploying to production:

- [ ] Deploy backend to hosting (Railway, Heroku, etc.)
- [ ] Update `API_ENDPOINT` in Apps Script to production URL
- [ ] Test form submission with production API
- [ ] Verify CORS allows Google Forms domain
- [ ] Set up error email notifications
- [ ] Share form link with employees
- [ ] Train employees on form usage
- [ ] Monitor execution logs regularly

---

## 📊 Monitoring & Maintenance

### Check Form Submissions

1. In Google Form, click **"Responses"** tab
2. View all submissions in spreadsheet
3. Or click **"Link to Sheets"** for detailed view

### Monitor Script Executions

1. In Script Editor, click **"Executions"** tab
2. View recent executions and logs
3. Check for errors or failures

### Update Supply List

When you add new supplies to inventory:
1. Run `updateSupplyDropdown()` function
2. Form dropdown automatically updates

---

## 🔒 Security Considerations

### Current Setup (Basic)

- ✅ Form validation (required fields)
- ✅ API validation (checks supply exists)
- ✅ Database transactions (atomic updates)

### Recommended Enhancements

1. **API Key Authentication:**
   - Add API key to Apps Script
   - Verify key in Express middleware
   - See commented code in script

2. **Rate Limiting:**
   - Add rate limiting to Express API
   - Prevent abuse/spam submissions

3. **Form Access Control:**
   - Limit form to organization members
   - Use Google Workspace domain restrictions

---

## 📝 Summary

**You've now set up:**

✅ Google Form for employee submissions  
✅ Apps Script to process form data  
✅ API endpoint to update inventory  
✅ Automatic inventory decrements  
✅ Transaction logging  
✅ Error handling  

**Next Steps:**

1. Share form link with employees
2. Test with real submissions
3. Monitor dashboard for updates
4. Set up email notifications (optional)
5. Deploy to production when ready

---

## 🎉 You're Done!

Your Google Forms integration is complete. Employees can now submit supply requests directly through the form, and inventory updates automatically!

**Quick Reference:**

- **Form URL:** Share this with employees
- **Script:** Automatically processes submissions
- **API Endpoint:** `/api/transactions/submit`
- **Dashboard:** View updates at `http://localhost:5173`

**Need Help?**

- Check `GOOGLE_FORMS_SETUP.md` for detailed documentation
- Review `google-forms-sample.js` for script reference
- Check execution logs in Apps Script editor

---

**Happy Tracking! 🚑**

