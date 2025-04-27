// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginForm from "./components/LoginForm";
import Dashboard from "./pages/dashboard/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/layout/Layout";
import { AppProviders } from "./contexts/AppProviders";
import UserManagement from "./pages/users/Users";
import MissionManagement from "./pages/missions/MissionManagement";
import MissionDetails from "./pages/missions/MissionDetails";
import EquipmentMap from "./pages/maps/EquipmentMap";
import UserDetail from "./pages/users/UserDetails";
import PermissionsManagement from "./pages/permissions/permissions";
import { ToastContainer } from "react-toastify";
import Profil from "./pages/Profil";
import Anomalies from "./pages/anomalies/Anomalies";
import Tableau from "./pages/maskingBox/Tableau";
import Cartographie from "./pages/maskingBox/carte/Cartographie";
import PageCompte from "./pages/comptes/PageComptes";
import PageAcceuil from "./pages/parametres/PageAcceuil";
import Companies from "./pages/companies/Companies";
import CompanieUsers from "./pages/companies/CompanieUsers";
import LoadingScreen from "./components/LoadingScreen";
import HistoriquePage from "./pages/historique/Historiques";
import HelpCenter from "./pages/maskingBox/helpcenter/Help_Center";

// Composant de protection des routes privées
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <div>
          <LoadingScreen />
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="h-[100vh] flex items-center justify-center">
        <div>
          <LoadingScreen />
        </div>
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/" /> : <>{element}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppProviders>
        <Router>
          <Routes>
            {/* route publique « login » */}
            <Route
              path="/login"
              element={<PublicRoute element={<LoginForm />} />}
            />

            {/* Routes privées avec Layout */}
            <Route element={<PrivateRoute element={<Layout />} />}>
              {/* Dashboard */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/permissions" element={<PermissionsManagement />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/maps" element={<EquipmentMap />} />
              <Route path="/missions" element={<MissionManagement />} />
              <Route path="/missions/:id" element={<MissionDetails />} />

              <Route path="/comptes" element={<PageCompte />} />

              <Route path="/companies" element={<Companies />} />
              <Route path="/companies/:id" element={<CompanieUsers />} />

              <Route path="/parametres" element={<PageAcceuil />} />
              <Route path="/parametres/:tab" element={<PageAcceuil />} />
              <Route path="/profile" element={<Profil />} />
              <Route path="/anomalies" element={<Anomalies />} />

              <Route path="/panneau_de_controle" element={<Tableau />} />
              <Route path="/carte" element={<Cartographie />} />
              <Route path="/historiques" element={<HistoriquePage />} />
              <Route path="/historiques/:tab" element={<HistoriquePage />} />

              <Route path="/help&center" element={<HelpCenter />} />

              {/* Route 404 */}
              <Route path="*" element={<div>Page non trouvée</div>} />
            </Route>
          </Routes>
        </Router>
        <ToastContainer />
      </AppProviders>
    </ThemeProvider>
  );
};

export default App;
