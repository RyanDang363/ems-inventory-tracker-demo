# Google Forms Integration Guide

This guide will help you set up Google Forms to automatically decrement inventory when employees take supplies.

## Overview

The integration works as follows:

1. Employee fills out Google Form to log items taken
2. Form submission triggers a Google Apps Script
3. Script sends data to your API endpoint
4. API decrements inventory and creates transaction record

---

## Step 1: Create the Google Form

1. Go to [Google Forms](https://forms.google.com)
2. Create a new form titled "EMS Supply Request"
3. Add the following fields:

### Form Fields

**Field 1: Employee Name**

- Type: Short answer
- Required: Yes
- Description: "Enter your full name"

**Field 2: Supply Item**

- Type: Dropdown
- Required: Yes
- Options: (You'll need to manually add supply names from your inventory)
  - Example options:
    - Oropharyngeal Airways (Adult)
    - Oxygen Masks (Non-Rebreather)
    - Epinephrine 1mg/mL
    - Gauze Pads 4x4
    - IV Catheters 18G
    - Gloves (Large)
    - etc.
- Description: "Select the item you're taking"

**Field 3: Quantity**

- Type: Short answer
- Required: Yes
- Validation: Number, Greater than 0
- Description: "How many units are you taking?"

**Field 4: Notes (Optional)**

- Type: Paragraph
- Required: No
- Description: "Any additional notes (patient case, reason, etc.)"

---

## Step 2: Get Your API Endpoint URL

### For Local Development:

```
http://localhost:3000/api/transactions/submit
```

### For Production:

Replace with your deployed backend URL:

```
https://your-domain.com/api/transactions/submit
```

**Important:** Your server must be publicly accessible for Google Apps Script to reach it. For local development, you can use tools like:

- [ngrok](https://ngrok.com/) - `ngrok http 3000`
- [localtunnel](https://localtunnel.github.io/www/) - `lt --port 3000`

---

## Step 3: Add Google Apps Script

1. In your Google Form, click the three dots menu (⋮) in the top right
2. Select "Script editor"
3. Delete any existing code
4. Copy and paste the following script:

### Google Apps Script Code

```javascript
// ====================================
// EMS Inventory Tracker - Form Script
// ====================================

// CONFIGURATION
const API_ENDPOINT = "YOUR_API_URL_HERE"; // Replace with your actual API URL

// Main function that runs on form submit
function onFormSubmit(e) {
  try {
    // Get form responses
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();

    // Extract data from form responses
    const employeeName = itemResponses[0].getResponse(); // Employee Name
    const supplyName = itemResponses[1].getResponse(); // Supply Item
    const quantity = parseInt(itemResponses[2].getResponse()); // Quantity
    const notes =
      itemResponses.length > 3 ? itemResponses[3].getResponse() : ""; // Notes (optional)

    // Prepare payload for API
    const payload = {
      supply_name: supplyName,
      quantity: quantity,
      employee_name: employeeName,
      notes: notes,
    };

    // Send to API
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    };

    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    const responseCode = response.getResponseCode();
    const responseBody = JSON.parse(response.getContentText());

    // Log the result
    if (responseCode === 201) {
      Logger.log("✅ Success: " + responseBody.message);
      Logger.log("New quantity: " + responseBody.new_quantity);
    } else {
      Logger.log("❌ Error: " + responseBody.error);

      // Optional: Send email notification to manager on error
      sendErrorNotification(
        employeeName,
        supplyName,
        quantity,
        responseBody.error
      );
    }
  } catch (error) {
    Logger.log("❌ Script Error: " + error.toString());

    // Optional: Send email notification on script failure
    sendErrorNotification("Unknown", "Unknown", 0, error.toString());
  }
}

// Optional: Send email notification on errors
function sendErrorNotification(employee, supply, quantity, errorMessage) {
  const recipient = "manager@yourcompany.com"; // Replace with manager's email
  const subject = "⚠️ EMS Inventory Form Error";
  const body = `
An error occurred processing an inventory form submission:

Employee: ${employee}
Supply: ${supply}
Quantity: ${quantity}
Error: ${errorMessage}

Please check the inventory system and manually process this request if needed.
  `;

  // Uncomment the line below to enable email notifications
  // MailApp.sendEmail(recipient, subject, body);
  Logger.log("Error notification would be sent to: " + recipient);
}

// Function to set up the form trigger (run this once manually)
function setupFormTrigger() {
  const form = FormApp.getActiveForm();

  // Delete any existing triggers
  const triggers = ScriptApp.getUserTriggers(form);
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }

  // Create new trigger
  ScriptApp.newTrigger("onFormSubmit").forForm(form).onFormSubmit().create();

  Logger.log("✅ Form trigger set up successfully");
}
```

### Configuration Steps:

1. **Replace the API_ENDPOINT** on line 7:

   ```javascript
   const API_ENDPOINT =
     "http://your-actual-api-url.com/api/transactions/submit";
   ```

2. **Optional: Enable email notifications**

   - Replace `manager@yourcompany.com` with your email
   - Uncomment the `MailApp.sendEmail()` line

3. **Save the script** (Ctrl/Cmd + S)

4. **Set up the trigger:**
   - Click the clock icon (Triggers) in the left sidebar
   - Click "+ Add Trigger" in the bottom right
   - Configure:
     - Choose function: `onFormSubmit`
     - Choose deployment: Head
     - Select event source: From form
     - Select event type: On form submit
   - Click "Save"
   - You may need to authorize the script (click "Review Permissions")

---

## Step 4: Test the Integration

### Test Process:

1. **Make sure your backend is running:**

   ```bash
   cd backend
   npm start
   ```

2. **If using local development, start ngrok:**

   ```bash
   ngrok http 3000
   ```

   Copy the HTTPS URL and update it in your Apps Script.

3. **Submit a test form:**

   - Fill out your Google Form with test data
   - Submit the form

4. **Check the results:**
   - Go to Script Editor → Execution Log (View → Logs)
   - You should see "✅ Success" message
   - Check your dashboard to verify the transaction was recorded
   - Verify the inventory quantity was decremented

### Troubleshooting:

**If the script fails:**

- Check the execution log in Apps Script for error messages
- Verify your API endpoint URL is correct and accessible
- Make sure your backend is running
- Check that the supply name in the form exactly matches a supply name in your database

**Common Issues:**

1. **"Supply not found" error**

   - The supply name in the form doesn't exactly match the database
   - Solution: Double-check spelling and capitalization

2. **"Connection failed" error**

   - API endpoint is not accessible
   - Solution: Verify the URL and that your server is running

3. **"Authorization required" error**
   - You haven't granted permissions to the script
   - Solution: Run `setupFormTrigger()` manually and approve permissions

---

## Step 5: Share the Form with Employees

### Getting the Form Link:

1. In your Google Form, click "Send" in the top right
2. Click the link icon (🔗)
3. Copy the shortened URL
4. Share this link with your EMS team

### Best Practices:

- **Pin the link** in your team chat (Slack, Teams, etc.)
- **Add it to your employee portal** or intranet
- **Create a QR code** and post it in the supply room
- **Bookmark it** on station computers

### QR Code Generation:

Use a free QR code generator like:

- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)

Print and post the QR code in your ambulance supply area for quick mobile access.

---

## Step 6: Maintaining Supply List

### When you add new supplies to your inventory:

1. Add the supply in your dashboard (Inventory → Add Supply)
2. Update the Google Form:
   - Go to your form
   - Edit the "Supply Item" dropdown field
   - Add the new supply name (must match exactly)
   - Save changes

### Auto-updating the dropdown (Advanced):

You can modify the Apps Script to automatically populate the dropdown from your API:

```javascript
function updateSupplyDropdown() {
  const API_URL = "YOUR_API_URL/api/supplies";
  const form = FormApp.getActiveForm();
  const items = form.getItems();

  // Find the supply dropdown (adjust index if needed)
  const supplyDropdown = items[1].asListItem();

  // Fetch supplies from API
  const response = UrlFetchApp.fetch(API_URL);
  const supplies = JSON.parse(response.getContentText());

  // Extract supply names
  const supplyNames = supplies.map((s) => s.name).sort();

  // Update dropdown
  supplyDropdown.setChoiceValues(supplyNames);

  Logger.log("✅ Updated dropdown with " + supplyNames.length + " supplies");
}
```

Set up a daily time-based trigger to run this function automatically.

---

## Security Considerations

### Important Security Notes:

1. **API Authentication (Recommended for Production):**

   - Add an API key to protect your endpoint
   - Modify the Apps Script to include: `'headers': {'X-API-Key': 'your-secret-key'}`

2. **Rate Limiting:**

   - Consider adding rate limiting to prevent abuse
   - The backend can track submissions by IP or user

3. **Data Validation:**

   - The API already validates incoming data
   - Form validation helps prevent invalid submissions

4. **Access Control:**
   - Restrict form access to employees only
   - Use Google Workspace settings to limit access to your domain

---

## Support

If you encounter any issues:

1. Check the Google Apps Script execution log
2. Check your backend API logs
3. Verify all supply names match exactly
4. Ensure your API endpoint is accessible

For additional help, refer to the main README.md file.

---

## Summary Checklist

- [ ] Created Google Form with required fields
- [ ] Added all current supply items to dropdown
- [ ] Copied and configured Apps Script
- [ ] Set up form submission trigger
- [ ] Tested with sample submission
- [ ] Verified transaction appears in dashboard
- [ ] Shared form link with team
- [ ] Created QR code for easy access
- [ ] Documented process for adding new supplies

🎉 **Your Google Forms integration is complete!**
