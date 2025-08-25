import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  console.log('ProtectedRoute check - Authenticated:', isAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
} 