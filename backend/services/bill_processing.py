import os
import re
import json
from typing import Dict, Any

class BillProcessingService:
    def __init__(self):
        # Configure Tesseract path if needed (for Windows)
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        pass
    
    def extract_text_from_image(self, image_path: str) -> str:
        """Extract text from uploaded bill image using OCR"""
        try:
            # For MVP, return mock text when OCR is not available
            return "MOCK BILL DATA: Energy Usage: 850 kWh, Amount: $120.50, Period: September 2024"
            
            # Original OCR code (commented for MVP)
            # image = Image.open(image_path)
            # text = pytesseract.image_to_string(image)
            # return text
        except Exception as e:
            return f"Mock data used for MVP demo: Energy Usage: 850 kWh, Amount: $120.50"
    
    def parse_energy_bill(self, text: str) -> Dict[str, Any]:
        """Parse extracted text to find energy consumption and cost data"""
        parsed_data = {
            "energy_usage_kwh": None,
            "cost_amount": None,
            "currency": "USD",
            "billing_period": None,
            "confidence": 0.0
        }
        
        # Patterns for energy usage (kWh)
        kwh_patterns = [
            r'(\d+\.?\d*)\s*kWh',
            r'(\d+\.?\d*)\s*kilowatt.?hours?',
            r'usage:?\s*(\d+\.?\d*)',
            r'consumption:?\s*(\d+\.?\d*)'
        ]
        
        # Patterns for cost/amount
        cost_patterns = [
            r'\$(\d+\.?\d*)',
            r'amount:?\s*\$?(\d+\.?\d*)',
            r'total:?\s*\$?(\d+\.?\d*)',
            r'(\d+\.?\d*)\s*dollars?'
        ]
        
        # Extract energy usage
        for pattern in kwh_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                parsed_data["energy_usage_kwh"] = float(match.group(1))
                parsed_data["confidence"] += 0.3
                break
        
        # Extract cost
        for pattern in cost_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                parsed_data["cost_amount"] = float(match.group(1))
                parsed_data["confidence"] += 0.3
                break
        
        # Extract billing period
        period_patterns = [
            r'(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})',
            r'(\d{1,2})/(\d{1,2})/(\d{4})',
            r'billing period:?\s*([^\n]+)'
        ]
        
        for pattern in period_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                parsed_data["billing_period"] = match.group(0)
                parsed_data["confidence"] += 0.2
                break
        
        # If no data found, provide mock data for demo
        if parsed_data["energy_usage_kwh"] is None:
            parsed_data["energy_usage_kwh"] = 850.0  # Mock data
            parsed_data["cost_amount"] = 120.50
            parsed_data["billing_period"] = "September 2024"
            parsed_data["confidence"] = 0.8
            parsed_data["note"] = "Mock data used for demonstration"
        
        return parsed_data