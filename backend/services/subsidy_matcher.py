from typing import List, Dict, Any
import json

class SubsidyMatchingService:
    def __init__(self):
        # Mock subsidy database - in production, this would come from the database
        self.subsidies_db = [
            {
                "id": 1,
                "name": "Small Business Energy Efficiency Grant",
                "description": "Federal grant providing up to $10,000 for energy efficiency improvements in small businesses",
                "amount_range": "$2,000 - $10,000",
                "government_agency": "Department of Energy",
                "category": "energy",
                "eligibility_criteria": {
                    "business_size": ["micro", "small"],
                    "annual_revenue_max": 500000,
                    "energy_usage_min": 500,
                    "location": ["nationwide"]
                },
                "application_deadline": "2024-12-31",
                "match_score_base": 80
            },
            {
                "id": 2,
                "name": "Green Technology Adoption Incentive",
                "description": "State-level incentive for adopting renewable energy solutions",
                "amount_range": "$5,000 - $25,000",
                "government_agency": "State Environmental Agency",
                "category": "renewable_energy",
                "eligibility_criteria": {
                    "business_size": ["small", "medium"],
                    "annual_revenue_max": 2000000,
                    "carbon_footprint_min": 20,
                    "location": ["california", "new_york", "texas"]
                },
                "application_deadline": "2024-11-30",
                "match_score_base": 75
            },
            {
                "id": 3,
                "name": "Waste Reduction Program",
                "description": "Municipal program supporting businesses in waste reduction initiatives",
                "amount_range": "$1,000 - $5,000",
                "government_agency": "Local Environmental Office",
                "category": "waste",
                "eligibility_criteria": {
                    "business_size": ["micro", "small", "medium"],
                    "industry": ["restaurant", "retail", "manufacturing"],
                    "waste_amount_min": 100
                },
                "application_deadline": "2024-10-15",
                "match_score_base": 70
            },
            {
                "id": 4,
                "name": "MSME Sustainability Fund",
                "description": "Comprehensive sustainability upgrade fund for MSMEs",
                "amount_range": "$3,000 - $15,000",
                "government_agency": "Small Business Administration",
                "category": "comprehensive",
                "eligibility_criteria": {
                    "business_size": ["micro", "small", "medium"],
                    "annual_revenue_max": 1000000,
                    "employees_max": 50,
                    "sustainability_rating": ["needs improvement", "below average"]
                },
                "application_deadline": "2025-01-31",
                "match_score_base": 85
            },
            {
                "id": 5,
                "name": "Carbon Offset Initiative",
                "description": "Program providing credits for verified carbon reduction activities",
                "amount_range": "$500 - $3,000",
                "government_agency": "Environmental Protection Agency",
                "category": "carbon_offset",
                "eligibility_criteria": {
                    "business_size": ["small", "medium"],
                    "carbon_footprint_min": 15,
                    "verification_required": True
                },
                "application_deadline": "2024-12-15",
                "match_score_base": 65
            }
        ]
    
    def find_matching_subsidies(self, business_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Find subsidies that match business profile"""
        matching_subsidies = []
        
        for subsidy in self.subsidies_db:
            match_score = self.calculate_match_score(subsidy, business_profile)
            if match_score >= 50:  # Threshold for recommendation
                subsidy_with_score = subsidy.copy()
                subsidy_with_score["match_score"] = match_score
                subsidy_with_score["eligibility_status"] = self.get_eligibility_status(match_score)
                matching_subsidies.append(subsidy_with_score)
        
        # Sort by match score (highest first)
        matching_subsidies.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matching_subsidies
    
    def calculate_match_score(self, subsidy: Dict[str, Any], business_profile: Dict[str, Any]) -> float:
        """Calculate how well a subsidy matches the business profile"""
        criteria = subsidy["eligibility_criteria"]
        score = subsidy["match_score_base"]
        
        # Check business size
        if "business_size" in criteria:
            if business_profile.get("size", "").lower() in [s.lower() for s in criteria["business_size"]]:
                score += 10
            else:
                score -= 20
        
        # Check annual revenue
        if "annual_revenue_max" in criteria:
            business_revenue = business_profile.get("annual_revenue", 0)
            if business_revenue <= criteria["annual_revenue_max"]:
                score += 15
            else:
                score -= 25
        
        # Check industry
        if "industry" in criteria:
            if business_profile.get("industry", "").lower() in [i.lower() for i in criteria["industry"]]:
                score += 20
            else:
                score -= 10
        
        # Check energy usage
        if "energy_usage_min" in criteria:
            business_usage = business_profile.get("monthly_energy_usage", 0)
            if business_usage >= criteria["energy_usage_min"]:
                score += 10
            else:
                score -= 15
        
        # Check carbon footprint
        if "carbon_footprint_min" in criteria:
            business_footprint = business_profile.get("annual_carbon_footprint", 0)
            if business_footprint >= criteria["carbon_footprint_min"]:
                score += 15
            else:
                score -= 10
        
        # Check employee count
        if "employees_max" in criteria:
            business_employees = business_profile.get("employees_count", 0)
            if business_employees <= criteria["employees_max"]:
                score += 5
            else:
                score -= 15
        
        # Check location (simplified - in production, would be more sophisticated)
        if "location" in criteria:
            business_location = business_profile.get("location", "").lower()
            if "nationwide" in [l.lower() for l in criteria["location"]] or \
               any(loc.lower() in business_location for loc in criteria["location"]):
                score += 10
            else:
                score -= 20
        
        # Check sustainability rating
        if "sustainability_rating" in criteria:
            business_rating = business_profile.get("sustainability_rating", "").lower()
            if business_rating in [r.lower() for r in criteria["sustainability_rating"]]:
                score += 20
        
        return max(0, min(100, score))  # Clamp between 0-100
    
    def get_eligibility_status(self, match_score: float) -> str:
        """Get eligibility status based on match score"""
        if match_score >= 80:
            return "Highly Eligible"
        elif match_score >= 65:
            return "Eligible"
        elif match_score >= 50:
            return "Potentially Eligible"
        else:
            return "Not Eligible"
    
    def get_application_priority(self, subsidies: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Prioritize subsidies by deadline and amount"""
        for subsidy in subsidies:
            # Simple priority scoring
            priority_score = subsidy["match_score"]
            
            # Boost score for higher amounts
            amount_range = subsidy["amount_range"]
            if "$10,000" in amount_range or "$15,000" in amount_range or "$25,000" in amount_range:
                priority_score += 10
            
            # Boost score for urgent deadlines (this is simplified)
            if "2024-10" in subsidy["application_deadline"]:
                priority_score += 15
            elif "2024-11" in subsidy["application_deadline"]:
                priority_score += 10
            
            subsidy["priority_score"] = priority_score
            
            if priority_score >= 90:
                subsidy["priority"] = "High"
            elif priority_score >= 75:
                subsidy["priority"] = "Medium"
            else:
                subsidy["priority"] = "Low"
        
        return subsidies