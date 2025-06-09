// client/src/pages/SignupPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // For navigation and linking
import authService from '../services/auth'; // Import the authentication service

const SignupPage = () => {
  // State variables to hold form input values and messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // Message for user feedback
  const [isSuccess, setIsSuccess] = useState(false); // To style success/error messages
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Handle form submission for signup
  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setMessage(''); // Clear any previous messages
    setIsSuccess(false); // Reset success state

    // Basic client-side password matching validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      return; // Stop execution if passwords don't match
    }

    try {
      // Call the register function from authService
      await authService.register(username, password);
      setMessage('Registration successful! Please log in.');
      setIsSuccess(true);
      // Optional: automatically navigate to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Wait 2 seconds before navigating
    } catch (error) {
      // Handle errors from the API call
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) || // Backend error message
        error.message || // Generic error message
        error.toString(); // Fallback
      setMessage(resMessage);
      setIsSuccess(false);
    }
  };

  return (
    <div className="row justify-content-center mt-5"> {/* Bootstrap row to center content */}
      <div className="col-md-6"> {/* Column for responsiveness */}
        <div className="card form-container"> {/* Custom form-container for styling */}
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Sign Up</h2> {/* Card title */}
            {message && ( // Display message if present
              <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`} role="alert">
                {message}
              </div>
            )}
            <form onSubmit={handleSignup}>
              <div className="form-group mb-3"> {/* Bootstrap form group for spacing */}
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control" // Bootstrap form control styling
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)} // Update state on change
                  required // HTML5 validation
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-grid gap-2"> {/* Bootstrap for full-width button */}
                <button type="submit" className="btn btn-primary">Sign Up</button>
              </div>
            </form>
            <p className="text-center mt-3"> {/* Link to login page */}
              Already have an account? <Link to="/login">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;