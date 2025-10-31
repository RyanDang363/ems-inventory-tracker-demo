// ====================================
// EMS Inventory Tracker - Google Apps Script Sample
// ====================================
// Copy this entire script into your Google Form's Apps Script editor

// CONFIGURATION - REPLACE WITH YOUR ACTUAL API URL
const API_ENDPOINT = 'http://localhost:3000/api/transactions/submit';
// For production, use your deployed URL like:
// const API_ENDPOINT = 'https://your-app.herokuapp.com/api/transactions/submit';

// Optional: Add API key for security (if you implement it)
// const API_KEY = 'your-secret-api-key';

// Main function that runs when form is submitted
function onFormSubmit(e) {
  try {
    Logger.log('📝 Form submitted, processing...');
    
    // Get form responses
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Log all responses for debugging
    Logger.log('Total responses: ' + itemResponses.length);
    
    // Extract data from form responses
    // Adjust indices based on your form field order
    const employeeName = itemResponses[0].getResponse();  // Field 1: Employee Name
    const supplyName = itemResponses[1].getResponse();     // Field 2: Supply Item
    const quantity = parseInt(itemResponses[2].getResponse()); // Field 3: Quantity
    const notes = itemResponses.length > 3 ? itemResponses[3].getResponse() : ''; // Field 4: Notes (optional)
    
    Logger.log('Employee: ' + employeeName);
    Logger.log('Supply: ' + supplyName);
    Logger.log('Quantity: ' + quantity);
    Logger.log('Notes: ' + notes);
    
    // Validate data
    if (!employeeName || !supplyName || !quantity) {
      throw new Error('Missing required fields');
    }
    
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    
    // Prepare payload for API
    const payload = {
      supply_name: supplyName,
      quantity: quantity,
      employee_name: employeeName,
      notes: notes
    };
    
    // Prepare HTTP request options
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': true
    };
    
    // Optional: Add API key if configured
    // if (API_KEY) {
    //   options.headers = {
    //     'X-API-Key': API_KEY
    //   };
    // }
    
    Logger.log('📤 Sending to API: ' + API_ENDPOINT);
    
    // Send to API
    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    const responseCode = response.getResponseCode();
    const responseBody = JSON.parse(response.getContentText());
    
    Logger.log('Response code: ' + responseCode);
    Logger.log('Response body: ' + JSON.stringify(responseBody));
    
    // Check if successful
    if (responseCode === 201 && responseBody.success) {
      Logger.log('✅ SUCCESS: ' + responseBody.message);
      Logger.log('Previous quantity: ' + responseBody.previous_quantity);
      Logger.log('New quantity: ' + responseBody.new_quantity);
      
      // Optional: Send confirmation email to employee
      // sendConfirmationEmail(employeeName, supplyName, quantity, responseBody.new_quantity);
    } else {
      Logger.log('❌ ERROR: ' + (responseBody.error || 'Unknown error'));
      
      // Send error notification to manager
      sendErrorNotification(employeeName, supplyName, quantity, responseBody.error || 'Unknown error');
    }
    
  } catch (error) {
    Logger.log('❌ SCRIPT ERROR: ' + error.toString());
    
    // Send error notification to manager
    sendErrorNotification('Unknown', 'Unknown', 0, error.toString());
  }
}

// Optional: Send confirmation email to employee
function sendConfirmationEmail(employeeName, supplyName, quantity, newQuantity) {
  const recipient = Session.getActiveUser().getEmail(); // Gets form submitter's email
  const subject = '✅ Supply Request Confirmed';
  const body = `
Hi ${employeeName},

Your supply request has been processed successfully:

Item: ${supplyName}
Quantity Taken: ${quantity}
Remaining Stock: ${newQuantity}

Thank you for keeping our inventory up to date!

- EMS Inventory System
  `;
  
  // Uncomment to enable
  // MailApp.sendEmail(recipient, subject, body);
  Logger.log('Confirmation email would be sent to: ' + recipient);
}

