from typing import List, Dict, Any
import random

class AIRecommendationService:
    def __init__(self):
        # Rule-based recommendations database
        self.recommendations_db = {
            "energy": [
                {
                    "title": "Switch to LED Lighting",
                    "description": "Replace all traditional incandescent and fluorescent bulbs with LED alternatives. LEDs use 75% less energy and last 25 times longer.",
                    "estimated_savings": 1200,
                    "estimated_co2_reduction": 0.8,
                    "implementation_cost": 500,
                    "implementation_time": "1 week",
                    "priority": "high",
                    "applicability": ["all"]
                },
                {
                    "title": "Install Smart Thermostats",
                    "description": "Programmable thermostats can reduce heating and cooling costs by 10-15% through optimized temperature control.",
                    "estimated_savings": 800,
                    "estimated_co2_reduction": 1.2,
                    "implementation_cost": 300,
                    "implementation_time": "2 days",
                    "priority": "high",
                    "applicability": ["office", "retail", "restaurant"]
                },
                {
                    "title": "Energy-Efficient Equipment Upgrade",
                    "description": "Replace old equipment with ENERGY STAR certified alternatives to reduce power consumption by 20-30%.",
                    "estimated_savings": 2500,
                    "estimated_co2_reduction": 2.1,
                    "implementation_cost": 5000,
                    "implementation_time": "1 month",
                    "priority": "medium",
                    "applicability": ["manufacturing", "restaurant", "office"]
                },
                {
                    "title": "Install Motion Sensors",
                    "description": "Automatic lighting controls can reduce lighting energy use by 30% in areas with variable occupancy.",
                    "estimated_savings": 600,
                    "estimated_co2_reduction": 0.5,
                    "implementation_cost": 200,
                    "implementation_time": "3 days",
                    "priority": "medium",
                    "applicability": ["office", "retail", "manufacturing"]
                }
            ],
            "renewable": [
                {
                    "title": "Solar Panel Installation",
                    "description": "Install rooftop solar panels to generate clean energy and reduce grid dependency. Typical payback period is 6-8 years.",
                    "estimated_savings": 3000,
                    "estimated_co2_reduction": 4.5,
                    "implementation_cost": 15000,
                    "implementation_time": "2 months",
                    "priority": "high",
                    "applicability": ["all"]
                },
                {
                    "title": "Solar Water Heating",
                    "description": "Solar water heating systems can reduce water heating costs by 50-80% in suitable climates.",
                    "estimated_savings": 800,
                    "estimated_co2_reduction": 1.8,
                    "implementation_cost": 3000,
                    "implementation_time": "1 week",
                    "priority": "medium",
                    "applicability": ["restaurant", "healthcare", "manufacturing"]
                }
            ],
            "waste": [
                {
                    "title": "Implement Recycling Program",
                    "description": "Set up comprehensive recycling for paper, plastic, metal, and organic waste. Can reduce waste disposal costs by 40%.",
                    "estimated_savings": 500,
                    "estimated_co2_reduction": 0.3,
                    "implementation_cost": 100,
                    "implementation_time": "1 week",
                    "priority": "high",
                    "applicability": ["all"]
                },
                {
                    "title": "Composting System",
                    "description": "Implement on-site composting for organic waste. Reduces waste disposal costs and creates useful compost.",
                    "estimated_savings": 300,
                    "estimated_co2_reduction": 0.6,
                    "implementation_cost": 200,
                    "implementation_time": "2 weeks",
                    "priority": "medium",
                    "applicability": ["restaurant", "agriculture"]
                },
                {
                    "title": "Digital Documentation",
                    "description": "Go paperless with digital receipts, invoices, and documentation. Reduce paper consumption by 80%.",
                    "estimated_savings": 400,
                    "estimated_co2_reduction": 0.2,
                    "implementation_cost": 150,
                    "implementation_time": "1 month",
                    "priority": "medium",
                    "applicability": ["office", "retail", "healthcare"]
                }
            ],
            "transport": [
                {
                    "title": "Electric Vehicle Fleet",
                    "description": "Transition delivery vehicles to electric alternatives. Reduce fuel costs and emissions significantly.",
                    "estimated_savings": 2000,
                    "estimated_co2_reduction": 3.2,
                    "implementation_cost": 25000,
                    "implementation_time": "3 months",
                    "priority": "medium",
                    "applicability": ["retail", "restaurant", "manufacturing"]
                },
                {
                    "title": "Remote Work Policy",
                    "description": "Implement hybrid remote work to reduce commuting emissions and office energy consumption.",
                    "estimated_savings": 1500,
                    "estimated_co2_reduction": 2.8,
                    "implementation_cost": 500,
                    "implementation_time": "2 weeks",
                    "priority": "high",
                    "applicability": ["office", "technology"]
                }
            ],
            "operations": [
                {
                    "title": "Energy Audit",
                    "description": "Conduct a professional energy audit to identify specific inefficiencies and prioritize improvements.",
                    "estimated_savings": 0,
                    "estimated_co2_reduction": 0,
                    "implementation_cost": 800,
                    "implementation_time": "1 week",
                    "priority": "high",
                    "applicability": ["all"]
                },
                {
                    "title": "Employee Training Program",
                    "description": "Train staff on energy conservation practices and sustainability awareness to change daily behaviors.",
                    "estimated_savings": 800,
                    "estimated_co2_reduction": 0.5,
                    "implementation_cost": 200,
                    "implementation_time": "2 weeks",
                    "priority": "medium",
                    "applicability": ["all"]
                }
            ]
        }
    
    def generate_recommendations(self, business_profile: Dict[str, Any], carbon_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate personalized recommendations based on business profile and carbon footprint"""
        
        industry = business_profile.get("industry", "office").lower()
        business_size = business_profile.get("size", "small").lower()
        annual_emissions = carbon_data.get("annual_emissions", {}).get("total", 0)
        sustainability_rating = carbon_data.get("rating", "average").lower()
        
        recommendations = []
        
        # Priority recommendations based on carbon footprint
        if annual_emissions > 50:  # High emissions
            recommendations.extend(self._get_high_impact_recommendations(industry))
        elif annual_emissions > 20:  # Medium emissions
            recommendations.extend(self._get_medium_impact_recommendations(industry))
        else:  # Low emissions
            recommendations.extend(self._get_optimization_recommendations(industry))
        
        # Add size-specific recommendations
        if business_size == "micro":
            recommendations.extend(self._get_micro_business_recommendations(industry))
        elif business_size == "medium":
            recommendations.extend(self._get_medium_business_recommendations(industry))
        
        # Add industry-specific recommendations
        recommendations.extend(self._get_industry_specific_recommendations(industry))
        
        # Filter and prioritize
        filtered_recommendations = self._filter_recommendations(recommendations, industry)
        prioritized_recommendations = self._prioritize_recommendations(filtered_recommendations, business_profile, carbon_data)
        
        # Limit to top 5 recommendations
        return prioritized_recommendations[:5]
    
    def _get_high_impact_recommendations(self, industry: str) -> List[Dict[str, Any]]:
        """Get recommendations for high-emission businesses"""
        return [
            self.recommendations_db["energy"][0],  # LED Lighting
            self.recommendations_db["energy"][1],  # Smart Thermostats
            self.recommendations_db["renewable"][0],  # Solar Panels
            self.recommendations_db["operations"][0],  # Energy Audit
        ]
    
    def _get_medium_impact_recommendations(self, industry: str) -> List[Dict[str, Any]]:
        """Get recommendations for medium-emission businesses"""
        return [
            self.recommendations_db["energy"][0],  # LED Lighting
            self.recommendations_db["energy"][3],  # Motion Sensors
            self.recommendations_db["waste"][0],   # Recycling
            self.recommendations_db["operations"][1],  # Training
        ]
    
    def _get_optimization_recommendations(self, industry: str) -> List[Dict[str, Any]]:
        """Get recommendations for low-emission businesses (optimization focus)"""
        return [
            self.recommendations_db["waste"][2],   # Digital Documentation
            self.recommendations_db["transport"][1],  # Remote Work
            self.recommendations_db["renewable"][1],  # Solar Water Heating
        ]
    
    def _get_micro_business_recommendations(self, industry: str) -> List[Dict[str, Any]]:
        """Get recommendations suitable for micro businesses"""
        return [
            self.recommendations_db["energy"][0],  # LED Lighting
            self.recommendations_db["waste"][0],   # Recycling
            self.recommendations_db["waste"][2],   # Digital Documentation
        ]
    
    def _get_medium_business_recommendations(self, industry: str) -> List[Dict[str, Any]]:
        """Get recommendations suitable for medium businesses"""
        return [
            self.recommendations_db["renewable"][0],  # Solar Panels
            self.recommendations_db["energy"][2],     # Equipment Upgrade
            self.recommendations_db["transport"][0],  # Electric Vehicles
        ]
    
    def _get_industry_specific_recommendations(self, industry: str) -> List[Dict[str, Any]]:
        """Get industry-specific recommendations"""
        industry_recommendations = []
        
        if industry in ["restaurant", "healthcare"]:
            industry_recommendations.append(self.recommendations_db["renewable"][1])  # Solar Water Heating
            industry_recommendations.append(self.recommendations_db["waste"][1])     # Composting
        
        elif industry == "manufacturing":
            industry_recommendations.append(self.recommendations_db["energy"][2])    # Equipment Upgrade
            industry_recommendations.append(self.recommendations_db["transport"][0]) # Electric Vehicles
        
        elif industry in ["office", "technology"]:
            industry_recommendations.append(self.recommendations_db["transport"][1]) # Remote Work
            industry_recommendations.append(self.recommendations_db["waste"][2])     # Digital Documentation
        
        return industry_recommendations
    
    def _filter_recommendations(self, recommendations: List[Dict[str, Any]], industry: str) -> List[Dict[str, Any]]:
        """Filter recommendations based on applicability"""
        filtered = []
        seen_titles = set()
        
        for rec in recommendations:
            if rec["title"] not in seen_titles:
                if "all" in rec["applicability"] or industry in rec["applicability"]:
                    filtered.append(rec)
                    seen_titles.add(rec["title"])
        
        return filtered
    
    def _prioritize_recommendations(self, recommendations: List[Dict[str, Any]], 
                                  business_profile: Dict[str, Any], 
                                  carbon_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Prioritize recommendations and add AI confidence scores"""
        
        for rec in recommendations:
            # Calculate AI confidence based on various factors
            confidence = 0.7  # Base confidence
            
            # Adjust based on business size and implementation cost
            business_size = business_profile.get("size", "small")
            annual_revenue = business_profile.get("annual_revenue", 500000)
            
            cost_to_revenue_ratio = rec["implementation_cost"] / annual_revenue if annual_revenue > 0 else 1
            
            if cost_to_revenue_ratio < 0.01:  # Less than 1% of revenue
                confidence += 0.2
            elif cost_to_revenue_ratio > 0.05:  # More than 5% of revenue
                confidence -= 0.1
            
            # Adjust based on payback period
            if rec["estimated_savings"] > 0:
                payback_years = rec["implementation_cost"] / rec["estimated_savings"]
                if payback_years < 2:
                    confidence += 0.15
                elif payback_years > 5:
                    confidence -= 0.1
            
            # Adjust based on priority
            if rec["priority"] == "high":
                confidence += 0.1
            
            rec["ai_confidence"] = min(0.95, max(0.5, confidence))
        
        # Sort by priority and AI confidence
        priority_order = {"high": 3, "medium": 2, "low": 1}
        recommendations.sort(key=lambda x: (
            priority_order.get(x["priority"], 0),
            x["ai_confidence"],
            -x["implementation_cost"]  # Prefer lower cost if all else equal
        ), reverse=True)
        
        return recommendations