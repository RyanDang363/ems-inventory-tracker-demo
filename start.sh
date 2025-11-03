#!/bin/bash

echo "🚑 Starting EMS Inventory Tracker..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js $(node --version) detected"
echo ""

# Install backend dependencies if needed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend && npm install && cd ..
fi

# Initialize database if it doesn't exist
if [ ! -f "backend/database/inventory.db" ]; then
    echo "🗄️ Initializing database..."
    cd backend && npm run init-db && cd ..
fi

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Start backend in background
echo "🚀 Starting backend server..."
cd backend && npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend server..."
cd frontend && npm run dev &
FRONTEND_PID=$!
cd ..

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
