from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Business(Base):
    __tablename__ = "businesses"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String, nullable=False)
    size = Column(String, nullable=False)  # micro, small, medium
    location = Column(String, nullable=False)
    monthly_energy_usage = Column(Float)  # kWh
    monthly_energy_cost = Column(Float)  # USD
    employees_count = Column(Integer)
    annual_revenue = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    carbon_footprints = relationship("CarbonFootprint", back_populates="business")
    recommendations = relationship("Recommendation", back_populates="business")

class CarbonFootprint(Base):
    __tablename__ = "carbon_footprints"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    total_emissions = Column(Float)  # tons CO2
    energy_emissions = Column(Float)
    transport_emissions = Column(Float)
    waste_emissions = Column(Float)
    calculation_date = Column(DateTime(timezone=True), server_default=func.now())
    calculation_method = Column(String)
    
    # Relationship
    business = relationship("Business", back_populates="carbon_footprints")

class Subsidy(Base):
    __tablename__ = "subsidies"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    eligibility_criteria = Column(JSON)
    amount_range = Column(String)
    application_deadline = Column(DateTime)
    government_agency = Column(String)
    category = Column(String)  # energy, waste, transport, etc.
    business_size_eligible = Column(JSON)  # ["micro", "small", "medium"]
    industry_eligible = Column(JSON)
    location_eligible = Column(JSON)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    title = Column(String, nullable=False)
    description = Column(Text)
    category = Column(String)  # energy, waste, transport, etc.
    priority = Column(String)  # high, medium, low
    estimated_savings = Column(Float)  # USD per year
    estimated_co2_reduction = Column(Float)  # tons CO2 per year
    implementation_cost = Column(Float)  # USD
    implementation_time = Column(String)  # "1 month", "3 months", etc.
    ai_confidence = Column(Float)  # 0.0 to 1.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    business = relationship("Business", back_populates="recommendations")

class EnergyBill(Base):
    __tablename__ = "energy_bills"
    
    id = Column(Integer, primary_key=True, index=True)
    business_id = Column(Integer, ForeignKey("businesses.id"))
    file_path = Column(String)
    original_filename = Column(String)
    extracted_text = Column(Text)
    parsed_data = Column(JSON)  # structured data from OCR
    upload_date = Column(DateTime(timezone=True), server_default=func.now())
    processing_status = Column(String, default="pending")  # pending, processed, failed