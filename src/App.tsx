// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/dashboard/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { Layout } from './components/layout/Layout';
import { AppProviders } from './contexts/AppProviders';
import UserManagement from './pages/users/Users';
import MissionManagement from './pages/missions/MissionManagement';
import MissionDetails from './pages/missions/MissionDetails';

// Composant de protection des routes privées
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  // Rediriger vers la page de connexion si non authentifié
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProviders>
        <Router>
          <Routes>
            {/* Routes d'authentification sans Layout */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<LoginForm />} />

            {/* Routes privées avec Layout */}
            <Route element={<PrivateRoute element={<Layout />} />}>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />

              <Route path='/missions' element={<MissionManagement />} />
              <Route path='/missions/:id' element={<MissionDetails />} />

              <Route path="/settings" element={<div>Paramètres</div>} />


              {/* Route 404 */}
              <Route path="*" element={<div>Page non trouvée</div>} />
            </Route>
          </Routes>
        </Router>
      </AppProviders>
    </ThemeProvider>
  );
};

export default App;