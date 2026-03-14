import React from 'react';
import { Navigate } from 'react-router-dom';
import LoadingBlock from '../components/LoadingBlock';
import { useAuthStore } from '../../stores/authStore';

export default function RequireAuth({ children }) {
  const { initialized, isAuthenticated, loading } = useAuthStore();

  if (!initialized || loading) {
    return <LoadingBlock message="Restoring session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
