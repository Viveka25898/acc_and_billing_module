import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = useSelector((state) => state.auth.role);
  return allowedRoles.includes(role) ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
