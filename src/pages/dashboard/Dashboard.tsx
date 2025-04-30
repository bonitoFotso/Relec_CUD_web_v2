/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/Dashboard/index.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FileText, AlertCircle } from "lucide-react";
import { User, UserService } from "@/services/UsersService";
import { Mission, MissionsService } from "@/services/missions.service";
import { Sticker, StickersService } from "@/services/stickers.service";

// Components
import StatsCards from "./StatsCards";
import MissionsTable from "./MissionsTable";
import MissionTypeChart from "./MissionTypeChart";
import StickerUsageChart from "./StickerUsageChart";
import { Alert, BarChartData, DashboardStats, PieChartData } from "./types";
import { getInterventionTypeName } from "./utils";
import { SkeletonCardUser } from "@/components/card/SkeletonCardUser";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonCard } from "@/components/card/SkeletonCard";
import TableauCommunes from "./TableauCommunes";
import { useEquipements } from "@/contexts/EquipementContext";
//import { DashboardStats, PieChartData, BarChartData, Alert } from './types';
//import { getInterventionTypeName } from './utils';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    missionsCount: 0,
    agentsCount: 0,
    stickersCount: 0,
    completedMissionsCount: 0,
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [agents, setAgents] = useState<User[]>([]);
  const [missionTypeData, setMissionTypeData] = useState<PieChartData[]>([]);
  const [stickerMonthlyData, setStickerMonthlyData] = useState<BarChartData[]>(
    []
  );
  const [alerts, setAlerts] = useState<Alert[]>([]);
    const {
      streetlights,
      metters,
      cabinets,
      substations
    } = useEquipements();

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les missions
        const missionsData: Mission[] = await MissionsService.getAll();

        // Ajouter statut simulé pour démo
        const missionsWithStatus = missionsData.map((mission) => ({
          ...mission,
        }));

        setMissions(missionsWithStatus);

        // Récupérer les utilisateurs (agents)
        const usersData: User[] = await UserService.getAll();
        const agentsData = usersData.filter((user) => user.role === "agent");

        setAgents(
          agentsData.map((agent) => ({
            ...agent,
            status: Math.random() > 0.3 ? "active" : "inactive", // Simulation de statut
          }))
        );

        // Récupérer les statistiques de stickers
        const stickersData: Sticker[] = await StickersService.getAll();

        // Mettre à jour les statistiques
        const completedCount = missionsWithStatus.filter(
          (m) => m.status === "Terminé"
        ).length;

        setStats({
          missionsCount: missionsWithStatus.length,
          agentsCount: agentsData.length,
          stickersCount: streetlights.length+metters.length+substations.length+cabinets.length,
          completedMissionsCount: completedCount,
        });

        // Générer données pour le graphique circulaire
        // Grouper les missions par type d'intervention
        const missionsByType = missionsWithStatus.reduce((acc, mission) => {
          const typeId = mission.intervention_type_id || "unknown";
          if (!acc[typeId]) {
            acc[typeId] = 0;
          }
          acc[typeId]++;
          return acc;
        }, {} as Record<string, number>);

        const pieData = Object.entries(missionsByType).map(([name, value]) => ({
          name: getInterventionTypeName(parseInt(name)) || `Type ${name}`,
          value,
        }));

        setMissionTypeData(
          pieData.length > 0
            ? pieData
            : [
                { name: "Déploiement", value: 12 },
                { name: "Maintenance", value: 8 },
                { name: "Urgence", value: 3 },
                { name: "Inspection", value: 7 },
              ]
        );

        // Générer données pour le graphique de stickers par mois
        // Simulation de données pour l'exemple
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"];
        setStickerMonthlyData(
          months.map((name) => ({
            name,
            stickers: Math.floor(Math.random() * 50) + 30,
          }))
        );

        // Générer des alertes
        // Générer des alertes
        const newAlerts: Alert[] = [
          {
            type: "error",
            icon: "error",
            message:
              "Une erreur s'est produite lors du traitement de votre demande.",
          },
          {
            type: "warning",
            icon: "warning",
            message: "Attention ! Certaines données peuvent être incorrectes.",
          },
          {
            type: "warning",
            icon: "warning",
            message: "Une mise à jour est disponible pour votre application.",
          },
          {
            type: "warning",
            icon: "warning",
            message:
              "Problème critique détecté ! Intervention requise immédiatement.",
          },
        ];

        if (stickersData.some((s) => s.count && s.count < 10)) {
          newAlerts.push({
            type: "error",
            icon: "AlertCircle",
            message:
              "Stock de stickers pour équipements de type 2 faible (5 restants)",
          });
        }

        const pendingMissions = missionsWithStatus.filter(
          (m) => m.status === "pending"
        );
        if (pendingMissions.length > 2) {
          newAlerts.push({
            type: "warning",
            icon: "Clock",
            message: `${pendingMissions.length} missions en attente d'affectation depuis plus de 48h`,
          });
        }

        setAlerts(newAlerts);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données du dashboard",
          error
        );
        setError(
          "Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fonction pour générer le rapport PDF
  const handleDownloadReport = (): void => {
    alert("Téléchargement du rapport en cours...");
    // Ici vous pourriez implémenter la génération de PDF
  };

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <div className="container mx-auto flex flex-col space-y-4 mt-5">
        <SkeletonCardUser />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2  gap-4 mx-auto">
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] w-[280px] rounded-xl" />
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] w-[280px] rounded-xl" />
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] w-[280px] rounded-xl" />
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] w-[280px] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 p-2 md:p-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-2 py-3">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold ">Tableau de bord</h1>
          <p className=" mt-1 font-medium">
            Bienvenue, {currentUser?.name || "Utilisateur"}
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center self-start md:self-auto"
        >
          <FileText className="w-4 h-4 mr-2" />
          Télécharger le rapport
        </button>
      </div>

      {/* Cartes statistiques*/}
      <StatsCards stats={stats} />

      {/*Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissionTypeChart data={missionTypeData} />
        <StickerUsageChart data={stickerMonthlyData} />
      </div>

      {/* tableaux */}
      <TableauCommunes />

      {/* Tableau des missions récentes et liste des agents */}
      <div>
        <MissionsTable missions={missions} isLoading={loading} />
      </div>
    </div>
  );
};

export default Dashboard;
