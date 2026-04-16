#!/usr/bin/env python3
"""
Local development runner for EcoPulse MVP
Runs the application without Docker dependencies
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path
import os

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import fastapi
        import streamlit
        import uvicorn
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing dependency: {e}")
        print("Please run: pip install -r requirements.txt")
        return False

def setup_database():
    """Initialize SQLite database"""
    try:
        # Add backend to Python path
        backend_path = str(Path(__file__).parent / "backend")
        if backend_path not in sys.path:
            sys.path.insert(0, backend_path)
        
        # Import and create tables
        from models.database import create_tables
        create_tables()
        print("✅ Database initialized successfully")
        
        # Simple mock data approach - don't add subsidies programmatically for now
        # The subsidies will be handled by the mock subsidy service
        print("✅ Using mock subsidy service for demo data")
        
        return True
    except Exception as e:
        print(f"⚠️ Database setup note: {e}")
        print("✅ Continuing with mock data services")
        return True  # Continue anyway with mock services

def start_backend():
    """Start FastAPI backend"""
    print("🚀 Starting FastAPI backend...")
    backend_dir = Path(__file__).parent / "backend"
    
    # Start uvicorn process
    backend_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "main:app", 
        "--reload", "--host", "127.0.0.1", "--port", "8000"
    ], cwd=backend_dir)
    
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
    print("🌱 EcoPulse MVP - Local Development Runner")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        return
    
    # Setup database
    if not setup_database():
        return
    
    try:
        # Start backend
        backend_process = start_backend()
        time.sleep(3)  # Wait for backend to start
        
        # Start frontend
        frontend_process = start_frontend()
        time.sleep(3)  # Wait for frontend to start
        
        print("\n✅ EcoPulse MVP is running!")
        print("📊 Frontend: http://localhost:8501")
        print("🔧 Backend API: http://localhost:8000")
        print("📖 API Docs: http://localhost:8000/docs")
        print("\nPress Ctrl+C to stop all services")
        
        # Open browser
        time.sleep(2)
        webbrowser.open("http://localhost:8501")
        
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

if __name__ == "__main__":
    main()