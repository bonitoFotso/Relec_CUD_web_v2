// src/components/Dashboard/types.ts
import { User } from '@/services/UsersService';
import { Mission } from '@/services/missions.service';

export interface DashboardStats {
  missionsCount: number;
  agentsCount: number;
  stickersCount: number;
  completedMissionsCount: number;
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: string; // Nom de l'icône pour faciliter l'importation dynamique
  color: string;
}

export interface PieChartData {
  name: string;
  value: number;
}

export interface BarChartData {
  name: string;
  stickers: number;
}

export interface MissionsTableProps {
  missions: Mission[];
  isLoading: boolean;
}

export interface AgentsListProps {
  agents: User[];
  isLoading: boolean;
}

export interface ChartProps {
  data: PieChartData[] | BarChartData[];
}

export interface StatsCardsProps {
  stats: DashboardStats;
}

export type AlertType = 'warning' | 'error';

export interface Alert {
  type: AlertType;
  icon: string;
  message: string;
}

export interface AlertProps {
  type: AlertType;
  icon: React.ElementType;
  message: string;
}

export interface AlertsSectionProps {
  alerts: Alert[];
}