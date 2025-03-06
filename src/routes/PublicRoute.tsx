import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (currentUser) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default PublicRoute; 