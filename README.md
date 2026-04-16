# EcoPulse - AI-Driven MSME Sustainability Advisor

🌱 **An AI-powered sustainability advisor for Micro, Small & Medium Enterprises (MSMEs)**

**Built for Hackathon Submission** | **Complete Working MVP** | **Ready to Deploy**

# Project ID: T3:436 | Project Name: EcoPulse | Team EcoNexus | Kaggle ID: angelinachatterjee22 |

Team EcoNexus : Angelina Chatterjee and Aagman Sharma

## 🎯 Problem Statement

MSMEs face significant challenges in:
- Understanding their environmental impact
- Finding relevant government subsidies
- Implementing cost-effective sustainability measures
- Navigating complex compliance requirements

## 💡 Solution: EcoPulse

AI-driven platform that provides:
- **Carbon Footprint Calculator**: Accurate emissions assessment
- **Subsidy Matching**: Intelligent government incentive discovery
- **Personalized Action Plans**: AI-generated sustainability roadmaps
- **Document Processing**: Automated energy bill analysis

## 🚀 Quick Demo (5 Minutes)

### Start the Application
```bash
git clone <your-repo>
cd EcoPulse_project
docker-compose up --build
```

### Access the Platform
- **Frontend**: http://localhost:8501
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### Demo Flow
1. **Register Business** → Get Business ID
2. **Upload Energy Bill** → AI extracts data
3. **Calculate Carbon Footprint** → Get emissions analysis
4. **Generate Action Plan** → Receive AI recommendations + subsidies

## 🏗️ Technical Architecture

### Backend (FastAPI)
- **Carbon Calculator**: Industry-specific emission factors
- **AI Recommendations**: Rule-based + ML-enhanced suggestions
- **Subsidy Matcher**: Smart eligibility assessment
- **ChromaDB RAG**: Policy document retrieval
- **HuggingFace Integration**: NLP and text processing

### Frontend (React + Vite)
- **Interactive UI**: Real-time calculations and visualizations with Glassmorphism design
- **State Management**: Built-in React state with LocalStorage persistence
- **Data Visualization**: Premium Recharts-based interactive dashboards
- **Modern Styling**: Custom Vanilla CSS with Outfit & Inter typography

### AI/ML Components
- **Sentence Transformers**: Document embeddings
- **Named Entity Recognition**: Bill text extraction
- **Recommendation Engine**: Personalized sustainability advice
- **Vector Search**: Policy and guideline retrieval

### Database
- **PostgreSQL**: Structured business and calculation data
- **ChromaDB**: Vector store for policy documents
- **Mock Data**: Pre-loaded subsidies and guidelines

## 📊 Key Features Demonstrated

### ✅ Core MVP Features
- **Carbon Footprint Calculator**
  - Monthly/annual emissions calculation
  - Industry-specific factors
  - Benchmark comparisons
  - Sustainability ratings

- **Subsidy Eligibility Checker**
  - 5+ pre-loaded government programs
  - Smart matching algorithm
  - Priority scoring
  - Application deadlines

- **AI Action Plans**
  - 5+ personalized recommendations
  - Cost-benefit analysis
  - Implementation timelines
  - Follow-up suggestions

### 🚀 Technical Achievements
- **Full-Stack Application**: Frontend + Backend + Database
- **AI Integration**: Multiple HuggingFace models
- **Vector Database**: ChromaDB with policy documents
- **API Documentation**: Auto-generated with FastAPI
- **Docker Deployment**: Production-ready containerization
- **Real-time Processing**: Instant calculations and recommendations

## 🎯 Demo Results

### Sample Business: "Green Tech Solutions"
- **Industry**: Technology
- **Size**: Small (15 employees)
- **Monthly Energy**: 850 kWh

### Expected Outputs
- **Carbon Footprint**: 2.5 tons CO₂/year
- **Sustainability Rating**: "Good"
- **Potential Savings**: $8,500/year
- **CO₂ Reduction**: 3.2 tons/year
- **Matching Subsidies**: 4 programs
- **Top Recommendation**: LED lighting upgrade

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|------------|----------|
| **Backend** | FastAPI + SQLAlchemy | REST API and database ORM |
| **Frontend** | Streamlit | Interactive web interface |
| **Database** | PostgreSQL | Structured data storage |
| **Vector DB** | ChromaDB | Document embeddings and search |
| **AI/ML** | HuggingFace Transformers | NLP and text processing |
| **Visualization** | Plotly | Charts and data visualization |
| **Deployment** | Docker + Docker Compose | Containerization |

## 🚀 Quick Start

### 1. Installation
```bash
# Clone repository
git clone <your-repo-url>
cd EcoPulse_project

# Create and activate virtual environment (optional but recommended)
python -m venv .venv
source .venv/bin/activate  # Or `.venv\Scripts\activate` on Windows

# Install dependencies
# Install dependencies (Backend)
pip install -r requirements.txt

# Install dependencies (Frontend)
cd frontend
npm install
cd ..
```

### 2. Run the Application
We've provided a unified run script that starts both the Backend and Frontend with one command:
```bash
python run.py
```

### 3. Access the Platform
- **Frontend Dashboard**: http://localhost:8501 (Premium UI)
- **Backend API Docs**: http://localhost:8000/docs

## 🏗️ Technical Architecture & Structure

The project has been streamlined for maximum clarity:

```
ecopulse/
├── backend/           # FastAPI: Business logic, AI services, Carbon engine
├── frontend/          # React + Vite: Premium Dashboard & Interactive UI
├── docs/              # Detailed guides (Deployment, Troubleshooting, etc.)
├── scripts/           # Legacy and utility scripts
├── data/              # Mock data & Database initialization
├── run.py             # Main entry point (starts both services)
└── requirements.txt   # Unified project dependencies
```


## 📈 Future Roadmap

### Phase 2 (Post-Hackathon)
- Real OCR integration
- Live government API connections
- Advanced ML models
- Multi-language support
- Mobile application

### Phase 3 (Scale)
- Multi-tenant SaaS platform
- Enterprise integrations
- Compliance tracking
- Automated reporting
- Marketplace for green solutions

---

**🎉 Ready for submission!** Complete working MVP with AI-powered sustainability recommendations for MSMEs.

**Demo**: http://localhost:8501 | **API**: http://localhost:8000/docs

**Team**: EcoNexus | **Built with**: FastAPI + HuggingFace + Streamlit + ChromaDB