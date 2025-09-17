from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Simple FastAPI app for demo
app = FastAPI(
    title="EcoPulse API",
    description="AI-driven MSME sustainability advisor API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to EcoPulse API",
        "description": "AI-driven MSME sustainability advisor",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "EcoPulse API",
        "database": "connected"
    }

# Mock business registration
@app.post("/api/business/register")
async def register_business(business_data: dict):
    # Mock response
    return {
        "id": 1,
        "name": business_data.get("name", "Demo Business"),
        "industry": business_data.get("industry", "technology"),
        "size": business_data.get("size", "small"),
        "location": business_data.get("location", "Demo Location"),
        "created_at": "2024-09-17T10:00:00"
    }

# Mock carbon calculation
@app.post("/api/carbon/calculate")
async def calculate_carbon(data: dict):
    energy_usage = data.get("energy_usage", 850)
    business_id = data.get("business_id", 1)
    
    # Simple calculation
    total_emissions = energy_usage * 0.0005 * 12  # Mock formula
    
    return {
        "id": 1,
        "business_id": business_id,
        "total_emissions": round(total_emissions, 2),
        "energy_emissions": round(total_emissions * 0.8, 2),
        "transport_emissions": round(total_emissions * 0.15, 2),
        "waste_emissions": round(total_emissions * 0.05, 2),
        "calculation_date": "2024-09-17T10:00:00",
        "calculation_method": "mock_calculation"
    }

# Mock recommendations
@app.post("/api/recommend/action-plan")
async def generate_action_plan(data: dict):
    business_id = data.get("business_id", 1)
    
    return {
        "business_id": business_id,
        "carbon_footprint": {
            "id": 1,
            "business_id": business_id,
            "total_emissions": 5.1,
            "energy_emissions": 4.08,
            "transport_emissions": 0.77,
            "waste_emissions": 0.26,
            "calculation_date": "2024-09-17T10:00:00",
            "calculation_method": "mock_calculation"
        },
        "subsidies": [
            {
                "id": 1,
                "name": "Small Business Energy Efficiency Grant",
                "description": "Federal grant providing up to $10,000 for energy efficiency improvements",
                "eligibility_criteria": {"business_size": ["micro", "small"]},
                "amount_range": "$2,000 - $10,000",
                "government_agency": "Department of Energy",
                "category": "energy"
            },
            {
                "id": 2,
                "name": "Green Technology Adoption Incentive",
                "description": "State-level incentive for adopting renewable energy solutions",
                "eligibility_criteria": {"business_size": ["small", "medium"]},
                "amount_range": "$5,000 - $25,000",
                "government_agency": "State Environmental Agency",
                "category": "renewable_energy"
            }
        ],
        "recommendations": [
            {
                "id": 1,
                "title": "Switch to LED Lighting",
                "description": "Replace all traditional bulbs with LED alternatives. LEDs use 75% less energy and last 25 times longer.",
                "category": "energy",
                "priority": "high",
                "estimated_savings": 1200.0,
                "estimated_co2_reduction": 0.8,
                "implementation_cost": 500.0,
                "implementation_time": "1 week",
                "ai_confidence": 0.9
            },
            {
                "id": 2,
                "title": "Install Smart Thermostats",
                "description": "Programmable thermostats can reduce heating and cooling costs by 10-15%.",
                "category": "energy",
                "priority": "high",
                "estimated_savings": 800.0,
                "estimated_co2_reduction": 1.2,
                "implementation_cost": 300.0,
                "implementation_time": "2 days",
                "ai_confidence": 0.85
            },
            {
                "id": 3,
                "title": "Implement Recycling Program",
                "description": "Set up comprehensive recycling for paper, plastic, metal, and organic waste.",
                "category": "waste",
                "priority": "medium",
                "estimated_savings": 500.0,
                "estimated_co2_reduction": 0.3,
                "implementation_cost": 100.0,
                "implementation_time": "1 week",
                "ai_confidence": 0.8
            }
        ],
        "total_potential_savings": 2500.0,
        "total_potential_co2_reduction": 2.3
    }

if __name__ == "__main__":
    uvicorn.run(
        "simple_main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True
    )
