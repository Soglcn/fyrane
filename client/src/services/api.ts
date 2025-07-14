// Fyrane/client/src/services/api.ts
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Core 

// Axios 
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// get core' messages
export const getMessageFromCore = async () => {
  try {
    const response = await apiClient.get('/api/data');
    return response.data; 
  } catch (error) {
    console.error('Error fetching message from Core:', error);
    throw error; 
  }
};

