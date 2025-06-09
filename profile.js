// client/src/services/profile.js
import axios from 'axios';
import authService from './auth'; // To get the authentication token

// Get API base URL from environment variables
const API_URL = process.env.REACT_APP_API_URL;

// Helper function to create authorization header with JWT token
const authHeader = () => {
  const token = authService.getCurrentUserToken();
  if (token) {
    return { Authorization: `Bearer ${token}` }; // Standard JWT header
  } else {
    return {}; // Return empty object if no token
  }
};

// Fetch user profile data from the backend
const getProfile = () => {
  return axios.get(`${API_URL}/profile`, { headers: authHeader() }); // Include auth header
};

// Update user profile data on the backend
const updateProfile = (age, dateOfBirth, contactInformation) => {
  return axios.put(`${API_URL}/profile`, {
    age,
    dateOfBirth,
    contactInformation,
  }, { headers: authHeader() }); // Include auth header
};

// Export all functions as a service object
const profileService = {
  getProfile,
  updateProfile,
};

export default profileService;