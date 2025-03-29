import axios from 'axios';

const API_BASE_URL = "https://kuty-backend-1-0-0.onrender.com";

export const login = async (loginData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, loginData);
    if (response.data.code === 'OK') {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Username หรือ Password ไม่ถูกต้อง");
    } else {
      console.error('Error logging in:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }
};