#!/usr/bin/env python3
"""
Emergency Fast Startup - EcoPulse MVP
"""

import subprocess
import sys
import time
import webbrowser
from pathlib import Path

def quick_start():
    print("🚀 EcoPulse Emergency Startup")
    print("============================")
    
    # Install basics
    print("📦 Installing basics...")
    subprocess.run([sys.executable, "-m", "pip", "install", "fastapi", "uvicorn", "streamlit"], check=False)
    
    # Start simple backend
    print("🔧 Starting simple backend...")
    backend_dir = Path(__file__).parent / "backend"
    backend_process = subprocess.Popen([
        sys.executable, "-c", """
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
def health(): return {"status": "healthy"}

@app.post("/api/business/register")
def register(data: dict): return {"id": 1, "name": data.get("name", "Demo"), "industry": "tech"}

@app.post("/api/carbon/calculate")  
def carbon(data: dict): return {"total_emissions": 5.1, "energy_emissions": 4.0}

@app.post("/api/recommend/action-plan")
def recommend(data: dict): 
    return {
        "business_id": 1,
        "recommendations": [{"title": "LED Lighting", "estimated_savings": 1200, "priority": "high"}],
        "total_potential_savings": 2500.0
    }

uvicorn.run(app, host="127.0.0.1", port=8000)
"""
    ])
    
    time.sleep(5)
    
    # Start frontend
    print("🌐 Starting frontend...")
    frontend_dir = Path(__file__).parent / "frontend"
    frontend_process = subprocess.Popen([
        sys.executable, "-m", "streamlit", "run", "app.py", "--server.port", "8501"
    ], cwd=frontend_dir)
    
    time.sleep(3)
    
    print("✅ EcoPulse running!")
    print("🌐 Frontend: http://localhost:8501")
    print("🔧 Backend: http://localhost:8000")
    
    # Open browser
    try:
        webbrowser.open("http://localhost:8501")
    except:
        pass
    
    try:
        input("\\nPress Enter to stop...")
    except KeyboardInterrupt:
        pass
    
    backend_process.terminate()
    frontend_process.terminate()
    print("✅ Stopped")

if __name__ == "__main__":
    quick_start()