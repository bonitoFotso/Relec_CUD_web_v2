/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import Notifications from "../notifications/Notifications";
import Recommandations from "../maskingBox/Recommandations";
import UserManagement from "../users/Users";
import { useNavigate, useLocation } from "react-router-dom";

// Définition des routes pour chaque onglet
const tabRoutes = {
  notifications: "/historiques/notifications",
  utilisateurs: "/historiques/utilisateurs",
  activites: "/historiques/activites",
  analyse: "/historiques/analyse",
  etat_support: "/historiques/etat_support",
  recommendations: "/historiques/recommendations",
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
    if (
      currentTab === "notifications" &&
      location.pathname === "/historiques"
    ) {
      navigate(tabRoutes.notifications);
    }
  }, [location.pathname]);

  return (
    <div className="space-y-5 p-2 h-[80vh] bg-white dark:bg-black rounded-sm">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-auto flex align-middle bg-gray-50 dark:bg-gray-800 text-gray-500 justify-center items-center p-6 gap-2">
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
            value="activites"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "activites"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Activités menées
          </TabsTrigger>
          <TabsTrigger
            value="analyse"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "analyse"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Analyses
          </TabsTrigger>
          <TabsTrigger
            value="etat_support"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "etat_support"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Etat de support
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className={`w-36 rounded-lg p-2 text-sm ${
              activeTab === "recommendations"
                ? "bg-gray-500 text-white"
                : "dark:bg-gray-900"
            }`}
          >
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="mt-6">
          <Notifications />
        </TabsContent>

        <TabsContent value="utilisateurs" className="mt-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="activites" className="mt-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Activités menées</h2>
            <p className="text-gray-600">Contenu des activités menées</p>
            <p className="text-sm text-gray-500 mt-2">
              URL: {tabRoutes.activites}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="analyse" className="mt-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">Analyses</h2>
            <p className="text-gray-600">Contenu des analyses</p>
            <p className="text-sm text-gray-500 mt-2">
              URL: {tabRoutes.analyse}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="etat_support" className="mt-6">
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-bold mb-4">État de support</h2>
            <p className="text-gray-600">
              Contenu relatif à l'état des supports
            </p>
            <p className="text-sm text-gray-500 mt-2">
              URL: {tabRoutes.etat_support}
            </p>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Recommandations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
