import React, { useState, useEffect } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser || user) {
      setLoading(false);
    } else {
      // Small delay to ensure we've checked localStorage
      const timer = setTimeout(() => {
        setLoading(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  // If no user is authenticated, redirect to login
  if (!user && !localStorage.getItem('user')) {
    return <Navigate to="/" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;
