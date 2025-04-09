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
export interface FilterState {
  municipalities: string[];
  networks: string[];
  equipmentTypes: {
    streetlights: boolean;
    metters: boolean;
    cabinets: boolean;
    substations: boolean;
  };
}
