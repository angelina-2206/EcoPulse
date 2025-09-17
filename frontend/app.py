import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, Any, List
import json
import time

# Configuration
API_BASE_URL = "http://localhost:8000/api"

# Check backend connection
def check_backend_connection():
    """Check if backend is available"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=2)
        return response.status_code == 200
    except:
        return False

# Page configuration
st.set_page_config(
    page_title="EcoPulse - MSME Sustainability Advisor",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        text-align: center;
        color: #2E8B57;
        font-size: 2.5em;
        margin-bottom: 0.5em;
    }
    .metric-card {
        background-color: #f0f8f0;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #2E8B57;
        margin: 0.5rem 0;
    }
    .recommendation-card {
        background-color: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid #dee2e6;
        margin: 0.5rem 0;
    }
    .subsidy-card {
        background-color: #fff3cd;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #ffc107;
        margin: 0.5rem 0;
    }
</style>
""", unsafe_allow_html=True)

def init_session_state():
    """Initialize session state variables"""
    if "business_id" not in st.session_state:
        st.session_state.business_id = None
    if "business_data" not in st.session_state:
        st.session_state.business_data = None
    if "carbon_footprint" not in st.session_state:
        st.session_state.carbon_footprint = None
    if "action_plan" not in st.session_state:
        st.session_state.action_plan = None

def register_business(business_data: Dict[str, Any]) -> int:
    """Register a new business"""
    try:
        response = requests.post(f"{API_BASE_URL}/business/register", json=business_data, timeout=10)
        if response.status_code == 200:
            return response.json()["id"]
        else:
            st.error(f"Error registering business: {response.text}")
            return None
    except requests.exceptions.ConnectionError:
        st.error("❌ Cannot connect to backend. Please ensure the backend is running on port 8000.")
        st.info("💡 To start backend: cd backend && python -m uvicorn main:app --reload")
        return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def calculate_carbon_footprint(business_id: int, energy_usage: float, transport_fuel: float = 0, waste_amount: float = 0) -> Dict[str, Any]:
    """Calculate carbon footprint"""
    try:
        data = {
            "business_id": business_id,
            "energy_usage": energy_usage,
            "transport_fuel": transport_fuel,
            "waste_amount": waste_amount
        }
        response = requests.post(f"{API_BASE_URL}/carbon/calculate", json=data)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error calculating carbon footprint: {response.text}")
            return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def get_detailed_carbon_analysis(business_id: int) -> Dict[str, Any]:
    """Get detailed carbon analysis"""
    try:
        response = requests.get(f"{API_BASE_URL}/carbon/detailed/{business_id}")
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def generate_action_plan(business_id: int) -> Dict[str, Any]:
    """Generate comprehensive action plan"""
    try:
        data = {
            "business_id": business_id,
            "industry": st.session_state.business_data["industry"],
            "business_size": st.session_state.business_data["size"]
        }
        response = requests.post(f"{API_BASE_URL}/recommend/action-plan", json=data)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error generating action plan: {response.text}")
            return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def upload_bill(business_id: int, file) -> Dict[str, Any]:
    """Upload and process energy bill"""
    try:
        files = {"file": file}
        data = {"business_id": business_id}
        response = requests.post(f"{API_BASE_URL}/ingest/upload-bill", files=files, data=data)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error uploading bill: {response.text}")
            return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def manual_bill_entry(business_id: int, energy_usage: float, cost: float, period: str) -> Dict[str, Any]:
    """Manual bill entry"""
    try:
        data = {
            "business_id": business_id,
            "energy_usage_kwh": energy_usage,
            "cost_amount": cost,
            "billing_period": period
        }
        response = requests.post(f"{API_BASE_URL}/ingest/manual-entry", params=data)
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"Error saving manual entry: {response.text}")
            return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def business_registration_form():
    """Business registration form"""
    st.markdown('<h2 class="main-header">🏢 Register Your Business</h2>', unsafe_allow_html=True)
    
    with st.form("business_registration"):
        col1, col2 = st.columns(2)
        
        with col1:
            name = st.text_input("Business Name*", placeholder="e.g., Green Tech Solutions")
            industry = st.selectbox("Industry*", [
                "technology", "manufacturing", "retail", "restaurant", 
                "office", "healthcare", "education", "construction", 
                "agriculture", "other"
            ])
            size = st.selectbox("Business Size*", ["micro", "small", "medium"])
            location = st.text_input("Location*", placeholder="e.g., San Francisco, CA")
        
        with col2:
            monthly_energy_usage = st.number_input("Monthly Energy Usage (kWh)", min_value=0.0, value=850.0)
            monthly_energy_cost = st.number_input("Monthly Energy Cost ($)", min_value=0.0, value=120.50)
            employees_count = st.number_input("Number of Employees", min_value=1, value=15)
            annual_revenue = st.number_input("Annual Revenue ($)", min_value=0.0, value=750000.0)
        
        submitted = st.form_submit_button("Register Business", type="primary")
        
        if submitted and name and industry and size and location:
            business_data = {
                "name": name,
                "industry": industry,
                "size": size,
                "location": location,
                "monthly_energy_usage": monthly_energy_usage,
                "monthly_energy_cost": monthly_energy_cost,
                "employees_count": employees_count,
                "annual_revenue": annual_revenue
            }
            
            business_id = register_business(business_data)
            if business_id:
                st.session_state.business_id = business_id
                st.session_state.business_data = business_data
                st.success(f"✅ Business registered successfully! ID: {business_id}")
                st.rerun()
        elif submitted:
            st.error("Please fill in all required fields marked with *")

