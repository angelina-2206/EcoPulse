from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from ..models import get_db, Business, CarbonFootprint
from ..models.schemas import CarbonFootprintRequest, CarbonFootprintResponse
from ..services.carbon_calculator import CarbonCalculatorService

router = APIRouter(prefix="/api/carbon", tags=["Carbon Footprint"])
carbon_service = CarbonCalculatorService()

@router.post("/calculate", response_model=CarbonFootprintResponse)
async def calculate_carbon_footprint(
    request: CarbonFootprintRequest,
    db: Session = Depends(get_db)
):
    """Calculate carbon footprint for a business"""
    try:
        # Get business details
        business = db.query(Business).filter(Business.id == request.business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Calculate carbon footprint
        calculation_result = carbon_service.calculate_carbon_footprint(
            energy_usage_kwh=request.energy_usage,
            transport_fuel_liters=request.transport_fuel or 0,
            waste_kg=request.waste_amount or 0,
            industry=business.industry,
            business_size=business.size
        )
        
        # Store in database
        carbon_footprint = CarbonFootprint(
            business_id=request.business_id,
            total_emissions=calculation_result["annual_emissions"]["total"],
            energy_emissions=calculation_result["monthly_emissions"]["energy"] * 12,
            transport_emissions=calculation_result["monthly_emissions"]["transport"] * 12,
            waste_emissions=calculation_result["monthly_emissions"]["waste"] * 12,
            calculation_method="standard_factors_v1"
        )
        
        db.add(carbon_footprint)
        db.commit()
        db.refresh(carbon_footprint)
        
        return CarbonFootprintResponse(
            id=carbon_footprint.id,
            business_id=carbon_footprint.business_id,
            total_emissions=carbon_footprint.total_emissions,
            energy_emissions=carbon_footprint.energy_emissions,
            transport_emissions=carbon_footprint.transport_emissions,
            waste_emissions=carbon_footprint.waste_emissions,
            calculation_date=carbon_footprint.calculation_date,
            calculation_method=carbon_footprint.calculation_method
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating carbon footprint: {str(e)}")

@router.get("/detailed/{business_id}")
async def get_detailed_carbon_analysis(business_id: int, db: Session = Depends(get_db)):
    """Get detailed carbon footprint analysis"""
    try:
        business = db.query(Business).filter(Business.id == business_id).first()
        if not business:
            raise HTTPException(status_code=404, detail="Business not found")
        
        # Get latest carbon footprint
        latest_footprint = db.query(CarbonFootprint)\
            .filter(CarbonFootprint.business_id == business_id)\
            .order_by(CarbonFootprint.calculation_date.desc())\
            .first()
        
        if not latest_footprint:
            raise HTTPException(status_code=404, detail="No carbon footprint data found")
        
        # Get detailed analysis
        detailed_analysis = carbon_service.calculate_carbon_footprint(
            energy_usage_kwh=business.monthly_energy_usage or 0,
            industry=business.industry,
            business_size=business.size
        )
        
        return {
            "business_id": business_id,
            "current_footprint": {
                "total_annual_emissions": latest_footprint.total_emissions,
                "energy_emissions": latest_footprint.energy_emissions,
                "transport_emissions": latest_footprint.transport_emissions,
                "waste_emissions": latest_footprint.waste_emissions
            },
            "analysis": detailed_analysis,
            "last_updated": latest_footprint.calculation_date
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting carbon analysis: {str(e)}")

@router.get("/history/{business_id}")
async def get_carbon_footprint_history(business_id: int, db: Session = Depends(get_db)):
    """Get carbon footprint calculation history"""
    try:
        footprints = db.query(CarbonFootprint)\
            .filter(CarbonFootprint.business_id == business_id)\
            .order_by(CarbonFootprint.calculation_date.desc())\
            .all()
        
        return [
            CarbonFootprintResponse(
                id=fp.id,
                business_id=fp.business_id,
                total_emissions=fp.total_emissions,
                energy_emissions=fp.energy_emissions,
                transport_emissions=fp.transport_emissions,
                waste_emissions=fp.waste_emissions,
                calculation_date=fp.calculation_date,
                calculation_method=fp.calculation_method
            ) for fp in footprints
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting footprint history: {str(e)}")