// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import authService from './services/auth'; // Import authService to use logout

// A simple PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = authService.getCurrentUserToken(); // Check for token
  return token ? children : <Navigate to="/login" replace />; // If token exists, render children; otherwise, redirect to login
};

function App() {
  return (
    <Router>
      <div className="container"> {/* Use Bootstrap container for layout */}
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Profile Route */}
          <Route
            path="/profile"
            element={
              <PrivateRoute> {/* Wrap ProfilePage with PrivateRoute */}
                <ProfilePage />
              </PrivateRoute>
            }
          />

          {/* Redirect root URL to login page */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;