// src/contexts/DashboardContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
  } from "react";
  import { User, UserService } from "@/services/UsersService";
  import { Mission, MissionsService } from "@/services/missions.service";
  import { Sticker, StickersService } from "@/services/stickers.service";
  import { DashboardStats, PieChartData, BarChartData, Alert } from "../pages/dashboard/types";
  import { getInterventionTypeName } from "../pages/dashboard/utils";
  
  interface DashboardData {
    loading: boolean;
    error: string | null;
    stats: DashboardStats;
    missions: Mission[];
    agents: User[];
    missionTypeData: PieChartData[];
    stickerMonthlyData: BarChartData[];
    alerts: Alert[];
    refresh: () => void;
  }
  
  const DashboardContext = createContext<DashboardData | undefined>(undefined);
  
  export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
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
    const [stickerMonthlyData, setStickerMonthlyData] = useState<BarChartData[]>([]);
    const [alerts, setAlerts] = useState<Alert[]>([]);
  
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Récupérer les missions
        const missionsData: Mission[] = await MissionsService.getAll();
        // Pour la démo, on ajoute un statut aléatoire
        const missionsWithStatus = missionsData.map((mission) => ({
          ...mission,
          status: ["in_progress", "completed", "pending"][
            Math.floor(Math.random() * 3)
          ],
        }));
        setMissions(missionsWithStatus);
  
        // Récupérer les utilisateurs et ne garder que les agents
        const usersData: User[] = await UserService.getAll();
        const agentsData = usersData.filter((user) => user.role === "agent");
        setAgents(
          agentsData.map((agent) => ({
            ...agent,
            status: Math.random() > 0.3 ? "active" : "inactive", // Simulation
          }))
        );
  
        // Récupérer les stickers
        const stickersData: Sticker[] = await StickersService.getAll();
  
        // Calcul des statistiques
        const completedCount = missionsWithStatus.filter(
          (m) => m.status === "completed"
        ).length;
        setStats({
          missionsCount: missionsWithStatus.length,
          agentsCount: agentsData.length,
          stickersCount: stickersData.reduce(
            (acc, sticker) => acc + (sticker.count || 0),
            0
          ),
          completedMissionsCount: completedCount,
        });
  
        // Générer les données pour le graphique circulaire
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
  
        // Générer des données pour le graphique de stickers par mois (simulation)
        const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"];
        setStickerMonthlyData(
          months.map((name) => ({
            name,
            stickers: Math.floor(Math.random() * 50) + 30,
          }))
        );
  
        // Générer des alertes
        const newAlerts: Alert[] = [];
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
      } catch (err) {
        console.error("Erreur lors du chargement des données du dashboard", err);
        setError(
          "Impossible de charger les données du tableau de bord. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };
  
    // Charger les données une seule fois au montage du contexte
    useEffect(() => {
      fetchDashboardData();
    }, []);
    // La fonction refresh est simplement fetchDashboardData
    const refresh = fetchDashboardData;
  
    return (
      <DashboardContext.Provider
        value={{
          loading,
          error,
          stats,
          missions,
          agents,
          missionTypeData,
          stickerMonthlyData,
          alerts,
          refresh
        }}
      >
        {children}
      </DashboardContext.Provider>
    );
  };
  
  export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
      throw new Error(
        "useDashboard must be used within a DashboardProvider"
      );
    }
    return context;
  };
  