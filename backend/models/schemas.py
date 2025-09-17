from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class BusinessCreate(BaseModel):
    name: str
    industry: str
    size: str = Field(..., description="micro, small, or medium")
    location: str
    monthly_energy_usage: Optional[float] = None
    monthly_energy_cost: Optional[float] = None
    employees_count: Optional[int] = None
    annual_revenue: Optional[float] = None

class BusinessResponse(BaseModel):
    id: int
    name: str
    industry: str
    size: str
    location: str
    monthly_energy_usage: Optional[float]
    monthly_energy_cost: Optional[float]
    employees_count: Optional[int]
    annual_revenue: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True

class CarbonFootprintRequest(BaseModel):
    business_id: int
    energy_usage: float  # kWh
    transport_fuel: Optional[float] = 0  # liters
    waste_amount: Optional[float] = 0  # kg

class CarbonFootprintResponse(BaseModel):
    id: int
    business_id: int
    total_emissions: float
    energy_emissions: float
    transport_emissions: float
    waste_emissions: float
    calculation_date: datetime
    calculation_method: str

    class Config:
        from_attributes = True

class SubsidyResponse(BaseModel):
    id: int
    name: str
    description: str
    eligibility_criteria: Dict[str, Any]
    amount_range: str
    application_deadline: Optional[datetime]
    government_agency: str
    category: str

    class Config:
        from_attributes = True

class RecommendationResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    priority: str
    estimated_savings: Optional[float]
    estimated_co2_reduction: Optional[float]
    implementation_cost: Optional[float]
    implementation_time: str
    ai_confidence: float

    class Config:
        from_attributes = True

class RecommendationRequest(BaseModel):
    business_id: int
    carbon_footprint: Optional[float] = None
    industry: str
    business_size: str

class BillUploadResponse(BaseModel):
    id: int
    filename: str
    extracted_text: str
    parsed_data: Dict[str, Any]
    processing_status: str

class ActionPlanResponse(BaseModel):
    business_id: int
    carbon_footprint: CarbonFootprintResponse
    subsidies: List[SubsidyResponse]
    recommendations: List[RecommendationResponse]
    total_potential_savings: float
    total_potential_co2_reduction: float