def energy_bill_processing():
    """Energy bill upload and processing"""
    st.markdown('<h3>📄 Energy Bill Processing</h3>', unsafe_allow_html=True)
    
    tab1, tab2 = st.tabs(["📤 Upload Bill", "✏️ Manual Entry"])
    
    with tab1:
        st.markdown("Upload an image of your energy bill for automatic processing:")
        uploaded_file = st.file_uploader(
            "Choose a file", 
            type=['png', 'jpg', 'jpeg', 'pdf'],
            help="Supported formats: PNG, JPG, JPEG, PDF"
        )
        
        if uploaded_file is not None:
            if st.button("Process Bill", type="primary"):
                with st.spinner("Processing bill..."):
                    result = upload_bill(st.session_state.business_id, uploaded_file)
                    if result:
                        st.success("✅ Bill processed successfully!")
                        
                        col1, col2 = st.columns(2)
                        with col1:
                            st.metric("Energy Usage", f"{result['parsed_data'].get('energy_usage_kwh', 0)} kWh")
                        with col2:
                            st.metric("Cost", f"${result['parsed_data'].get('cost_amount', 0)}")
                        
                        st.text_area("Extracted Text", result["extracted_text"], height=150)
    
    with tab2:
        st.markdown("Enter your bill details manually:")
        with st.form("manual_bill_entry"):
            col1, col2, col3 = st.columns(3)
            with col1:
                energy_usage = st.number_input("Energy Usage (kWh)", min_value=0.0, value=850.0)
            with col2:
                cost = st.number_input("Bill Amount ($)", min_value=0.0, value=120.50)
            with col3:
                period = st.text_input("Billing Period", value="September 2024")
            
            if st.form_submit_button("Save Entry", type="primary"):
                result = manual_bill_entry(st.session_state.business_id, energy_usage, cost, period)
                if result:
                    st.success("✅ Bill entry saved successfully!")

