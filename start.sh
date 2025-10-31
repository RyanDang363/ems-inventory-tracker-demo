#!/bin/bash

# EMS Inventory Tracker - Quick Start Script
# This script starts both backend and frontend servers

echo "🚑 Starting EMS Inventory Tracker..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: backend or frontend directory not found"
    echo "   Please run this script from the project root directory"
    exit 1
fi

# Function to check if dependencies are installed
check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing dependencies in $dir..."
        cd "$dir"
        npm install
        cd ..
        echo "✅ Dependencies installed in $dir"
        echo ""
    fi
}

# Check and install dependencies
check_dependencies "backend"
check_dependencies "frontend"

# Check if database exists
if [ ! -f "backend/database/inventory.db" ]; then
    echo "🗄️  Database not found. Initializing..."
    cd backend
    npm run init-db
    cd ..
    echo ""
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Backend running on http://localhost:3000"
else
    echo "⚠️  Backend may not be ready yet, continuing..."
fi
echo ""

# Start frontend
echo "🚀 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

echo ""
echo "======================================"
echo "✅ EMS Inventory Tracker is running!"
echo "======================================"
echo ""
echo "📊 Dashboard: http://localhost:5173"
echo "🔌 API:       http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