// Send error notification to manager
function sendErrorNotification(employee, supply, quantity, errorMessage) {
  // Replace with your manager's email
  const recipient = 'manager@yourcompany.com';
  const subject = '⚠️ EMS Inventory Form Error';
  const body = `
An error occurred processing an inventory form submission:

Employee: ${employee}
Supply: ${supply}
Quantity: ${quantity}
Error: ${errorMessage}
Timestamp: ${new Date().toLocaleString()}

Please check the inventory system and manually process this request if needed.

To troubleshoot:
1. Check if the supply name exactly matches the database
2. Verify the API is running and accessible
3. Review the Apps Script execution log

- EMS Inventory System
  `;
  
  // Uncomment to enable error notifications
  // MailApp.sendEmail(recipient, subject, body);
  Logger.log('Error notification would be sent to: ' + recipient);
  Logger.log('Error details: ' + errorMessage);
}

// Function to set up the form trigger
// Run this function ONCE manually after pasting the script
function setupFormTrigger() {
  const form = FormApp.getActiveForm();
  
  // Delete any existing triggers to avoid duplicates
  const triggers = ScriptApp.getUserTriggers(form);
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Create new trigger for form submissions
  ScriptApp.newTrigger('onFormSubmit')
    .forForm(form)
    .onFormSubmit()
    .create();
  
  Logger.log('✅ Form trigger set up successfully');
  Logger.log('The onFormSubmit function will now run automatically when the form is submitted');
}

// Helper function to test the API connection
// Run this manually to verify your API is accessible
function testAPIConnection() {
  Logger.log('🧪 Testing API connection...');
  Logger.log('API Endpoint: ' + API_ENDPOINT);
  
  const testPayload = {
    supply_name: 'Test Supply',
    quantity: 1,
    employee_name: 'Test User',
    notes: 'API connection test'
  };
  
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(testPayload),
    'muteHttpExceptions': true
  };
  
  try {
    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    const responseCode = response.getResponseCode();
    const responseBody = response.getContentText();
    
    Logger.log('Response Code: ' + responseCode);
    Logger.log('Response Body: ' + responseBody);
    
    if (responseCode === 201 || responseCode === 404) {
      Logger.log('✅ API is reachable!');
      if (responseCode === 404) {
        Logger.log('⚠️ Supply not found, but API is working. Make sure you use real supply names.');
      }
    } else {
      Logger.log('⚠️ API responded but with unexpected code');
    }
  } catch (error) {
    Logger.log('❌ Cannot reach API: ' + error.toString());
    Logger.log('Make sure:');
    Logger.log('1. Your backend server is running');
    Logger.log('2. The API URL is correct');
    Logger.log('3. For localhost, you need ngrok or similar to make it publicly accessible');
  }
}

// Helper function to get all supply names from the API
// Run this to populate your form dropdown with current inventory
function updateSupplyDropdown() {
  Logger.log('📋 Fetching supplies from API...');
  
  // Replace with your API base URL
  const API_BASE = API_ENDPOINT.replace('/api/transactions/submit', '');
  const suppliesEndpoint = API_BASE + '/api/supplies';
  
  Logger.log('Fetching from: ' + suppliesEndpoint);
  
  try {
    const response = UrlFetchApp.fetch(suppliesEndpoint);
    const supplies = JSON.parse(response.getContentText());
    
    Logger.log('Found ' + supplies.length + ' supplies');
    
    // Extract supply names and sort them
    const supplyNames = supplies.map(s => s.name).sort();
    
    // Get the form and find the dropdown question
    const form = FormApp.getActiveForm();
    const items = form.getItems();
    
    // Find the supply item dropdown (adjust index if needed, typically index 1)
    let dropdownItem = null;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getType() === FormApp.ItemType.LIST) {
        dropdownItem = items[i].asListItem();
        break;
      }
    }
    
    if (dropdownItem) {
      dropdownItem.setChoiceValues(supplyNames);
      Logger.log('✅ Updated dropdown with ' + supplyNames.length + ' supplies');
      Logger.log('First few items: ' + supplyNames.slice(0, 5).join(', '));
    } else {
      Logger.log('❌ Could not find dropdown item in form');
    }
    
  } catch (error) {
    Logger.log('❌ Error updating dropdown: ' + error.toString());
  }
}

// ====================================
// SETUP INSTRUCTIONS:
// ====================================
// 1. Replace API_ENDPOINT with your actual API URL
// 2. Save the script (Ctrl+S or Cmd+S)
// 3. Run 'setupFormTrigger' function once (click play button)
// 4. Authorize the script when prompted
// 5. (Optional) Run 'testAPIConnection' to verify setup
// 6. (Optional) Run 'updateSupplyDropdown' to auto-populate your form
// 7. Submit a test form to verify everything works
// ====================================

