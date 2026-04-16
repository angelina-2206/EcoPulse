#!/usr/bin/env python3
"""
Simplified EcoPulse MVP Runner
Starts the application with minimal setup
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path
import os

def check_basic_dependencies():
    """Check if basic packages are installed"""
    required_packages = ['fastapi', 'streamlit', 'uvicorn']
    missing = []
    
    for package in required_packages:
        try:
            __import__(package)
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"❌ Missing packages: {', '.join(missing)}")
        print("Installing required packages...")
        subprocess.run([sys.executable, "-m", "pip", "install"] + missing)
        print("✅ Packages installed")
    
    return True

def start_backend():
    """Start FastAPI backend"""
    print("🚀 Starting FastAPI backend...")
    backend_dir = Path(__file__).parent / "backend"
    
    # Set environment variable to use SQLite
    env = os.environ.copy()
    env["DATABASE_URL"] = "sqlite:///./ecopulse.db"
    
    # Start uvicorn process
    backend_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "main:app", 
        "--reload", "--host", "127.0.0.1", "--port", "8000"
    ], cwd=backend_dir, env=env)
    
    return backend_process

def start_frontend():
    """Start Streamlit frontend"""
    print("🚀 Starting Streamlit frontend...")
    frontend_dir = Path(__file__).parent / "frontend"
    
    # Start streamlit process
    frontend_process = subprocess.Popen([
        sys.executable, "-m", "streamlit", "run", "app.py", 
        "--server.port", "8501", "--server.address", "127.0.0.1"
    ], cwd=frontend_dir)
    
    return frontend_process

def main():
    """Main function to run the application"""
    print("🌱 EcoPulse MVP - Simple Startup")
    print("=" * 40)
    
    # Check dependencies
    if not check_basic_dependencies():
        return
    
    try:
        # Start backend
        backend_process = start_backend()
        time.sleep(5)  # Wait for backend to start
        
        # Start frontend
        frontend_process = start_frontend()
        time.sleep(5)  # Wait for frontend to start
        
        print("\n✅ EcoPulse MVP is running!")
        print("📊 Frontend: http://localhost:8501")
        print("🔧 Backend API: http://localhost:8000")
        print("📖 API Docs: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop all services")
        
        # Open browser
        time.sleep(2)
        try:
            webbrowser.open("http://localhost:8501")
        except:
            pass  # Browser opening is optional
        
        # Wait for processes
        try:
            backend_process.wait()
            frontend_process.wait()
        except KeyboardInterrupt:
            print("\n🛑 Shutting down services...")
            backend_process.terminate()
            frontend_process.terminate()
            print("✅ All services stopped")
    
    except Exception as e:
        print(f"❌ Error running application: {e}")
        print("Try running manually:")
        print("1. cd backend && python -m uvicorn main:app --reload")
        print("2. cd frontend && streamlit run app.py")

if __name__ == "__main__":
    main()