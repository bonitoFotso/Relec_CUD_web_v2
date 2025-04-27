/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs } from "@radix-ui/react-tabs";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Analyses from "./Analyses";
import Etat_de_Support from "./Etat_de_Support";
import Recommandations from "../maskingBox/Recommandations";

const tabRoutes = {
  activities: "/historiques/activities",
  analyse: "/historiques/analyse",
  etat_support: "/historiques/etat_support",
  recommendations: "/historiques/recommendations",
};

export default function HistoriquePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Détermine l'onglet actif en fonction de l'URL
  const getInitialTab = () => {
    const path = location.pathname;
    // Cherche le tab correspondant à l'URL actuelle
    const currentTab = Object.entries(tabRoutes).find(
      ([_, route]) => path === route || path.startsWith(route)
    );

    // Retourne l'onglet correspondant ou "activities" par défaut
    return currentTab ? currentTab[0] : "analyse";
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
    if (currentTab === "analyse" && location.pathname === "/historiques") {
      navigate(tabRoutes.analyse);
    }
  }, [location.pathname]);

  return (
    <div className=" min-h-screen container bg-white dark:bg-gray-900 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 dark:text-gray-200">
        Historiques : Massking Box
      </h1>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4 ">
          <TabsTrigger value="analyse">Analyses</TabsTrigger>
          <TabsTrigger value="etat_support">Etat de support</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="analyse">
          <Analyses />
        </TabsContent>

        <TabsContent value="etat_support">
          <Etat_de_Support />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Recommandations />
        </TabsContent>
      </Tabs>
    </div>
  );
}
