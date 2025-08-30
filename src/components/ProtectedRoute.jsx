import React from 'react';
import { useAuth } from '../Hooks/useAuth';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = useAuth();

  // If user is null, they're not authenticated
  if (user === null) {
    return <Navigate to="/" replace />;
  }

  // If user exists, render the protected content
  return children;
};

export default ProtectedRoute;
