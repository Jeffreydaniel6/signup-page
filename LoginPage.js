// client/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    try {
      await authService.login(username, password); // Call login service
      navigate('/profile'); // Redirect to profile page on success
      window.location.reload(); // Force a full page reload to re-evaluate PrivateRoute (important for simple auth)
    } catch (error) {
      // Handle errors from the API call
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card form-container">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Log In</h2>
            {message && (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-4">
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
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-success">Log In</button>
              </div>
            </form>
            <p className="text-center mt-3">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;