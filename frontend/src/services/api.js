import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const businessService = {
  register: (data) => api.post('/business/register', data),
  getDetails: (id) => api.get(`/business/${id}`),
  getDemo: () => api.get('/demo-business'),
};

export const carbonService = {
  calculate: (data) => api.post('/carbon/calculate', data),
  getDetailed: (id) => api.get(`/carbon/detailed/${id}`),
  getHistory: (id) => api.get(`/carbon/history/${id}`),
};

export const recommendService = {
  getActionPlan: (businessId) => api.post('/recommend/action-plan', { business_id: businessId }),
  getSubsidies: (businessId) => api.get(`/recommend/subsidies/${businessId}`),
  getRecommendations: (businessId) => api.get(`/recommend/recommendations/${businessId}`),
  getAiInsights: (businessId) => api.post(`/recommend/ai-insights/${businessId}`),
};

// Placeholder for simulator and chat if they don't exist in backend yet
export const aiService = {
  simulate: async (params) => {
    // Simulate API call to /simulate
    try {
      const response = await api.post('/simulate', params);
      return response.data;
    } catch (e) {
      // Mock logic for demo if endpoint not found
      return new Promise((resolve) => {
        setTimeout(() => {
          const { energyBaseline, solarAdoption, ledAdoption } = params;
          const solarOffset = (solarAdoption / 100) * energyBaseline;
          const ledReduction = (ledAdoption / 100) * (energyBaseline * 0.3);
          const newEnergy = Math.max(0, energyBaseline - solarOffset - ledReduction);
          resolve({
            currentCost: energyBaseline * 0.12,
            projectedCost: newEnergy * 0.12,
            projectedCarbon: newEnergy * 0.0006,
            savings: (energyBaseline - newEnergy) * 0.12
          });
        }, 500);
      });
    }
  },
  chat: async (message) => {
    try {
      const response = await api.post('/chat', { message });
      return response.data;
    } catch (e) {
      // Mock logic
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            content: "I've analyzed your request. To optimize your sustainability, I recommend evaluating your peak HVAC load which currently accounts for 40% of your energy usage. Applying thermal intelligence could reduce this by 15%." 
          });
        }, 1000);
      });
    }
  }
};

export default api;
