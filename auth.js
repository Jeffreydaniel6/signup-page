// client/src/services/auth.js
import axios from 'axios';

// Get API base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

// Register a new user
const register = (username, password) => {
  return axios.post(`${API_URL}/auth/register`, {
    username,
    password,
  });
};

// Log in a user and store the token in localStorage
const login = (username, password) => {
  return axios
    .post(`${API_URL}/auth/login`, {
      username,
      password,
    })
    .then((response) => {
      // If a token is received, store it in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    });
};

// Log out a user by removing the token from localStorage
const logout = () => {
  localStorage.removeItem('token');
};

// Get the current user's token from localStorage
const getCurrentUserToken = () => {
  return localStorage.getItem('token');
};

// Export all functions as a service object
const authService = {
  register,
  login,
  logout,
  getCurrentUserToken,
};

export default authService;