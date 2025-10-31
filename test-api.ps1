# EMS Inventory Tracker - API Test Script (PowerShell)
# This script tests the main API endpoints on Windows

Write-Host "🚀 Testing EMS Inventory Tracker API" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:3000"

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "❌ Server is not responding" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 2: Get All Supplies
Write-Host "Test 2: Get All Supplies" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/supplies" -Method Get
    Write-Host "✅ Found $($response.Count) supplies" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get supplies" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Low Stock Items
Write-Host "Test 3: Get Low Stock Items" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/supplies/low" -Method Get
    Write-Host "✅ Found $($response.Count) low stock items" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get low stock items" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Categories
Write-Host "Test 4: Get Categories" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/categories" -Method Get
    Write-Host "✅ Found $($response.Count) categories" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to get categories" -ForegroundColor Red
}
Write-Host ""

# Test 5: Submit Transaction (Like Google Form)
Write-Host "Test 5: Submit Transaction (Simulating Google Form)" -ForegroundColor Blue
$body = @{
    supply_name = "Gauze Pads 4x4"
    quantity = 3
    employee_name = "Test User"
    notes = "API test transaction"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/transactions/submit" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✅ Transaction submitted successfully" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)"
} catch {
    Write-Host "❌ Transaction failed" -ForegroundColor Red
}
Write-Host ""

# Test 6: Get Dashboard Stats
Write-Host "Test 6: Get Dashboard Stats" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/dashboard/stats" -Method Get
    Write-Host "✅ Dashboard stats retrieved" -ForegroundColor Green
} catch {
    Write-Host "❌ Dashboard stats failed" -ForegroundColor Red
}
Write-Host ""

# Test 7: Get Transaction History
Write-Host "Test 7: Get Transaction History" -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "$API_URL/api/transactions?limit=5" -Method Get
    Write-Host "✅ Transaction history retrieved" -ForegroundColor Green
} catch {
    Write-Host "❌ Transaction history failed" -ForegroundColor Red
}
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🎉 All tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Open http://localhost:5173 to view the dashboard"
Write-Host "  2. Check the transaction you just created"
Write-Host "  3. Set up Google Forms integration (see GOOGLE_FORMS_SETUP.md)"

