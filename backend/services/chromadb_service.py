# Simplified version for local development
try:
    import chromadb
    from chromadb.config import Settings
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False
    print("⚠️ ChromaDB not available - using mock implementations")

import os
from typing import List, Dict, Any

class ChromaDBService:
    def __init__(self, persist_directory: str = "./data/chromadb"):
        """Initialize ChromaDB client"""
        if not CHROMADB_AVAILABLE:
            print("⚠️ Using mock policy database")
            self.mock_policies = self._get_mock_policies()
            return
            
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)
        
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Create collections
        self.policies_collection = self.client.get_or_create_collection(
            name="sustainability_policies",
            metadata={"description": "Government sustainability policies and guidelines"}
        )
        
        self.guidelines_collection = self.client.get_or_create_collection(
            name="sustainability_guidelines",
            metadata={"description": "Best practices and implementation guidelines"}
        )
        
        # Initialize with mock data
        self._initialize_mock_data()
    
    def _initialize_mock_data(self):
        """Initialize ChromaDB with mock policy documents"""
        
        # Check if already initialized
        if self.policies_collection.count() > 0:
            return
        
        # Mock policy documents
        policy_documents = [
            {
                "id": "energy_efficiency_act_2024",
                "content": """
                The Energy Efficiency Improvement Act 2024 provides comprehensive guidelines for small and medium enterprises 
                to reduce energy consumption. Key provisions include:
                
                1. LED Lighting Incentives: Businesses can claim up to $10,000 in tax credits for LED upgrades
                2. HVAC System Modernization: 30% tax credit for ENERGY STAR certified heating and cooling systems
                3. Smart Energy Management: Rebates up to $5,000 for installing smart thermostats and energy monitoring systems
                4. Energy Audit Requirements: Mandatory energy audits for businesses consuming >500 kWh monthly
                5. Renewable Energy Targets: 15% renewable energy requirement for medium enterprises by 2025
                
                Eligibility criteria focus on businesses with annual revenue under $2M and fewer than 50 employees.
                The act prioritizes small businesses in manufacturing, retail, and food service sectors.
                """,
                "metadata": {
                    "title": "Energy Efficiency Improvement Act 2024",
                    "category": "energy",
                    "government_level": "federal",
                    "effective_date": "2024-01-01"
                }
            },
            {
                "id": "waste_reduction_program_2024",
                "content": """
                Municipal Waste Reduction Program 2024 establishes frameworks for business waste minimization:
                
                1. Recycling Mandates: Businesses must implement recycling programs for paper, plastic, and metal waste
                2. Organic Waste Diversion: Restaurants and food businesses must divert 75% of organic waste from landfills
                3. Packaging Reduction: Incentives for businesses reducing packaging waste by 25%
                4. Circular Economy Practices: Grants up to $15,000 for implementing circular economy principles
                5. Waste Audit Requirements: Annual waste audits for businesses generating >500kg waste monthly
                
                Special provisions exist for micro and small enterprises with simplified compliance requirements.
                Focus areas include retail, hospitality, and manufacturing sectors.
                """,
                "metadata": {
                    "title": "Municipal Waste Reduction Program 2024",
                    "category": "waste",
                    "government_level": "municipal",
                    "effective_date": "2024-03-01"
                }
            },
            {
                "id": "green_transportation_initiative",
                "content": """
                Green Transportation Initiative supports business fleet electrification and sustainable logistics:
                
                1. Electric Vehicle Incentives: Up to $25,000 tax credit per electric commercial vehicle
                2. Charging Infrastructure: 50% cost sharing for installing EV charging stations
                3. Fleet Optimization: Grants for implementing route optimization and fleet management systems
                4. Alternative Fuel Support: Incentives for biodiesel, hydrogen, and compressed natural gas vehicles
                5. Employee Commute Programs: Tax benefits for businesses promoting public transit and cycling
                
                Priority given to delivery services, logistics companies, and businesses with mobile operations.
                Special provisions for rural and underserved area businesses.
                """,
                "metadata": {
                    "title": "Green Transportation Initiative 2024",
                    "category": "transport",
                    "government_level": "state",
                    "effective_date": "2024-02-15"
                }
            },
            {
                "id": "carbon_offset_program",
                "content": """
                Business Carbon Offset and Credit Program enables SMEs to participate in carbon markets:
                
                1. Carbon Credit Generation: Verified emission reductions can generate tradeable credits
                2. Offset Project Funding: Grants up to $20,000 for reforestation and renewable energy projects
                3. Carbon Footprint Certification: Free carbon footprint assessment and certification for qualifying businesses
                4. Market Access: Facilitated access to voluntary carbon markets for credit trading
                5. Verification Standards: Streamlined verification process for small business carbon projects
                
                Focuses on businesses in agriculture, forestry, renewable energy, and energy efficiency sectors.
                Minimum project size requirements reduced for small and micro enterprises.
                """,
                "metadata": {
                    "title": "Business Carbon Offset and Credit Program",
                    "category": "carbon_offset",
                    "government_level": "federal",
                    "effective_date": "2024-01-15"
                }
            }
        ]
        
        # Best practices guidelines
        guideline_documents = [
            {
                "id": "energy_efficiency_best_practices",
                "content": """
                Energy Efficiency Best Practices for Small Businesses:
                
                1. Lighting Optimization: Replace incandescent bulbs with LED alternatives (75% energy savings)
                2. HVAC Management: Regular maintenance, programmable thermostats, proper insulation
                3. Equipment Upgrades: ENERGY STAR certified appliances and machinery
                4. Power Management: Implement automatic shutdown systems for equipment during off-hours
                5. Energy Monitoring: Install smart meters and energy management systems
                6. Employee Training: Educate staff on energy conservation practices
                7. Facility Design: Optimize workspace layout for natural lighting and ventilation
                
                Implementation timeline: Start with low-cost measures (lighting, training) before major investments.
                Expected ROI: Most measures pay back within 2-3 years through reduced energy bills.
                """,
                "metadata": {
                    "title": "Energy Efficiency Implementation Guide",
                    "category": "energy",
                    "implementation_difficulty": "medium"
                }
            },
            {
                "id": "waste_management_guide",
                "content": """
                Comprehensive Waste Management for MSMEs:
                
                1. Waste Stream Analysis: Identify and categorize all waste types (organic, recyclable, hazardous)
                2. Reduction Strategies: Minimize packaging, digitize documentation, optimize inventory
                3. Recycling Systems: Implement multi-stream recycling with proper labeling and training
                4. Composting Solutions: On-site composting for organic waste (restaurants, food services)
                5. Vendor Partnerships: Work with suppliers on take-back programs and sustainable packaging
                6. Staff Engagement: Regular training on waste reduction and proper sorting procedures
                7. Performance Tracking: Monitor waste volumes and diversion rates monthly
                
                Cost considerations: Initial setup costs typically recovered within 6-12 months through reduced disposal fees.
                """,
                "metadata": {
                    "title": "Waste Management Implementation Guide",
                    "category": "waste",
                    "implementation_difficulty": "low"
                }
            },
            {
                "id": "renewable_energy_transition",
                "content": """
                Renewable Energy Transition Roadmap for Small Businesses:
                
                1. Energy Assessment: Conduct comprehensive energy audit to understand current usage patterns
                2. Solar Feasibility: Evaluate roof space, orientation, and local solar incentives
                3. Financing Options: Explore leasing, power purchase agreements, and green loans
                4. Grid Integration: Understand net metering policies and grid connection requirements
                5. Backup Systems: Consider battery storage for energy resilience and peak shaving
                6. Gradual Implementation: Phase renewable installations based on energy usage and budget
                7. Maintenance Planning: Establish service agreements and monitoring systems
                
                Business benefits: Predictable energy costs, improved brand image, potential revenue from excess generation.
                Typical payback period: 5-8 years for solar installations, 3-5 years with incentives.
                """,
                "metadata": {
                    "title": "Renewable Energy Transition Guide",
                    "category": "renewable_energy",
                    "implementation_difficulty": "high"
                }
            }
        ]
        
        # Add documents to collections
        try:
            # Add policy documents
            self.policies_collection.add(
                documents=[doc["content"] for doc in policy_documents],
                metadatas=[doc["metadata"] for doc in policy_documents],
                ids=[doc["id"] for doc in policy_documents]
            )
            
            # Add guideline documents
            self.guidelines_collection.add(
                documents=[doc["content"] for doc in guideline_documents],
                metadatas=[doc["metadata"] for doc in guideline_documents],
                ids=[doc["id"] for doc in guideline_documents]
            )
            
            print("✅ ChromaDB initialized with mock policy and guideline documents")
            
        except Exception as e:
            print(f"❌ Error initializing ChromaDB: {e}")
    
    def search_policies(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        """Search for relevant policies based on query"""
        if not CHROMADB_AVAILABLE:
            # Return mock results
            return self.mock_policies[:n_results]
            
        try:
            results = self.policies_collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            return [
                {
                    "id": results["ids"][0][i],
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                }
                for i in range(len(results["ids"][0]))
            ]
            
        except Exception as e:
            print(f"Error searching policies: {e}")
            return []
    
    def search_guidelines(self, query: str, n_results: int = 3) -> List[Dict[str, Any]]:
        """Search for relevant implementation guidelines"""
        if not CHROMADB_AVAILABLE:
            # Return mock guidelines
            return [
                {
                    "id": "energy_best_practices",
                    "content": "LED lighting upgrades can reduce energy costs by 75%. Start with high-usage areas first.",
                    "metadata": {"title": "Energy Efficiency Guide", "category": "energy"}
                },
                {
                    "id": "waste_management_guide",
                    "content": "Implement 3-bin recycling system: paper, plastic/metal, organics. Train staff on proper sorting.",
                    "metadata": {"title": "Waste Management Guide", "category": "waste"}
                }
            ][:n_results]
            
        try:
            results = self.guidelines_collection.query(
                query_texts=[query],
                n_results=n_results
            )
            
            return [
                {
                    "id": results["ids"][0][i],
                    "content": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if "distances" in results else None
                }
                for i in range(len(results["ids"][0]))
            ]
            
        except Exception as e:
            print(f"Error searching guidelines: {e}")
            return []
    
    def get_contextual_recommendations(self, business_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Get policy and guideline recommendations based on business context"""
        
        # Create search queries based on business profile
        industry = business_profile.get("industry", "")
        size = business_profile.get("size", "")
        
        queries = [
            f"{industry} {size} business energy efficiency",
            f"{industry} waste management requirements",
            f"small business sustainability incentives {industry}",
            f"carbon reduction programs for {size} enterprises"
        ]
        
        all_policies = []
        all_guidelines = []
        
        for query in queries:
            policies = self.search_policies(query, n_results=2)
            guidelines = self.search_guidelines(query, n_results=2)
            
            all_policies.extend(policies)
            all_guidelines.extend(guidelines)
        
        # Remove duplicates
        unique_policies = {p["id"]: p for p in all_policies}.values()
        unique_guidelines = {g["id"]: g for g in all_guidelines}.values()
        
        return {
            "relevant_policies": list(unique_policies)[:3],
            "implementation_guidelines": list(unique_guidelines)[:3],
            "search_queries": queries
        }
    
    def _get_mock_policies(self):
        """Get mock policy data when ChromaDB is not available"""
        return [
            {
                "id": "energy_efficiency_act_2024",
                "content": "Small Business Energy Efficiency Grant - Up to $10,000 for LED lighting and HVAC upgrades",
                "metadata": {"title": "Energy Efficiency Act 2024", "category": "energy"}
            },
            {
                "id": "waste_reduction_program",
                "content": "Municipal Waste Reduction Program - Grants for recycling and composting initiatives",
                "metadata": {"title": "Waste Reduction Program", "category": "waste"}
            },
            {
                "id": "green_transport_initiative",
                "content": "Green Transportation Initiative - EV incentives and charging infrastructure support",
                "metadata": {"title": "Green Transportation Initiative", "category": "transport"}
            }
        ]