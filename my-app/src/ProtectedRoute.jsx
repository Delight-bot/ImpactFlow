import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("adminAuthenticated");

  return isAuthenticated === "true" ? children : <Navigate to="/admin/login" replace />;
}
