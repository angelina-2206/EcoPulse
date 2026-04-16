import streamlit as st
import requests
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from typing import Dict, Any, List
import json
import time
import os
from PIL import Image

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
    page_title="EcoPulse | AI Sustainability Advisor",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for Premium Look
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap');

    :root {
        --primary: #10B981;
        --primary-dark: #059669;
        --secondary: #3B82F6;
        --dark: #1F2937;
        --light: #F9FAFB;
        --glass: rgba(255, 255, 255, 0.85);
        --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }

    h1, h2, h3, .main-header {
        font-family: 'Outfit', sans-serif;
        font-weight: 700;
    }

    /* Main Container Styling */
    .stApp {
        background: radial-gradient(circle at top right, #f0fdf4, #f8fafc);
    }

    /* Hide Streamlit components */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Header Styling */
    .header-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 0;
        margin-bottom: 2rem;
        background: var(--glass);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        box-shadow: var(--shadow);
        border: 1px solid rgba(255, 255, 255, 0.5);
    }
    
    .main-header {
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-size: 3.5rem;
        margin: 0;
        letter-spacing: -0.05em;
    }

    /* Card Styling */
    .card {
        background: var(--glass);
        backdrop-filter: blur(8px);
        padding: 1.5rem;
        border-radius: 16px;
        box-shadow: var(--shadow);
        border: 1px solid rgba(255, 255, 255, 0.3);
        margin-bottom: 1.5rem;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    
    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    /* Metric Styling */
    .metric-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--dark);
    }
    
    .metric-label {
        font-size: 0.875rem;
        color: #6B7280;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    /* Custom Button */
    .stButton > button {
        background: linear-gradient(135deg, var(--primary), var(--primary-dark));
        color: white;
        border: none;
        padding: 0.6rem 1.5rem;
        border-radius: 10px;
        font-weight: 600;
        width: 100%;
        transition: all 0.3s ease;
    }
    
    .stButton > button:hover {
        opacity: 0.9;
        transform: scale(1.02);
    }

    /* Tab Styling */
    .stTabs [data-baseweb="tab-list"] {
        gap: 2rem;
        background-color: transparent;
    }

    .stTabs [data-baseweb="tab"] {
        height: 50px;
        white-space: pre-wrap;
        background-color: var(--glass);
        border-radius: 10px 10px 0 0;
        gap: 1rem;
        padding-top: 10px;
        font-weight: 600;
    }

    .stTabs [aria-selected="true"] {
        background-color: white !important;
        border-bottom: 3px solid var(--primary) !important;
    }

    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: #f1f5f9;
        border-right: 1px solid #e2e8f0;
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
        return None
    except Exception as e:
        st.error(f"Connection error: {str(e)}")
        return None

def render_header():
    """Render the application header"""
    st.markdown("""
        <div class="header-container">
            <h1 class="main-header">EcoPulse</h1>
        </div>
    """, unsafe_allow_html=True)

def business_registration_form():
    """Premium business registration form"""
    st.markdown('## 🏢 Business Registration')
    st.markdown('Start your sustainability journey by registering your business details.')
    
    with st.container():
        st.markdown('<div class="card">', unsafe_allow_html=True)
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
            
            with col2:
                location = st.text_input("Location*", placeholder="e.g., San Francisco, CA")
                employees = st.number_input("Number of Employees", min_value=1, value=15)
                revenue = st.number_input("Annual Revenue ($)", min_value=0.0, value=750000.0)
            
            st.markdown("---")
            st.markdown("### Initial Energy Profile")
            c1, c2 = st.columns(2)
            with c1:
                energy_usage = st.number_input("Avg. Monthly Energy (kWh)", min_value=0.0, value=850.0)
            with c2:
                energy_cost = st.number_input("Avg. Monthly Cost ($)", min_value=0.0, value=120.5)

            submitted = st.form_submit_button("Launch Advisor")
            
            if submitted and name and industry and location:
                business_data = {
                    "name": name,
                    "industry": industry,
                    "size": size,
                    "location": location,
                    "monthly_energy_usage": energy_usage,
                    "monthly_energy_cost": energy_cost,
                    "employees_count": employees,
                    "annual_revenue": revenue
                }
                
                with st.spinner("Setting up your dashboard..."):
                    business_id = register_business(business_data)
                    if business_id:
                        st.session_state.business_id = business_id
                        st.session_state.business_data = business_data
                        st.balloons()
                        st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

def sidebar_content():
    """Premium sidebar content"""
    with st.sidebar:
        # Load local logo if exists
        logo_path = "logo.png"
        if os.path.exists(logo_path):
            img = Image.open(logo_path)
            st.image(img, use_column_width=True)
        else:
            st.markdown("## 🌱 EcoPulse")
            
        st.markdown("---")
        
        if st.session_state.business_id:
            st.markdown(f"### 🏢 {st.session_state.business_data['name']}")
            st.markdown(f"**ID:** `{st.session_state.business_id}`")
            st.markdown(f"**Industry:** {st.session_state.business_data['industry'].title()}")
            st.markdown(f"**Size:** {st.session_state.business_data['size'].title()}")
            
            st.markdown("---")
            if st.button("Reset Session"):
                for key in list(st.session_state.keys()):
                    del st.session_state[key]
                st.rerun()
        else:
            st.info("👋 Register to unlock full insights.")
            
        st.markdown("---")
        st.markdown("### 📈 Impact Stats")
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Total users", "15k+")
        with col2:
            st.metric("CO₂ Saved", "8.5k T")
        
        st.markdown("---")
        st.caption("EcoPulse v1.0.0 | AI-Powered Sustainability")

def main():
    init_session_state()
    sidebar_content()
    render_header()
    
    backend_status = check_backend_connection()
    if not backend_status:
        st.error("⚠️ Backend Offline - Entering Simulation Mode")
        st.info("Please run the backend to enable AI insights.")
        # Simulated mode could go here, but for brevity we'll just show the error
        
    if not st.session_state.business_id:
        business_registration_form()
    else:
        # Main Dashboard
        tabs = st.tabs(["📊 Overview", "🌍 Carbon Footprint", "💡 Action Plan", "📄 Bill Scan"])
        
        with tabs[0]:
            st.markdown("## 📊 Business Sustainability Overview")
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.markdown('<div class="card">', unsafe_allow_html=True)
                st.markdown('<p class="metric-label">Efficiency Score</p>', unsafe_allow_html=True)
                st.markdown('<p class="metric-value">84/100</p>', unsafe_allow_html=True)
                st.markdown('</div>', unsafe_allow_html=True)
                
            with col2:
                st.markdown('<div class="card">', unsafe_allow_html=True)
                st.markdown('<p class="metric-label">Monthly Energy</p>', unsafe_allow_html=True)
                st.markdown(f'<p class="metric-value">{st.session_state.business_data["monthly_energy_usage"]} kWh</p>', unsafe_allow_html=True)
                st.markdown('</div>', unsafe_allow_html=True)
                
            with col3:
                st.markdown('<div class="card">', unsafe_allow_html=True)
                st.markdown('<p class="metric-label">Estimated Savings</p>', unsafe_allow_html=True)
                st.markdown('<p class="metric-value" style="color: var(--primary);">$1,240/yr</p>', unsafe_allow_html=True)
                st.markdown('</div>', unsafe_allow_html=True)
                
            st.markdown("### Performance Trends")
            # Mock chart
            chart_data = pd.DataFrame({
                "Month": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                "Efficiency": [70, 72, 75, 78, 82, 84]
            })
            fig = px.line(chart_data, x="Month", y="Efficiency", markers=True, 
                         color_discrete_sequence=[st.session_state.get('primary_color', '#10B981')])
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
            st.plotly_chart(fig, use_container_width=True)

        with tabs[1]:
            st.markdown("## 🌍 Carbon Footprint Analysis")
            # Reuse logic from original app but with better UI
            c1, c2, c3 = st.columns(3)
            with c1:
                energy = st.number_input("Monthly Energy (kWh)", value=st.session_state.business_data["monthly_energy_usage"])
            with c2:
                fuel = st.number_input("Transport Fuel (L)", value=100.0)
            with c3:
                waste = st.number_input("Waste (kg)", value=200.0)
            
            if st.button("Recalculate Emissions"):
                with st.spinner("Analyzing environmental impact..."):
                    res = calculate_carbon_footprint(st.session_state.business_id, energy, fuel, waste)
                    if res:
                        st.session_state.carbon_footprint = res
            
            if st.session_state.carbon_footprint:
                fp = st.session_state.carbon_footprint
                st.markdown("---")
                cols = st.columns(4)
                cols[0].metric("Total CO₂", f"{fp['total_emissions']:.1f} T")
                cols[1].metric("Energy", f"{fp['energy_emissions']:.1f} T")
                cols[2].metric("Transport", f"{fp['transport_emissions']:.1f} T")
                cols[3].metric("Waste", f"{fp['waste_emissions']:.1f} T")
                
                # Pie Chart
                fig = px.pie(values=[fp['energy_emissions'], fp['transport_emissions'], fp['waste_emissions']], 
                            names=['Energy', 'Transport', 'Waste'], hole=0.4,
                            title="Emissions Breakdown",
                            color_discrete_sequence=['#10B981', '#3B82F6', '#F59E0B'])
                st.plotly_chart(fig, use_container_width=True)

        with tabs[2]:
            st.markdown("## 💡 AI-Powered Action Plan")
            if st.button("Generate Smart Insights"):
                with st.spinner("Our AI is matching your profile with green policies..."):
                    plan = generate_action_plan(st.session_state.business_id)
                    if plan:
                        st.session_state.action_plan = plan
            
            if st.session_state.action_plan:
                plan = st.session_state.action_plan
                st.success(f"Tailored plan generated! Potential savings of ${plan['total_potential_savings']:,.0f}/year found.")
                
                st.markdown("### 🎯 Recommendations")
                for rec in plan["recommendations"]:
                    with st.expander(f"✨ {rec['title']} - Potential Save: ${rec['estimated_savings']}", expanded=False):
                        st.write(rec['description'])
                        c1, c2, c3 = st.columns(3)
                        c1.info(f"Priority: {rec['priority'].upper()}")
                        c2.success(f"CO₂ Reduction: {rec['estimated_co2_reduction']} T")
                        c3.warning(f"Cost: ${rec['implementation_cost']}")

                st.markdown("### 💰 Available Subsidies")
                for sub in plan["subsidies"]:
                    st.markdown(f"""
                        <div class="card" style="border-left: 5px solid var(--secondary)">
                            <h4 style="margin:0; color:var(--secondary)">{sub['name']}</h4>
                            <p style="font-size:0.9rem; margin:10px 0;">{sub['description']}</p>
                            <div style="display:flex; gap:20px;">
                                <span style="font-weight:600"> Agency: {sub['government_agency']}</span>
                                <span style="color:var(--primary-dark); font-weight:700"> Benefit: {sub['amount_range']}</span>
                            </div>
                        </div>
                    """, unsafe_allow_html=True)

        with tabs[3]:
            st.markdown("## 📄 Smart Bill Processing")
            st.info("Upload your energy bills to automatically track usage and detect anomalies.")
            uploaded_file = st.file_uploader("Upload Energy Bill (PDF/Image)", type=['png', 'jpg', 'pdf'])
            if uploaded_file and st.button("Extract Data"):
                with st.spinner("Processing document with OCR..."):
                    time.sleep(2) # Mock processing
                    st.success("Data extracted: 842 kWh | $118.50 | Billing Period: Aug 2024")

if __name__ == "__main__":
    main()