def carbon_footprint_section():
    """Carbon footprint calculation and display"""
    st.markdown('<h3>🌍 Carbon Footprint Calculator</h3>', unsafe_allow_html=True)
    
    with st.form("carbon_calculation"):
        st.markdown("**Calculate your business carbon footprint:**")
        
        col1, col2, col3 = st.columns(3)
        with col1:
            energy_usage = st.number_input("Monthly Energy Usage (kWh)", min_value=0.0, 
                                         value=st.session_state.business_data.get("monthly_energy_usage", 850.0))
        with col2:
            transport_fuel = st.number_input("Monthly Transport Fuel (liters)", min_value=0.0, value=200.0)
        with col3:
            waste_amount = st.number_input("Monthly Waste (kg)", min_value=0.0, value=500.0)
        
        if st.form_submit_button("Calculate Carbon Footprint", type="primary"):
            with st.spinner("Calculating carbon footprint..."):
                result = calculate_carbon_footprint(
                    st.session_state.business_id, 
                    energy_usage, 
                    transport_fuel, 
                    waste_amount
                )
                if result:
                    st.session_state.carbon_footprint = result
                    st.success("✅ Carbon footprint calculated!")
    
    # Display carbon footprint results
    if st.session_state.carbon_footprint:
        footprint = st.session_state.carbon_footprint
        
        # Get detailed analysis
        detailed_analysis = get_detailed_carbon_analysis(st.session_state.business_id)
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Total Annual Emissions", 
                f"{footprint['total_emissions']:.2f} tons CO₂",
                help="Total annual carbon dioxide equivalent emissions"
            )
        
        with col2:
            st.metric(
                "Energy Emissions", 
                f"{footprint['energy_emissions']:.2f} tons CO₂",
                help="Emissions from electricity and energy usage"
            )
        
        with col3:
            st.metric(
                "Transport Emissions", 
                f"{footprint['transport_emissions']:.2f} tons CO₂",
                help="Emissions from vehicle fuel consumption"
            )
        
        with col4:
            st.metric(
                "Waste Emissions", 
                f"{footprint['waste_emissions']:.2f} tons CO₂",
                help="Emissions from waste generation and disposal"
            )
        
        # Carbon footprint breakdown chart
        if detailed_analysis:
            analysis = detailed_analysis.get("analysis", {})
            monthly_emissions = analysis.get("monthly_emissions", {})
            
            if monthly_emissions:
                # Pie chart for emissions breakdown
                emissions_data = {
                    "Category": ["Energy", "Transport", "Waste"],
                    "Emissions": [
                        monthly_emissions.get("energy", 0) * 12,
                        monthly_emissions.get("transport", 0) * 12,
                        monthly_emissions.get("waste", 0) * 12
                    ]
                }
                
                fig = px.pie(
                    emissions_data, 
                    values="Emissions", 
                    names="Category", 
                    title="Annual Carbon Footprint Breakdown",
                    color_discrete_sequence=px.colors.qualitative.Set3
                )
                st.plotly_chart(fig, use_container_width=True)
                
                # Sustainability rating
                rating = analysis.get("rating", "Average")
                rating_colors = {
                    "Excellent": "green",
                    "Good": "lightgreen", 
                    "Average": "orange",
                    "Below Average": "orange",
                    "Needs Improvement": "red"
                }
                
                st.markdown(
                    f'<div class="metric-card">'
                    f'<h4>Sustainability Rating: <span style="color: {rating_colors.get(rating, "gray")}">{rating}</span></h4>'
                    f'</div>', 
                    unsafe_allow_html=True
                )

def action_plan_section():
    """Action plan with recommendations and subsidies"""
    st.markdown('<h3>📋 Personalized Action Plan</h3>', unsafe_allow_html=True)
    
    if st.button("Generate Action Plan", type="primary"):
        with st.spinner("Generating personalized action plan..."):
            action_plan = generate_action_plan(st.session_state.business_id)
            if action_plan:
                st.session_state.action_plan = action_plan
                st.success("✅ Action plan generated!")
    
    if st.session_state.action_plan:
        plan = st.session_state.action_plan
        
        # Summary metrics
        col1, col2 = st.columns(2)
        with col1:
            st.metric(
                "Total Potential Savings", 
                f"${plan['total_potential_savings']:,.0f}/year",
                help="Estimated annual cost savings from all recommendations"
            )
        with col2:
            st.metric(
                "Total CO₂ Reduction", 
                f"{plan['total_potential_co2_reduction']:.1f} tons/year",
                help="Estimated annual carbon emissions reduction"
            )
        
        # Recommendations
        st.markdown("### 🎯 AI-Generated Recommendations")
        
        for i, rec in enumerate(plan["recommendations"]):
            with st.expander(f"#{i+1}: {rec['title']}", expanded=i==0):
                col1, col2 = st.columns([2, 1])
                
                with col1:
                    st.markdown(f"**Description:** {rec['description']}")
                    st.markdown(f"**Category:** {rec['category'].title()}")
                    st.markdown(f"**Priority:** {rec['priority'].title()}")
                    st.markdown(f"**Implementation Time:** {rec['implementation_time']}")
                
                with col2:
                    st.metric("Annual Savings", f"${rec['estimated_savings']:,.0f}")
                    st.metric("CO₂ Reduction", f"{rec['estimated_co2_reduction']:.1f} tons")
                    st.metric("Implementation Cost", f"${rec['implementation_cost']:,.0f}")
                    
                    # Confidence indicator
                    confidence = rec['ai_confidence']
                    confidence_color = "green" if confidence > 0.8 else "orange" if confidence > 0.6 else "red"
                    st.markdown(f"**AI Confidence:** <span style='color: {confidence_color}'>{confidence:.0%}</span>", 
                              unsafe_allow_html=True)
        
        # Subsidies
        st.markdown("### 💰 Available Subsidies")
        
        for i, subsidy in enumerate(plan["subsidies"]):
            st.markdown(
                f'<div class="subsidy-card">'
                f'<h4>{subsidy["name"]}</h4>'
                f'<p><strong>Amount:</strong> {subsidy["amount_range"]}</p>'
                f'<p><strong>Agency:</strong> {subsidy["government_agency"]}</p>'
                f'<p><strong>Category:</strong> {subsidy["category"].title()}</p>'
                f'<p>{subsidy["description"]}</p>'
                f'</div>', 
                unsafe_allow_html=True
            )

