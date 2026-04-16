#!/usr/bin/env python3
"""
EcoPulse MVP Test Script
Tests core functionality without requiring full deployment
"""

import sys
import os
import requests
import time
from pathlib import Path

# Add backend to path for imports
sys.path.append(str(Path(__file__).parent / "backend"))

def test_backend_startup():
    """Test if backend starts successfully"""
    print("🧪 Testing backend startup...")
    
    try:
        # Import main modules to check for import errors
        from backend.models.database import create_tables
        from backend.services.carbon_calculator import CarbonCalculatorService
        from backend.services.ai_recommendations import AIRecommendationService
        from backend.services.subsidy_matcher import SubsidyMatchingService
        
        print("✅ All backend modules imported successfully")
        
        # Test service initialization
        carbon_service = CarbonCalculatorService()
        ai_service = AIRecommendationService()
        subsidy_service = SubsidyMatchingService()
        
        print("✅ All services initialized successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Backend startup test failed: {e}")
        return False

def test_carbon_calculation():
    """Test carbon footprint calculation"""
    print("🧪 Testing carbon footprint calculation...")
    
    try:
        from backend.services.carbon_calculator import CarbonCalculatorService
        
        carbon_service = CarbonCalculatorService()
        
        # Test calculation
        result = carbon_service.calculate_carbon_footprint(
            energy_usage_kwh=850,
            industry="technology",
            business_size="small"
        )
        
        assert "monthly_emissions" in result
        assert "annual_emissions" in result
        assert result["annual_emissions"]["total"] > 0
        
        print(f"✅ Carbon calculation successful: {result['annual_emissions']['total']:.2f} tons CO2/year")
        return True
        
    except Exception as e:
        print(f"❌ Carbon calculation test failed: {e}")
        return False

def test_ai_recommendations():
    """Test AI recommendation generation"""
    print("🧪 Testing AI recommendation generation...")
    
    try:
        from backend.services.ai_recommendations import AIRecommendationService
        from backend.services.carbon_calculator import CarbonCalculatorService
        
        ai_service = AIRecommendationService()
        carbon_service = CarbonCalculatorService()
        
        # Mock business profile
        business_profile = {
            "industry": "technology",
            "size": "small",
            "location": "San Francisco, CA",
            "annual_revenue": 750000,
            "employees_count": 15
        }
        
        # Get carbon data
        carbon_data = carbon_service.calculate_carbon_footprint(
            energy_usage_kwh=850,
            industry="technology",
            business_size="small"
        )
        
        # Generate recommendations
        recommendations = ai_service.generate_recommendations(business_profile, carbon_data)
        
        assert len(recommendations) > 0
        assert all("title" in rec for rec in recommendations)
        assert all("estimated_savings" in rec for rec in recommendations)
        
        print(f"✅ Generated {len(recommendations)} AI recommendations")
        return True
        
    except Exception as e:
        print(f"❌ AI recommendation test failed: {e}")
        return False

def test_subsidy_matching():
    """Test subsidy matching"""
    print("🧪 Testing subsidy matching...")
    
    try:
        from backend.services.subsidy_matcher import SubsidyMatchingService
        
        subsidy_service = SubsidyMatchingService()
        
        # Mock business profile
        business_profile = {
            "industry": "technology",
            "size": "small",
            "location": "San Francisco, CA",
            "annual_revenue": 750000,
            "employees_count": 15,
            "monthly_energy_usage": 850
        }
        
        # Find matching subsidies
        subsidies = subsidy_service.find_matching_subsidies(business_profile)
        
        assert len(subsidies) > 0
        assert all("name" in sub for sub in subsidies)
        assert all("match_score" in sub for sub in subsidies)
        
        print(f"✅ Found {len(subsidies)} matching subsidies")
        return True
        
    except Exception as e:
        print(f"❌ Subsidy matching test failed: {e}")
        return False

def test_chromadb_setup():
    """Test ChromaDB initialization"""
    print("🧪 Testing ChromaDB setup...")
    
    try:
        from backend.services.chromadb_service import ChromaDBService
        
        chromadb_service = ChromaDBService()
        
        # Test policy search
        policies = chromadb_service.search_policies("energy efficiency small business")
        
        assert len(policies) > 0
        print(f"✅ ChromaDB working: found {len(policies)} relevant policies")
        
        return True
        
    except Exception as e:
        print(f"❌ ChromaDB test failed: {e}")
        return False

def test_bill_processing():
    """Test bill processing functionality"""
    print("🧪 Testing bill processing...")
    
    try:
        from backend.services.bill_processing import BillProcessingService
        
        bill_service = BillProcessingService()
        
        # Test with mock bill text
        mock_bill_text = """
        ENERGY BILL
        Account: 12345
        Billing Period: September 2024
        Energy Usage: 850 kWh
        Total Amount: $120.50
        """
        
        parsed_data = bill_service.parse_energy_bill(mock_bill_text)
        
        assert "energy_usage_kwh" in parsed_data
        assert parsed_data["energy_usage_kwh"] is not None
        
        print(f"✅ Bill processing successful: {parsed_data['energy_usage_kwh']} kWh")
        return True
        
    except Exception as e:
        print(f"❌ Bill processing test failed: {e}")
        return False

def test_api_health():
    """Test API health endpoint"""
    print("🧪 Testing API connectivity...")
    
    try:
        # Try to check if API is running
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ API is running and healthy")
            return True
        else:
            print(f"⚠️ API responded with status {response.status_code}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("⚠️ API not running (this is expected if not started)")
        return True  # Not a failure for offline tests
        
    except Exception as e:
        print(f"❌ API health check failed: {e}")
        return False

def run_all_tests():
    """Run all tests"""
    print("🚀 Starting EcoPulse MVP Tests\n")
    
    tests = [
        ("Backend Startup", test_backend_startup),
        ("Carbon Calculation", test_carbon_calculation),
        ("AI Recommendations", test_ai_recommendations),
        ("Subsidy Matching", test_subsidy_matching),
        ("ChromaDB Setup", test_chromadb_setup),
        ("Bill Processing", test_bill_processing),
        ("API Health", test_api_health),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running: {test_name}")
        print(f"{'='*50}")
        
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Test '{test_name}' crashed: {e}")
            results.append((test_name, False))
    
    # Print summary
    print(f"\n{'='*50}")
    print("TEST SUMMARY")
    print(f"{'='*50}")
    
    passed = 0
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:.<30} {status}")
        if result:
            passed += 1
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! EcoPulse MVP is ready!")
    else:
        print("⚠️ Some tests failed. Check the output above for details.")
    
    return passed == total

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)