import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { token } = useSelector((s) => s.auth);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const RoleRoute = ({ roles }) => {
  const { user } = useSelector((s) => s.auth);
  return user && roles.includes(user.role) ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
