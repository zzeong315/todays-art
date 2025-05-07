import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.ts';
import { JSX } from 'react';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isLoggedIn } = useAuthStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
};
