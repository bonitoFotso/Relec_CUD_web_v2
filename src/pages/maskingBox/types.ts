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
export interface Streetlight {
  id?: string | number;
  municipality?: string;
  is_on_day?: number;
  is_on_night?: number;
  brightness_level?: number;
  on_time?: string | number;
  off_time?: string | number;
  latitude?: number;
  longitude?: number;
  status?: string;
  // Add other properties as needed
}

export interface municipalities {
  municipalities: string[];
}
export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  municipality: string;
  municipalityId: number;
  priority: number; // 1-5, 5 being highest
}

export type RecommendationType =
  | "maintenance"
  | "energy"
  | "pollution"
  | "upgrade"
  | "urgent";

export interface SupportConditionStats {
  condition: string;
  count: number;
  percentage: number;
}

// Define the type for municipality stats
export interface MunicipalityStats {
  id: number;
  name: string;
  totalStreetlights: number;
  supportConditions: SupportConditionStats[];
}

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

// Définir les icônes par défaut
export const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;
// definir les icones specifiques

export const equipmentIcons: Record<string, L.Icon> = {
  Lampadaires: L.icon({
    iconUrl: "/clipart-blue-circle-f058.svg",
    iconSize: [15, 15],
  }),
  Compteurs: L.icon({
    iconUrl: "/compteur-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Amoires: L.icon({
    iconUrl: "/istockphoto-1708045772-612x612-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Substations: L.icon({
    iconUrl: "/8012518-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
};
