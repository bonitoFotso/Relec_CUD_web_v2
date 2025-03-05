import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute; 