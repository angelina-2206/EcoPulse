# 🚀 EcoPulse MVP - Manual Start (Error-Free)

## If You're Getting Errors, Use This Method:

### Step 1: Install Basic Packages
```powershell
pip install fastapi uvicorn streamlit plotly pandas requests
```

### Step 2: Start Backend (Terminal 1)
```powershell
cd backend
set DATABASE_URL=sqlite:///./ecopulse.db
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

### Step 3: Start Frontend (Terminal 2)
```powershell
cd frontend
streamlit run app.py --server.port 8501
```

### Step 4: Access Application
- **Frontend**: http://localhost:8501
- **Backend**: http://localhost:8000/docs

## Alternative: Use Simple Startup Script
```powershell
python simple_start.py
```

## Demo Flow (Even If Database Errors Occur):
1. Open http://localhost:8501
2. Register business (may use mock data)
3. Enter energy usage manually
4. Get carbon footprint calculation
5. Generate AI recommendations
6. View subsidy matching

**Note**: The app will work with mock services even if database setup fails. Perfect for demo purposes!

## Troubleshooting:
- **Port errors**: Kill processes with `taskkill /F /PID <process_id>`
- **Import errors**: Reinstall packages with pip
- **Database errors**: App continues with mock data - no problem for demo!