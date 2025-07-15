import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000'; // Core 

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

// Yeni endpoint’e göre güncellenmiş disk istatistikleri fonksiyonu
export const getDiskTotalStats = async () => {
  try {
    const response = await apiClient.get('/api/system/disks');  // Burayı /disks olarak değiştirdik
    return response.data;
  } catch (error) {
    console.error('Failed to fetch disk total stats:', error);
    throw error;
  }
};
