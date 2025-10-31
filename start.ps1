# EMS Inventory Tracker - Quick Start Script (PowerShell)
# This script starts both backend and frontend servers

Write-Host "🚑 Starting EMS Inventory Tracker..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "   Visit: https://nodejs.org/"
    exit 1
}
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "backend") -or -not (Test-Path "frontend")) {
    Write-Host "❌ Error: backend or frontend directory not found" -ForegroundColor Red
    Write-Host "   Please run this script from the project root directory"
    exit 1
}

# Function to check if dependencies are installed
function Check-Dependencies {
    param($dir)
    if (-not (Test-Path "$dir/node_modules")) {
        Write-Host "📦 Installing dependencies in $dir..." -ForegroundColor Yellow
        Set-Location $dir
        npm install
        Set-Location ..
        Write-Host "✅ Dependencies installed in $dir" -ForegroundColor Green
        Write-Host ""
    }
}

# Check and install dependencies
Check-Dependencies "backend"
Check-Dependencies "frontend"

# Check if database exists
if (-not (Test-Path "backend/database/inventory.db")) {
    Write-Host "🗄️  Database not found. Initializing..." -ForegroundColor Yellow
    Set-Location backend
    npm run init-db
    Set-Location ..
    Write-Host ""
}

# Start backend in new window
Write-Host "🚀 Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm start"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Check if backend is running
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/health" -TimeoutSec 5
    Write-Host "✅ Backend running on http://localhost:3000" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend may not be ready yet, continuing..." -ForegroundColor Yellow
}
Write-Host ""

# Start frontend in new window
Write-Host "🚀 Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# Wait for frontend to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ EMS Inventory Tracker is running!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Dashboard: http://localhost:5173" -ForegroundColor Yellow
Write-Host "🔌 API:       http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Both servers are running in separate windows." -ForegroundColor White
Write-Host "Close those windows to stop the servers." -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit this window..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

