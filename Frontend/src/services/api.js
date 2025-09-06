
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
});

/**
 * A function to handle user login.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} The JWT token.
 */

export const login = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    
    return response.data.token;
  } catch (error) {
    
    throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
  }
};

