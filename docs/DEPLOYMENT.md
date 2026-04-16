# EcoPulse MVP - Deployment Guide

## 🚀 Quick Start (5 Minutes)

### Option 1: Docker Deployment (Recommended)

```bash
# Clone/Navigate to project directory
cd EcoPulse_project

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:8501
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Local Development Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Start Backend (Terminal 1)
cd backend
uvicorn main:app --reload --port 8000

# Start Frontend (Terminal 2)
cd frontend
streamlit run app.py --server.port 8501
```

## 🔧 Configuration

### Environment Variables
Copy `.env` and update with your settings:

```bash
# Database
DATABASE_URL=postgresql://ecopulse_user:ecopulse_password@localhost:5432/ecopulse_db

# Optional AI APIs (for enhanced features)
HUGGINGFACE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

### Database Setup
- PostgreSQL runs automatically with Docker
- Mock data is pre-loaded
- Tables auto-created on startup

## 📱 Usage Guide

### 1. Register Business
- Navigate to http://localhost:8501
- Fill in business details
- Get unique Business ID

### 2. Upload Energy Bill
- Use "Upload Bill" tab
- Upload image/PDF OR enter manually
- AI processes and extracts data

### 3. Calculate Carbon Footprint
- Go to "Carbon Footprint" tab
- Enter energy usage details
- Get detailed emissions analysis

### 4. Get Action Plan
- Visit "Action Plan" tab
- Click "Generate Action Plan"
- Receive AI recommendations + subsidies

## 🎯 Key Features Demonstrated

### Core MVP Features
✅ **Carbon Footprint Calculator**
- Industry-specific calculations
- Detailed emissions breakdown
- Sustainability rating

✅ **Subsidy Eligibility Checker**
- 5+ pre-loaded subsidy programs
- Smart matching algorithm
- Priority recommendations

✅ **AI Action Plans**
- Personalized recommendations
- Cost-benefit analysis
- Implementation guidance

### Technical Features
✅ **FastAPI Backend**
- RESTful API design
- Automatic API documentation
- Database integration

✅ **Streamlit Frontend**
- Interactive UI
- Real-time calculations
- Data visualizations

✅ **AI Integration**
- HuggingFace models
- ChromaDB vector store
- RAG-based recommendations

✅ **Docker Ready**
- Multi-service orchestration
- Production-ready setup
- Easy deployment

## 🔍 API Endpoints

### Business Management
- `POST /api/business/register` - Register new business
- `GET /api/business/{id}` - Get business details

### Bill Processing
- `POST /api/ingest/upload-bill` - Upload energy bill
- `POST /api/ingest/manual-entry` - Manual bill entry

### Carbon Calculation
- `POST /api/carbon/calculate` - Calculate footprint
- `GET /api/carbon/detailed/{id}` - Get detailed analysis

### Recommendations
- `POST /api/recommend/action-plan` - Generate action plan
- `GET /api/recommend/subsidies/{id}` - Get matching subsidies

## 🧪 Testing

```bash
# Run core functionality tests
python quick_test.py

# Test API endpoints
curl http://localhost:8000/health
curl http://localhost:8000/api/demo-business
```

## 📊 Demo Data

### Sample Business Profile
```json
{
  "name": "Green Tech Solutions",
  "industry": "technology",
  "size": "small",
  "location": "San Francisco, CA",
  "monthly_energy_usage": 850.0,
  "monthly_energy_cost": 120.50,
  "employees_count": 15,
  "annual_revenue": 750000
}
```

### Expected Results
- **Carbon Footprint**: ~2.5 tons CO₂/year
- **Potential Savings**: $5,000-15,000/year
- **Matching Subsidies**: 3-5 programs
- **AI Recommendations**: 5 personalized actions

## 🎉 Success Metrics

### MVP Completion Checklist
- [x] Full-stack application running
- [x] AI-powered recommendations
- [x] Database with mock data
- [x] Frontend user interface
- [x] API documentation
- [x] Docker deployment
- [x] Carbon footprint calculations
- [x] Subsidy matching system
- [x] Bill processing (mock OCR)
- [x] Action plan generation

### Time to Value
- **Setup**: < 5 minutes
- **Business Registration**: < 2 minutes
- **First Recommendation**: < 30 seconds
- **Complete Action Plan**: < 1 minute

## 🚨 Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check ports
netstat -an | findstr :8000
netstat -an | findstr :8501

# Change ports in docker-compose.yml if needed
```

**Database connection:**
```bash
# Reset database
docker-compose down -v
docker-compose up --build
```

**Dependencies:**
```bash
# Install missing packages
pip install -r requirements.txt
```

## 🔮 Next Steps (Post-MVP)

### Immediate Enhancements
1. Real OCR integration (Tesseract)
2. Live government subsidy API
3. Advanced ML models
4. User authentication
5. Multi-language support

### Scaling Features
1. Multi-tenant architecture
2. Real-time analytics dashboard
3. Mobile app development
4. Integration with accounting software
5. Compliance tracking

---

**🎯 Ready for Hackathon Submission!**
Complete working MVP with all core features demonstrated.