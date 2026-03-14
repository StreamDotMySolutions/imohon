import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export default function RequireRole({ children, roles }) {
  const role = useAuthStore((state) => state.role);

  if (!roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
