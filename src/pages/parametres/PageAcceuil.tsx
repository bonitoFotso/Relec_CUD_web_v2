/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import Notifications from "../notifications/Notifications";
import UserManagement from "../users/Users";
import { useNavigate, useLocation } from "react-router-dom";
import PermissionsManagement from "../permissions/permissions";
import Anomalies from "../anomalies/Anomalies";

// Définition des routes pour chaque onglet
const tabRoutes = {
  notifications: "/parametres/notifications",
  utilisateurs: "/parametres/utilisateurs",
  activites: "/parametres/activites",
  analyse: "/parametres/analyse",
  etat_support: "/parametres/etat_support",
  permissions: "/parametres/permissions",
};

export default function PageAcceuil() {
  const navigate = useNavigate();
  const location = useLocation();

  // Détermine l'onglet actif en fonction de l'URL
  const getInitialTab = () => {
    const path = location.pathname;
    // Cherche le tab correspondant à l'URL actuelle
    const currentTab = Object.entries(tabRoutes).find(
      ([_, route]) => path === route || path.startsWith(route)
    );

    // Retourne l'onglet correspondant ou "notifications" par défaut
    return currentTab ? currentTab[0] : "notifications";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());

  // Gère le changement d'onglet
  const handleTabChange = (value: string): void => {
    const tabValue = value as keyof typeof tabRoutes;
    setActiveTab(tabValue);
    navigate(tabRoutes[tabValue]);
  };

  // Synchronise l'onglet actif avec l'URL au chargement initial
  useEffect(() => {
    const currentTab = getInitialTab();
    if (currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
    // Si l'URL ne correspond à aucun onglet, redirige vers l'onglet par défaut
    if (currentTab === "notifications" && location.pathname === "/parametres") {
      navigate(tabRoutes.notifications);
    }
  }, [location.pathname]);

  return (
    <div className="space-y-5 p-3 h-[80vh] bg-white dark:bg-black rounded-sm">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="  h-9 w-auto flex align-middle bg-gray-50 dark:bg-gray-800 text-gray-500 justify-center items-center p-6 gap-2">
          <TabsTrigger
            value="notifications"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "notifications"
                ? "bg-gray-400 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="utilisateurs"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "utilisateurs"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "permissions"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Permissions
          </TabsTrigger>

          <TabsTrigger
            value="anomalies"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "anomalies"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Anomalies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Notifications />
        </TabsContent>

        <TabsContent value="utilisateurs" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <PermissionsManagement />
        </TabsContent>

        <TabsContent value="anomalies" className="mt-6">
          <Anomalies />
        </TabsContent>
      </Tabs>
    </div>
  );
}
