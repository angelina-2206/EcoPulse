#!/usr/bin/env powershell
# EcoPulse MVP Demo Startup Script for PowerShell

Write-Host "🌱 EcoPulse MVP - Demo Startup" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

# Install required packages
Write-Host "📦 Installing required packages..." -ForegroundColor Yellow
pip install fastapi uvicorn streamlit plotly pandas requests sqlalchemy pydantic

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install packages" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Packages installed successfully" -ForegroundColor Green

# Start backend
Write-Host "🚀 Starting backend..." -ForegroundColor Yellow
Set-Location backend
$env:DATABASE_URL = "sqlite:///./ecopulse.db"

# Start backend process
$backend = Start-Process python -ArgumentList "-m", "uvicorn", "main:app", "--reload", "--host", "127.0.0.1", "--port", "8000" -PassThru

# Return to root
Set-Location ..

# Wait for backend
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep 10

# Test backend
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is ready!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Backend not responding (continuing anyway)" -ForegroundColor Yellow
}

# Start frontend
Write-Host "🌐 Starting frontend..." -ForegroundColor Yellow
Set-Location frontend
$frontend = Start-Process python -ArgumentList "-m", "streamlit", "run", "app.py", "--server.port", "8501" -PassThru

# Return to root
Set-Location ..

# Wait for frontend
Start-Sleep 5

Write-Host ""
Write-Host "✅ EcoPulse MVP is running!" -ForegroundColor Green
Write-Host "🌐 Frontend: http://localhost:8501" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow

# Open browser
Start-Process "http://localhost:8501"

# Wait for user input
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
Write-Host "✅ All services stopped" -ForegroundColor Green