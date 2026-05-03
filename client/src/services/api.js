import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const routeService = {
  predictTraffic: async (origin, destination) => {
    try {
      const response = await api.post('/route/predict', { origin, destination });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  optimizeRoute: async (origin, destination, preferences = {}) => {
    try {
      const response = await api.post('/route/optimize', { 
        origin, 
        destination, 
        preferences 
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const alertService = {
  reportIncident: async (incidentData) => {
    try {
      const response = await api.post('/alerts/report', incidentData);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const emergencyService = {
  activateEmergency: async (origin, destination) => {
    try {
      const response = await api.post('/emergency/route', { origin, destination });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export const userService = {
  getPreferences: async (userId) => {
    try {
      const response = await api.get(`/user/preferences/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getHistory: async (userId) => {
    try {
      const response = await api.get(`/user/history/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  getSuggestedWeights: async (userId) => {
    try {
      const response = await api.get(`/user/suggested-weights/${userId}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

const handleApiError = (error) => {
  console.error('API Call Failed:', error.response?.data || error.message);
  throw error.response?.data || new Error('Network Error');
};

export default api;
