import { useAuth } from "../context/useAuth";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoutes;
