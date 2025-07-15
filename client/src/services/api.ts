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

export const loginUser = async (loginData: any) => {
  try {
    const response = await apiClient.post('/api/login', loginData); 
    return response.data; 
  } catch (error: any) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : { message: 'Network error or unknown issue' }; 
  }
};

export const getDiskTotalStats = async () => {
  const response = await fetch('http://127.0.0.1:5000/api/system/disks/total');
  if (!response.ok) throw new Error('Failed to fetch disk total stats');
  return response.json();
};
