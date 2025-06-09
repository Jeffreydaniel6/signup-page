// client/src/pages/ProfilePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import profileService from '../services/profile'; // Profile API service
import authService from '../services/auth'; // Authentication service for logout

const ProfilePage = () => {
  // State variables for profile data
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [contactInformation, setContactInformation] = useState('');
  // UI state
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Function to fetch profile data from the backend
  const fetchProfile = useCallback(async () => {
    try {
      const response = await profileService.getProfile();
      const data = response.data;
      setUsername(data.username);
      setAge(data.age || ''); // Set to empty string if age is null/undefined
      // Format date for HTML input type="date"
      setDateOfBirth(data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split('T')[0] : '');
      setContactInformation(data.contactInformation || '');
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) || // Backend error message
        error.message || // Generic error message
        error.toString(); // Fallback
      setMessage(resMessage);
      // If the error is due to invalid/expired token (401 Unauthorized or 403 Forbidden)
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        authService.logout(); // Logout the user
        navigate('/login'); // Redirect to login page
        window.location.reload(); // Force reload to clear any lingering state
      }
    }
  }, [navigate]); // Add navigate as a dependency for useCallback

  // useEffect hook to fetch profile data when the component mounts
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Now fetchProfile is a dependency because it's a memoized function


  // Handle form submission for profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsSuccess(false);

    try {
      // Call the updateProfile function from profileService
      await profileService.updateProfile(age, dateOfBirth, contactInformation);
      setMessage('Profile updated successfully!');
      setIsSuccess(true);
      setIsEditing(false); // Exit editing mode after successful update
      fetchProfile(); // Re-fetch profile data to ensure display is updated
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
      setIsSuccess(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    authService.logout(); // Call logout service
    navigate('/login'); // Redirect to login page
    window.location.reload(); // Force reload to clear auth state
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-8">
        <div className="card form-container">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">User Profile</h2>
            {message && ( // Display messages
              <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
                {message}
              </div>
            )}

            {/* Conditional rendering based on isEditing state */}
            {!isEditing ? (
              // View mode
              <div>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Age:</strong> {age || 'Not set'}</p> {/* Display 'Not set' if value is empty */}
                <p><strong>Date of Birth:</strong> {dateOfBirth || 'Not set'}</p>
                <p><strong>Contact Info:</strong> {contactInformation || 'Not set'}</p>
                <div className="d-grid gap-2 mt-4">
                  <button className="btn btn-info" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
                </div>
              </div>
            ) : (
              // Edit mode
              <form onSubmit={handleUpdate}>
                <div className="form-group mb-3">
                  <label htmlFor="username">Username</label>
                  <input type="text" className="form-control" id="username" value={username} disabled />
                  <small className="form-text text-muted">Username cannot be changed.</small>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    className="form-control"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="0" max="150" // HTML5 validation for age
                  />
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dateOfBirth"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="contactInformation">Contact Information</label>
                  <input
                    type="text"
                    className="form-control"
                    id="contactInformation"
                    value={contactInformation}
                    onChange={(e) => setContactInformation(e.target.value)}
                  />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success">Save Changes</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
                <div className="d-grid gap-2 mt-3"> {/* Moved logout button to be visible in edit mode too */}
                   <button type="button" className="btn btn-danger" onClick={handleLogout}>Log Out</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;