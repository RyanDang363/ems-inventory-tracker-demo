// Google Apps Script for EMS Inventory Tracker
// Copy this script to your Google Form's Script Editor

// CONFIGURATION - Update this with your API endpoint
const API_ENDPOINT = 'https://emsinventorytracker.vercel.app/api/google-forms/submit';

// Function that runs when form is submitted
function onFormSubmit(e) {
  try {
    Logger.log('📝 Form submitted, processing...');
    
    // Get form responses
    const formResponse = e.response;
    const itemResponses = formResponse.getItemResponses();
    
    // Log all responses for debugging
    Logger.log('Total responses: ' + itemResponses.length);
    for (let i = 0; i < itemResponses.length; i++) {
      Logger.log('Response ' + i + ': ' + itemResponses[i].getItem().getTitle() + ' = ' + itemResponses[i].getResponse());
    }
    
    // Extract data (adjust indices based on your form field order)
    // IMPORTANT: Update these indices (0, 1, 2) to match your form field order!
    const employeeName = itemResponses[0].getResponse();
    const supplyName = itemResponses[1].getResponse();
    const quantity = parseInt(itemResponses[2].getResponse());
    
    Logger.log('Employee: ' + employeeName);
    Logger.log('Supply: ' + supplyName);
    Logger.log('Quantity: ' + quantity);
    
    // Validate data
    if (!employeeName || !supplyName || !quantity || isNaN(quantity)) {
      throw new Error('Invalid form data. Please check that all fields are filled correctly.');
    }
    
    // Prepare payload
    const payload = {
      supply_name: supplyName,
      quantity: quantity,
      employee_name: employeeName
    };
    
    Logger.log('Sending to API: ' + API_ENDPOINT);
    Logger.log('Payload: ' + JSON.stringify(payload));
    
    // Send to API
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload),
      'muteHttpExceptions': false
    };
    
    const response = UrlFetchApp.fetch(API_ENDPOINT, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    Logger.log('Response code: ' + responseCode);
    Logger.log('Response text: ' + responseText);
    
    if (responseCode !== 200) {
      throw new Error('API returned error code ' + responseCode + ': ' + responseText);
    }
    
    const result = JSON.parse(responseText);
    
    // Log success
    Logger.log('✅ Success: ' + result.message);
    
    // Optional: Send email notification for low stock
    if (result.supply && result.supply.is_low_stock) {
      sendLowStockAlert(result.supply);
    }
    
  } catch (error) {
    Logger.log('❌ Error submitting to API: ' + error.toString());
    Logger.log('Error details: ' + JSON.stringify(error));
    // Optional: Send error notification
    sendErrorNotification(error);
  }
}

// Optional: Send low stock alert email
function sendLowStockAlert(supply) {
  const recipient = 'manager@example.com'; // Update with manager's email
  const subject = `Low Stock Alert: ${supply.name}`;
  const body = `
    Supply ${supply.name} is now low on stock.
    
    Current Quantity: ${supply.new_quantity} ${supply.unit}
    Category: ${supply.category}
    Status: ${supply.stock_status}
    
    Please restock as soon as possible.
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}

// Optional: Send error notification
function sendErrorNotification(error) {
  const recipient = 'admin@example.com'; // Update with admin's email
  const subject = 'EMS Inventory Form Submission Error';
  const body = `
    An error occurred while processing a form submission:
    
    Error: ${error.toString()}
    
    Please check the system logs for more details.
  `;
  
  MailApp.sendEmail(recipient, subject, body);
}

// Test function to verify script is working
function testConnection() {
  const testUrl = API_ENDPOINT.replace('/submit', '/test');
  const response = UrlFetchApp.fetch(testUrl);
  console.log('Test response:', response.getContentText());
}
