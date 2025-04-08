export interface PanneauStats {
  total: number;
  allumés: number;
  éteints: number;
  défectueux: number;
}
export interface StatistiqueCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  cardBackground: string;
  subtitle: string;
  stats: number;
  unit: string;
}
export interface StatistiquesCardsProps {
  stats: PanneauStats;
}
