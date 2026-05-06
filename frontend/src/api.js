import axios from 'axios';

// Pointing to the production backend
const API_BASE_URL = 'https://shorty.ujjawalcodes.site';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const shortenUrl = async (originalLink, alias = '', password = '') => {
  try {
    const payload = {
      original_link: originalLink,
    };
    
    if (alias.trim()) {
      payload.alias = alias.trim();
    }
    
    if (password.trim()) {
      payload.password = password.trim();
    }

    const response = await apiClient.post('/shorten-link', payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to shorten URL');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const getAnalytics = async (shortCode) => {
  try {
    const response = await apiClient.get(`/analytics/${shortCode}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to fetch analytics');
    }
    throw new Error('Network error. Please try again later.');
  }
};

export const unlockUrl = async (shortCode, password) => {
  try {
    const response = await apiClient.post(`/unlock/${shortCode}`, { password });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to unlock URL');
    }
    throw new Error('Network error. Please try again later.');
  }
};
