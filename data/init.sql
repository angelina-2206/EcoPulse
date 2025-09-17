-- Initialize EcoPulse database with sample data

-- Create extension for UUID generation if needed
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sample subsidies data
INSERT INTO subsidies (name, description, eligibility_criteria, amount_range, government_agency, category, business_size_eligible, industry_eligible, location_eligible, is_active) VALUES
('Small Business Energy Efficiency Grant', 'Federal grant providing up to $10,000 for energy efficiency improvements in small businesses', '{"business_size": ["micro", "small"], "annual_revenue_max": 500000, "energy_usage_min": 500}', '$2,000 - $10,000', 'Department of Energy', 'energy', '["micro", "small"]', '["all"]', '["nationwide"]', true),
('Green Technology Adoption Incentive', 'State-level incentive for adopting renewable energy solutions', '{"business_size": ["small", "medium"], "annual_revenue_max": 2000000, "carbon_footprint_min": 20}', '$5,000 - $25,000', 'State Environmental Agency', 'renewable_energy', '["small", "medium"]', '["all"]', '["california", "new_york", "texas"]', true),
('Waste Reduction Program', 'Municipal program supporting businesses in waste reduction initiatives', '{"business_size": ["micro", "small", "medium"], "industry": ["restaurant", "retail", "manufacturing"]}', '$1,000 - $5,000', 'Local Environmental Office', 'waste', '["micro", "small", "medium"]', '["restaurant", "retail", "manufacturing"]', '["all"]', true),
('MSME Sustainability Fund', 'Comprehensive sustainability upgrade fund for MSMEs', '{"business_size": ["micro", "small", "medium"], "annual_revenue_max": 1000000, "employees_max": 50}', '$3,000 - $15,000', 'Small Business Administration', 'comprehensive', '["micro", "small", "medium"]', '["all"]', '["nationwide"]', true),
('Carbon Offset Initiative', 'Program providing credits for verified carbon reduction activities', '{"business_size": ["small", "medium"], "carbon_footprint_min": 15, "verification_required": true}', '$500 - $3,000', 'Environmental Protection Agency', 'carbon_offset', '["small", "medium"]', '["all"]', '["nationwide"]', true)
ON CONFLICT DO NOTHING;

-- Sample data insertion complete
COMMENT ON SCHEMA public IS 'EcoPulse database initialized with sample data';