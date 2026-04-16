#!/usr/bin/env python3

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

def test_core_services():
    print("🧪 Testing EcoPulse Core Services...")
    
    try:
        # Test carbon calculator
        from backend.services.carbon_calculator import CarbonCalculatorService
        carbon_service = CarbonCalculatorService()
        result = carbon_service.calculate_carbon_footprint(850, industry='technology', business_size='small')
        print(f"✅ Carbon calculation: {result['annual_emissions']['total']:.2f} tons CO2/year")
        
        # Test AI recommendations
        from backend.services.ai_recommendations import AIRecommendationService
        ai_service = AIRecommendationService()
        
        business_profile = {
            "industry": "technology",
            "size": "small",
            "location": "San Francisco, CA",
            "annual_revenue": 750000,
            "employees_count": 15
        }
        
        recommendations = ai_service.generate_recommendations(business_profile, result)
        print(f"✅ Generated {len(recommendations)} AI recommendations")
        
        # Test subsidy matching
        from backend.services.subsidy_matcher import SubsidyMatchingService
        subsidy_service = SubsidyMatchingService()
        subsidies = subsidy_service.find_matching_subsidies(business_profile)
        print(f"✅ Found {len(subsidies)} matching subsidies")
        
        print("\n🎉 All core services working perfectly!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_core_services()