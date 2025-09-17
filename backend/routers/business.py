from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..models import get_db, Business
from ..models.schemas import BusinessCreate, BusinessResponse

router = APIRouter(prefix="/api/business", tags=["Business Management"])

@router.post("/register", response_model=BusinessResponse)
async def register_business(business: BusinessCreate, db: Session = Depends(get_db)):
    """Register a new business"""
    try:
        db_business = Business(
            name=business.name,
            industry=business.industry,
            size=business.size,
            location=business.location,
            monthly_energy_usage=business.monthly_energy_usage,
            monthly_energy_cost=business.monthly_energy_cost,
            employees_count=business.employees_count,
            annual_revenue=business.annual_revenue
        )
        
        db.add(db_business)
        db.commit()
        db.refresh(db_business)
        
        return BusinessResponse(
            id=db_business.id,
            name=db_business.name,
            industry=db_business.industry,
            size=db_business.size,
            location=db_business.location,
            monthly_energy_usage=db_business.monthly_energy_usage,
            monthly_energy_cost=db_business.monthly_energy_cost,
            employees_count=db_business.employees_count,
            annual_revenue=db_business.annual_revenue,
            created_at=db_business.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering business: {str(e)}")

@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(business_id: int, db: Session = Depends(get_db)):
    """Get business details"""
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    return BusinessResponse(
        id=business.id,
        name=business.name,
        industry=business.industry,
        size=business.size,
        location=business.location,
        monthly_energy_usage=business.monthly_energy_usage,
        monthly_energy_cost=business.monthly_energy_cost,
        employees_count=business.employees_count,
        annual_revenue=business.annual_revenue,
        created_at=business.created_at
    )

@router.get("/", response_model=List[BusinessResponse])
async def list_businesses(db: Session = Depends(get_db)):
    """List all businesses"""
    businesses = db.query(Business).all()
    return [
        BusinessResponse(
            id=b.id,
            name=b.name,
            industry=b.industry,
            size=b.size,
            location=b.location,
            monthly_energy_usage=b.monthly_energy_usage,
            monthly_energy_cost=b.monthly_energy_cost,
            employees_count=b.employees_count,
            annual_revenue=b.annual_revenue,
            created_at=b.created_at
        ) for b in businesses
    ]

@router.put("/{business_id}", response_model=BusinessResponse)
async def update_business(business_id: int, business_update: BusinessCreate, db: Session = Depends(get_db)):
    """Update business details"""
    business = db.query(Business).filter(Business.id == business_id).first()
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    
    for field, value in business_update.dict(exclude_unset=True).items():
        setattr(business, field, value)
    
    db.commit()
    db.refresh(business)
    
    return BusinessResponse(
        id=business.id,
        name=business.name,
        industry=business.industry,
        size=business.size,
        location=business.location,
        monthly_energy_usage=business.monthly_energy_usage,
        monthly_energy_cost=business.monthly_energy_cost,
        employees_count=business.employees_count,
        annual_revenue=business.annual_revenue,
        created_at=business.created_at
    )