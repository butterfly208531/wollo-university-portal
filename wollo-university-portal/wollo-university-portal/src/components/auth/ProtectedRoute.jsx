import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ roles = [] }) {
  const { user, ready } = useAuth();
  if (!ready) return <div style={{minHeight:'100vh'}} />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (roles.length && !roles.includes(user.role)) return <Navigate to="/admin/dashboard" replace />;
  return <Outlet />;
}
