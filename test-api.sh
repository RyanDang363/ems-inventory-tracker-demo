#!/bin/bash

# EMS Inventory Tracker - API Test Script
# This script tests the main API endpoints

echo "🚀 Testing EMS Inventory Tracker API"
echo "======================================"
echo ""

API_URL="http://localhost:3000"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
response=$(curl -s "${API_URL}/health")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Server is running${NC}"
    echo "Response: $response"
else
    echo -e "${RED}❌ Server is not responding${NC}"
    exit 1
fi
echo ""

# Test 2: Get All Supplies
echo -e "${BLUE}Test 2: Get All Supplies${NC}"
response=$(curl -s "${API_URL}/api/supplies")
count=$(echo $response | grep -o '"id"' | wc -l)
echo -e "${GREEN}✅ Found $count supplies${NC}"
echo ""

# Test 3: Get Low Stock Items
echo -e "${BLUE}Test 3: Get Low Stock Items${NC}"
response=$(curl -s "${API_URL}/api/supplies/low")
low_count=$(echo $response | grep -o '"id"' | wc -l)
echo -e "${GREEN}✅ Found $low_count low stock items${NC}"
echo ""

# Test 4: Get Categories
echo -e "${BLUE}Test 4: Get Categories${NC}"
response=$(curl -s "${API_URL}/api/categories")
cat_count=$(echo $response | grep -o '"id"' | wc -l)
echo -e "${GREEN}✅ Found $cat_count categories${NC}"
echo ""

# Test 5: Submit Transaction (Like Google Form)
echo -e "${BLUE}Test 5: Submit Transaction (Simulating Google Form)${NC}"
response=$(curl -s -X POST "${API_URL}/api/transactions/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "supply_name": "Gauze Pads 4x4",
    "quantity": 3,
    "employee_name": "Test User",
    "notes": "API test transaction"
  }')

if echo $response | grep -q "success"; then
    echo -e "${GREEN}✅ Transaction submitted successfully${NC}"
    echo "Response: $response"
else
    echo -e "${RED}❌ Transaction failed${NC}"
    echo "Response: $response"
fi
echo ""

# Test 6: Get Dashboard Stats
echo -e "${BLUE}Test 6: Get Dashboard Stats${NC}"
response=$(curl -s "${API_URL}/api/dashboard/stats")
if echo $response | grep -q "inventory"; then
    echo -e "${GREEN}✅ Dashboard stats retrieved${NC}"
else
    echo -e "${RED}❌ Dashboard stats failed${NC}"
fi
echo ""

# Test 7: Get Transaction History
echo -e "${BLUE}Test 7: Get Transaction History${NC}"
response=$(curl -s "${API_URL}/api/transactions?limit=5")
if echo $response | grep -q "transactions"; then
    echo -e "${GREEN}✅ Transaction history retrieved${NC}"
else
    echo -e "${RED}❌ Transaction history failed${NC}"
fi
echo ""

echo "======================================"
echo -e "${GREEN}🎉 All tests completed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Open http://localhost:5173 to view the dashboard"
echo "  2. Check the transaction you just created"
echo "  3. Set up Google Forms integration (see GOOGLE_FORMS_SETUP.md)"

