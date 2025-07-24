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

export const addUser = async (userData: any) => {
  try {
    const response = await apiClient.post('/api/users', userData);
    return response.data;
  } catch (error: any) {
    console.error('Add user error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : { message: 'Network or unknown error' };
  }
};



export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/api/check-users'); // Kullanıcıları çekeceğin endpoint
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch users:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : { message: 'Network or unknown error' };
  }
};



export const deleteUser = async (userId: string) => {
  try {
    const response = await apiClient.delete(`/api/users/${userId}`); // DELETE isteği
    return response.data;
  } catch (error: any) {
    console.error(`ID ${userId} olan kullanıcı silinirken hata:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : { message: 'Kullanıcı silme sırasında ağ veya bilinmeyen sorun' };
  }
};

// FormData arayüzünü burada tanımlıyoruz, çünkü editUser fonksiyonu onu kullanıyor.
// Bu arayüzü App.tsx'ten kopyaladım.
interface FormData {
  company_id: string;
  username: string;
  password?: string;
  fullname: string;
  email: string;
  phone: string;
  role: string;
  profession: string;
}

export const editUser = async (id: string, updatedData: Partial<FormData>) => {
  try {
    // fetch yerine apiClient (axios) kullanıyoruz
    const response = await apiClient.put(`/api/users/${id}`, updatedData);
    return response.data;
  } catch (error: any) {
    console.error(`ID ${id} olan kullanıcı güncellenirken hata:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : { message: 'Kullanıcı güncelleme sırasında ağ veya bilinmeyen sorun' };
  }
};
