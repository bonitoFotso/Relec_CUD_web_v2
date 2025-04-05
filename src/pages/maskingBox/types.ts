export interface PanneauStats {
  total: number;
  on: number;
  off: number;
  malfunctioning: number;
}
export interface StatistiqueCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}
export interface StatistiquesCardsProps {
  stats: PanneauStats;
}
