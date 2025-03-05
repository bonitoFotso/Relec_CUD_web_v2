import { Navigate, RouteObject } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Users from '../pages/Users';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

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
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]; 