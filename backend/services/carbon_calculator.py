from typing import Dict, Any

class CarbonCalculatorService:
    def __init__(self):
        # Carbon emission factors (tons CO2 per unit)
        self.emission_factors = {
            "electricity_kwh": 0.000421,  # tons CO2 per kWh (US average)
            "natural_gas_therms": 0.00531,  # tons CO2 per therm
            "gasoline_liters": 0.00231,   # tons CO2 per liter
            "diesel_liters": 0.00267,     # tons CO2 per liter
            "waste_kg": 0.000001,         # tons CO2 per kg waste
        }
        
        # Industry-specific multipliers
        self.industry_multipliers = {
            "manufacturing": 1.3,
            "retail": 0.8,
            "restaurant": 1.1,
            "office": 0.7,
            "healthcare": 1.0,
            "education": 0.9,
            "technology": 0.6,
            "construction": 1.5,
            "agriculture": 1.2,
            "default": 1.0
        }
    
    def calculate_carbon_footprint(self, 
                                 energy_usage_kwh: float = 0,
                                 natural_gas_therms: float = 0,
                                 transport_fuel_liters: float = 0,
                                 waste_kg: float = 0,
                                 industry: str = "default",
                                 business_size: str = "small") -> Dict[str, Any]:
        """Calculate carbon footprint based on business inputs"""
        
        # Base emissions calculations
        energy_emissions = energy_usage_kwh * self.emission_factors["electricity_kwh"]
        gas_emissions = natural_gas_therms * self.emission_factors["natural_gas_therms"]
        transport_emissions = transport_fuel_liters * self.emission_factors["gasoline_liters"]
        waste_emissions = waste_kg * self.emission_factors["waste_kg"]
        
        # Apply industry multiplier
        industry_multiplier = self.industry_multipliers.get(industry.lower(), 1.0)
        
        # Apply business size multiplier
        size_multipliers = {
            "micro": 0.5,
            "small": 1.0,
            "medium": 1.8
        }
        size_multiplier = size_multipliers.get(business_size.lower(), 1.0)
        
        # Calculate total emissions
        base_total = energy_emissions + gas_emissions + transport_emissions + waste_emissions
        adjusted_total = base_total * industry_multiplier * size_multiplier
        
        # Monthly to annual conversion
        annual_total = adjusted_total * 12
        
        result = {
            "monthly_emissions": {
                "energy": round(energy_emissions, 3),
                "natural_gas": round(gas_emissions, 3),
                "transport": round(transport_emissions, 3),
                "waste": round(waste_emissions, 3),
                "total": round(adjusted_total, 3)
            },
            "annual_emissions": {
                "total": round(annual_total, 3)
            },
            "industry_multiplier": industry_multiplier,
            "size_multiplier": size_multiplier,
            "benchmark": self.get_industry_benchmark(industry, business_size),
            "rating": self.get_sustainability_rating(annual_total, industry, business_size)
        }
        
        return result
    
    def get_industry_benchmark(self, industry: str, business_size: str) -> Dict[str, float]:
        """Get industry benchmark data for comparison"""
        # Mock benchmark data
        base_benchmarks = {
            "manufacturing": {"micro": 15, "small": 45, "medium": 120},
            "retail": {"micro": 8, "small": 25, "medium": 70},
            "restaurant": {"micro": 12, "small": 35, "medium": 95},
            "office": {"micro": 6, "small": 18, "medium": 50},
            "technology": {"micro": 4, "small": 15, "medium": 40},
            "default": {"micro": 10, "small": 30, "medium": 80}
        }
        
        industry_data = base_benchmarks.get(industry.lower(), base_benchmarks["default"])
        benchmark = industry_data.get(business_size.lower(), industry_data["small"])
        
        return {
            "industry_average": benchmark,
            "percentile_25": benchmark * 0.7,
            "percentile_75": benchmark * 1.3,
            "best_in_class": benchmark * 0.4
        }
    
    def get_sustainability_rating(self, annual_emissions: float, industry: str, business_size: str) -> str:
        """Determine sustainability rating based on emissions vs benchmark"""
        benchmark = self.get_industry_benchmark(industry, business_size)
        industry_avg = benchmark["industry_average"]
        
        if annual_emissions <= benchmark["best_in_class"]:
            return "Excellent"
        elif annual_emissions <= benchmark["percentile_25"]:
            return "Good"
        elif annual_emissions <= industry_avg:
            return "Average"
        elif annual_emissions <= benchmark["percentile_75"]:
            return "Below Average"
        else:
            return "Needs Improvement"