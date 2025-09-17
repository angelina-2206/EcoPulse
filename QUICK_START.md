# 🚀 EcoPulse MVP - Quick Start Without Docker

## Fastest Way to Demo (2 Minutes)

### Method 1: One-Click Start
```cmd
# Just double-click start.bat or run:
start.bat
```

### Method 2: Python Runner
```powershell
pip install -r requirements-minimal.txt
python run_local.py
```

## What This Includes

✅ **SQLite Database** (no PostgreSQL needed)
✅ **Mock AI Services** (no heavy ML libraries needed)  
✅ **Full Functionality** (carbon calc, recommendations, subsidies)
✅ **Auto Browser Opening** (goes straight to http://localhost:8501)

## Demo Flow

1. **Start Application** → Run `start.bat`
2. **Register Business** → Fill in company details
3. **Calculate Carbon** → Enter energy usage  
4. **Get Recommendations** → AI-generated action plan
5. **View Subsidies** → Matching government programs

## Troubleshooting

**If Python not found:**
```powershell
# Check Python installation
python --version
# If not found, install from python.org
```

**If ports in use:**
```powershell
# Kill processes using ports 8000/8501
netstat -ano | findstr :8000
taskkill /F /PID <process_id>
```

**If packages fail to install:**
```powershell
# Use Python directly
python -m pip install fastapi uvicorn streamlit pandas plotly requests
```

## Full Feature Demo

Your MVP includes:
- 🏢 Business registration
- 📄 Energy bill processing (manual entry)
- 🌍 Carbon footprint calculation  
- 🤖 AI recommendations (5+ suggestions)
- 💰 Subsidy matching (government programs)
- 📊 Interactive charts and metrics

**Ready for hackathon presentation! 🏆**