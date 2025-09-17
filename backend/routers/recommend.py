from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models import get_db, Business, CarbonFootprint, Recommendation
from ..models.schemas import RecommendationRequest, RecommendationResponse, ActionPlanResponse
from ..services.ai_recommendations import AIRecommendationService
from ..services.subsidy_matcher import SubsidyMatchingService
from ..services.carbon_calculator import CarbonCalculatorService
from ..services.huggingface_service import huggingface_service
from ..services.chromadb_service import ChromaDBService

router = APIRouter(prefix="/api/recommend", tags=["Recommendations"])
ai_service = AIRecommendationService()
subsidy_service = SubsidyMatchingService()
carbon_service = CarbonCalculatorService()
chromadb_service = ChromaDBService()

@router.post("/action-plan", response_model=ActionPlanResponse)
async def generate_action_plan(
    request: RecommendationRequest,
    db: Session = Depends(get_db)
):
    """Generate comprehensive action plan with recommendations and subsidies"""
    try:
        # Get business details
        business = db.query(Business).filter(Business.id == request.business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Get or calculate carbon footprint
        latest_footprint = db.query(CarbonFootprint)\
            .filter(CarbonFootprint.business_id == request.business_id)\
            .order_by(CarbonFootprint.calculation_date.desc())\
            .first()
        
        if not latest_footprint:
            # Calculate new footprint
            carbon_data = carbon_service.calculate_carbon_footprint(
                energy_usage_kwh=business.monthly_energy_usage or 850,
                industry=business.industry,
                business_size=business.size
            )
            
            # Store it
            new_footprint = CarbonFootprint(
                business_id=request.business_id,
                total_emissions=carbon_data["annual_emissions"]["total"],
                energy_emissions=carbon_data["monthly_emissions"]["energy"] * 12,
                transport_emissions=carbon_data["monthly_emissions"]["transport"] * 12,
                waste_emissions=carbon_data["monthly_emissions"]["waste"] * 12,
                calculation_method="auto_generated"
            )
            db.add(new_footprint)
            db.commit()
            db.refresh(new_footprint)
            latest_footprint = new_footprint
        else:
            # Get detailed analysis for existing footprint
            carbon_data = carbon_service.calculate_carbon_footprint(
                energy_usage_kwh=business.monthly_energy_usage or 850,
                industry=business.industry,
                business_size=business.size
            )
        
        # Prepare business profile
        business_profile = {
            "industry": business.industry,
            "size": business.size,
            "location": business.location,
            "annual_revenue": business.annual_revenue,
            "employees_count": business.employees_count,
            "monthly_energy_usage": business.monthly_energy_usage,
            "annual_carbon_footprint": latest_footprint.total_emissions,
            "sustainability_rating": carbon_data.get("rating", "average")
        }
        
        # Generate AI recommendations
        ai_recommendations = ai_service.generate_recommendations(business_profile, carbon_data)
        
        # Enhance recommendations with HuggingFace AI insights
        enhanced_recommendations = huggingface_service.enhance_recommendations(business_profile, ai_recommendations)
        
        # Get contextual policy recommendations from ChromaDB
        policy_context = chromadb_service.get_contextual_recommendations(business_profile)
        
        # Store recommendations in database
        stored_recommendations = []
        for rec in enhanced_recommendations:
            recommendation = Recommendation(
                business_id=request.business_id,
                title=rec["title"],
                description=rec["description"],
                category=rec.get("category", "general"),
                priority=rec["priority"],
                estimated_savings=rec["estimated_savings"],
                estimated_co2_reduction=rec["estimated_co2_reduction"],
                implementation_cost=rec["implementation_cost"],
                implementation_time=rec["implementation_time"],
                ai_confidence=rec["ai_confidence"]
            )
            db.add(recommendation)
            db.commit()
            db.refresh(recommendation)
            stored_recommendations.append(recommendation)
        
        # Find matching subsidies
        matching_subsidies = subsidy_service.find_matching_subsidies(business_profile)
        prioritized_subsidies = subsidy_service.get_application_priority(matching_subsidies)
        
        # Calculate totals
        total_potential_savings = sum(rec["estimated_savings"] for rec in enhanced_recommendations)
        total_potential_co2_reduction = sum(rec["estimated_co2_reduction"] for rec in enhanced_recommendations)
        
        return ActionPlanResponse(
            business_id=request.business_id,
            carbon_footprint={
                "id": latest_footprint.id,
                "business_id": latest_footprint.business_id,
                "total_emissions": latest_footprint.total_emissions,
                "energy_emissions": latest_footprint.energy_emissions,
                "transport_emissions": latest_footprint.transport_emissions,
                "waste_emissions": latest_footprint.waste_emissions,
                "calculation_date": latest_footprint.calculation_date,
                "calculation_method": latest_footprint.calculation_method
            },
            subsidies=[{
                "id": sub["id"],
                "name": sub["name"],
                "description": sub["description"],
                "eligibility_criteria": sub["eligibility_criteria"],
                "amount_range": sub["amount_range"],
                "application_deadline": None,  # Simplified for MVP
                "government_agency": sub["government_agency"],
                "category": sub["category"]
            } for sub in prioritized_subsidies[:3]],  # Top 3 subsidies
            recommendations=[{
                "id": rec.id,
                "title": rec.title,
                "description": rec.description,
                "category": rec.category,
                "priority": rec.priority,
                "estimated_savings": rec.estimated_savings,
                "estimated_co2_reduction": rec.estimated_co2_reduction,
                "implementation_cost": rec.implementation_cost,
                "implementation_time": rec.implementation_time,
                "ai_confidence": rec.ai_confidence
            } for rec in stored_recommendations],
            total_potential_savings=total_potential_savings,
            total_potential_co2_reduction=total_potential_co2_reduction
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating action plan: {str(e)}")

@router.get("/subsidies/{business_id}")
async def get_matching_subsidies(business_id: int, db: Session = Depends(get_db)):
    """Get subsidies matching the business profile"""
    try:
        business = db.query(Business).filter(Business.id == business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        business_profile = {
            "industry": business.industry,
            "size": business.size,
            "location": business.location,
            "annual_revenue": business.annual_revenue,
            "employees_count": business.employees_count,
            "monthly_energy_usage": business.monthly_energy_usage
        }
        
        matching_subsidies = subsidy_service.find_matching_subsidies(business_profile)
        return subsidy_service.get_application_priority(matching_subsidies)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error finding subsidies: {str(e)}")

@router.get("/recommendations/{business_id}")
async def get_business_recommendations(business_id: int, db: Session = Depends(get_db)):
    """Get all recommendations for a business"""
    try:
        recommendations = db.query(Recommendation)\
            .filter(Recommendation.business_id == business_id)\
            .order_by(Recommendation.created_at.desc())\
            .all()
        
        return [
            RecommendationResponse(
                id=rec.id,
                title=rec.title,
                description=rec.description,
                category=rec.category,
                priority=rec.priority,
                estimated_savings=rec.estimated_savings,
                estimated_co2_reduction=rec.estimated_co2_reduction,
                implementation_cost=rec.implementation_cost,
                implementation_time=rec.implementation_time,
                ai_confidence=rec.ai_confidence
            ) for rec in recommendations
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")

@router.post("/ai-insights/{business_id}")
async def get_ai_insights(business_id: int, db: Session = Depends(get_db)):
    """Get AI-powered insights and policy recommendations"""
    try:
        business = db.query(Business).filter(Business.id == business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        business_profile = {
            "industry": business.industry,
            "size": business.size,
            "location": business.location,
            "annual_revenue": business.annual_revenue,
            "employees_count": business.employees_count,
            "monthly_energy_usage": business.monthly_energy_usage
        }
        
        # Get contextual recommendations from ChromaDB
        policy_context = chromadb_service.get_contextual_recommendations(business_profile)
        
        # Generate personalized message
        action_plan_data = {
            "total_potential_savings": 5000,  # Mock for demo
            "total_potential_co2_reduction": 3.5
        }
        personalized_message = huggingface_service.generate_personalized_message(business_profile, action_plan_data)
        
        return {
            "business_id": business_id,
            "ai_insights": {
                "personalized_message": personalized_message,
                "relevant_policies": policy_context.get("relevant_policies", []),
                "implementation_guidelines": policy_context.get("implementation_guidelines", []),
                "ai_confidence": 0.85
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")