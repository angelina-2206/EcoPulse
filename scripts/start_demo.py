#!/usr/bin/env python3
"""
EcoPulse Demo Startup Script
Ensures backend starts properly before frontend
"""

import subprocess
import sys
import time
import webbrowser
import requests
from pathlib import Path
import os

def install_dependencies():
    """Install required packages"""
    required = ['fastapi', 'uvicorn', 'streamlit', 'plotly', 'pandas', 'requests', 'sqlalchemy', 'pydantic']
    
    print("📦 Installing required packages...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install"] + required, check=True)
        print("✅ All packages installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install packages")
        return False

def wait_for_backend(max_retries=30):
    """Wait for backend to be ready"""
    print("⏳ Waiting for backend to start...")
    
    for i in range(max_retries):
        try:
            response = requests.get("http://localhost:8000/health", timeout=2)
            if response.status_code == 200:
                print("✅ Backend is ready!")
                return True
        except:
            pass
        
        print(f"   Attempt {i+1}/{max_retries}...")
        time.sleep(2)
    
    print("⚠️ Backend not responding, but continuing...")
    return False

def start_backend():
    """Start FastAPI backend"""
    print("🚀 Starting FastAPI backend...")
    backend_dir = Path(__file__).parent / "backend"
    
    # Set environment
    env = os.environ.copy()
    env["DATABASE_URL"] = "sqlite:///./ecopulse.db"
    
    # Start backend
    process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "main:app", 
        "--reload", "--host", "127.0.0.1", "--port", "8000"
    ], cwd=backend_dir, env=env)
    
    return process

def start_frontend():
    """Start Streamlit frontend"""
    print("🌐 Starting Streamlit frontend...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    process = subprocess.Popen([
        sys.executable, "-m", "streamlit", "run", "app.py", 
        "--server.port", "8501", "--server.address", "127.0.0.1"
    ], cwd=frontend_dir)
    
    return process

def main():
    """Main startup sequence"""
    print("🌱 EcoPulse MVP Demo Startup")
    print("=" * 50)
    
    # Install dependencies
    if not install_dependencies():
        print("❌ Failed to install dependencies")
        return
    
    print("\n" + "=" * 50)
    print("🚀 Starting Services...")
    print("=" * 50)
    
    try:
        # Start backend
        backend_process = start_backend()
        
        # Wait for backend to be ready
        backend_ready = wait_for_backend()
        
        # Start frontend
        frontend_process = start_frontend()
        
        # Wait a bit for frontend to start
        time.sleep(5)
        
        print("\n" + "=" * 50)
        print("✅ EcoPulse MVP is running!")
        print("=" * 50)
        print("🌐 Frontend: http://localhost:8501")
        print("🔧 Backend API: http://localhost:8000")
        print("📖 API Docs: http://localhost:8000/docs")
        
        if backend_ready:
            print("✅ Full functionality available")
        else:
            print("⚠️ Demo mode (limited functionality)")
        
        print("\\nPress Ctrl+C to stop all services")
        print("=" * 50)
        
        # Open browser
        time.sleep(2)
        try:
            webbrowser.open("http://localhost:8501")
            print("🌐 Browser opened automatically")
        except:
            print("🌐 Please open http://localhost:8501 in your browser")
        
        # Wait for user interrupt
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\\n🛑 Shutting down services...")
            backend_process.terminate()
            frontend_process.terminate()
            print("✅ All services stopped")
    
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\\n📋 Manual startup instructions:")
        print("1. cd backend && python -m uvicorn main:app --reload")
        print("2. cd frontend && streamlit run app.py")

if __name__ == "__main__":
    main()