import { Navigate, RouteObject } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';
import LoginForm from '@/components/LoginForm';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'settings', element: <Settings /> },
      { path: '', element: <Navigate to="/dashboard" replace /> },
    ],
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginForm />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 