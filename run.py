import subprocess
import time
import os
import sys
import webbrowser
from concurrent.futures import ThreadPoolExecutor

def run_backend():
    print("Starting EcoPulse Backend (FastAPI)...")
    # Change directory to backend
    os.chdir("backend")
    subprocess.run([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"])

def run_frontend():
    print("Starting EcoPulse Frontend (React/Vite)...")
    # Wait for backend to potentially start
    time.sleep(3)
    # Change directory to frontend
    os.chdir("../frontend")
    # Using shell=True for npm on Windows
    subprocess.run("npm run dev -- --port 8501", shell=True)

def main():
    print("""
    EcoPulse - AI-Driven MSME Sustainability Advisor
    ================================================
    """)
    
    # Check if we are in the root directory
    if not os.path.exists("backend") or not os.path.exists("frontend"):
        print("Error: Please run this script from the EcoPulse project root directory.")
        return

    # Install dependencies if needed? (User said build accordingly)
    # print("📦 Ensuring dependencies are installed...")
    # subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

    with ThreadPoolExecutor(max_workers=2) as executor:
        backend_future = executor.submit(run_backend)
        frontend_future = executor.submit(run_frontend)
        
        # Give it a few seconds then open browser
        time.sleep(5)
        print("App should be available at http://localhost:8501")
        # webbrowser.open("http://localhost:8501")
        
        try:
            # Wait for them (they won't return unless killed)
            backend_future.result()
            frontend_future.result()
        except KeyboardInterrupt:
            print("\nShutting down EcoPulse...")

if __name__ == "__main__":
    main()
