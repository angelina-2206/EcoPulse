from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
from datetime import datetime

from ..models import get_db, Business, EnergyBill
from ..models.schemas import BillUploadResponse, BusinessCreate, BusinessResponse
from ..services.bill_processing import BillProcessingService
from ..services.huggingface_service import huggingface_service

router = APIRouter(prefix="/api/ingest", tags=["Bill Processing"])
bill_service = BillProcessingService()

@router.post("/upload-bill", response_model=BillUploadResponse)
async def upload_energy_bill(
    file: UploadFile = File(...),
    business_id: int = None,
    db: Session = Depends(get_db)
):
    """Upload and process energy bill"""
    try:
        # Validate file type
        if not file.content_type.startswith(('image/', 'application/pdf')):
            raise HTTPException(status_code=400, detail="Only image and PDF files are supported")
        
        # Create upload directory
        upload_dir = "data/uploads"
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save uploaded file
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Extract text from image
        if file.content_type.startswith('image/'):
            extracted_text = bill_service.extract_text_from_image(file_path)
        else:
            # For PDF files, we'll use a simplified approach for the MVP
            extracted_text = "PDF processing not implemented in MVP - using mock data"
        
        # Parse extracted text
        parsed_data = bill_service.parse_energy_bill(extracted_text)
        
        # Enhanced AI processing
        ai_insights = huggingface_service.process_bill_text(extracted_text)
        parsed_data["ai_insights"] = ai_insights
        
        # Save to database
        energy_bill = EnergyBill(
            business_id=business_id,
            file_path=file_path,
            original_filename=file.filename,
            extracted_text=extracted_text,
            parsed_data=parsed_data,
            processing_status="processed"
        )
        
        db.add(energy_bill)
        db.commit()
        db.refresh(energy_bill)
        
        return BillUploadResponse(
            id=energy_bill.id,
            filename=file.filename,
            extracted_text=extracted_text,
            parsed_data=parsed_data,
            processing_status="processed"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing bill: {str(e)}")

@router.get("/bills/{business_id}")
async def get_business_bills(business_id: int, db: Session = Depends(get_db)):
    """Get all bills for a business"""
    bills = db.query(EnergyBill).filter(EnergyBill.business_id == business_id).all()
    return bills

@router.post("/manual-entry")
async def manual_bill_entry(
    business_id: int,
    energy_usage_kwh: float,
    cost_amount: float,
    billing_period: str,
    db: Session = Depends(get_db)
):
    """Manually enter bill data instead of uploading"""
    try:
        parsed_data = {
            "energy_usage_kwh": energy_usage_kwh,
            "cost_amount": cost_amount,
            "billing_period": billing_period,
            "currency": "USD",
            "confidence": 1.0,
            "source": "manual_entry"
        }
        
        energy_bill = EnergyBill(
            business_id=business_id,
            file_path=None,
            original_filename="Manual Entry",
            extracted_text=f"Manual entry: {energy_usage_kwh} kWh, ${cost_amount}, {billing_period}",
            parsed_data=parsed_data,
            processing_status="processed"
        )
        
        db.add(energy_bill)
        db.commit()
        db.refresh(energy_bill)
        
        return BillUploadResponse(
            id=energy_bill.id,
            filename="Manual Entry",
            extracted_text=energy_bill.extracted_text,
            parsed_data=parsed_data,
            processing_status="processed"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving manual entry: {str(e)}")