def main():
    """Main application"""
    init_session_state()
    
    # Header
    st.markdown('<h1 class="main-header">🌱 EcoPulse</h1>', unsafe_allow_html=True)
    st.markdown('<p style="text-align: center; font-size: 1.2em; color: #666;">AI-Driven MSME Sustainability Advisor</p>', unsafe_allow_html=True)
    
    # Check backend connection
    backend_status = check_backend_connection()
    
    if not backend_status:
        st.error("❌ Backend not connected!")
        st.warning("🚀 To start the backend, run: `cd backend && python -m uvicorn main:app --reload`")
        st.info("📝 For demo purposes, you can still explore the UI below, but functionality will be limited.")
        
        # Show demo mode
        st.markdown("---")
        st.markdown("### 🎚️ Demo Mode (Backend Offline)")
        
        # Demo business data
        demo_data = {
            "name": "Green Tech Solutions (Demo)",
            "industry": "Technology",
            "size": "Small",
            "location": "San Francisco, CA",
            "monthly_energy_usage": 850,
            "annual_revenue": 750000,
            "employees": 15
        }
        
        col1, col2 = st.columns(2)
        with col1:
            st.json(demo_data)
        
        with col2:
            st.markdown("""
            **Demo Results:**
            - Carbon Footprint: 2.5 tons CO₂/year
            - Sustainability Rating: "Good"
            - Potential Savings: $8,500/year
            - Matching Subsidies: 4 programs
            - AI Recommendations: 5 actions
            """)
        
        st.markdown("---")
        st.info("🚀 Start the backend to use full functionality!")
        return
    
    # If backend is connected, show full app
    st.success("✅ Backend connected successfully!")
    
    # Sidebar
    with st.sidebar:
        st.image("https://via.placeholder.com/200x100/2E8B57/FFFFFF?text=EcoPulse", caption="Your Sustainability Partner")
        
        if st.session_state.business_id:
            st.success(f"✅ Business ID: {st.session_state.business_id}")
            st.json(st.session_state.business_data)
            
            if st.button("Reset Session"):
                for key in st.session_state.keys():
                    del st.session_state[key]
                st.rerun()
        else:
            st.info("👈 Please register your business to get started")
        
        st.markdown("---")
        st.markdown("### 📊 Quick Stats")
        st.markdown("- **15,000+** businesses served")
        st.markdown("- **$2.5M** in savings identified")  
        st.markdown("- **8,500 tons** CO₂ reduction")
    
    # Main content
    if not st.session_state.business_id:
        business_registration_form()
    else:
        # Tabs for different sections
        tab1, tab2, tab3 = st.tabs(["📄 Bill Processing", "🌍 Carbon Footprint", "📋 Action Plan"])
        
        with tab1:
            energy_bill_processing()
        
        with tab2:
            carbon_footprint_section()
        
        with tab3:
            action_plan_section()
    
    # Footer
    st.markdown("---")
    st.markdown("*EcoPulse MVP - AI-driven sustainability advisor for MSMEs*")

if __name__ == "__main__":
    main()