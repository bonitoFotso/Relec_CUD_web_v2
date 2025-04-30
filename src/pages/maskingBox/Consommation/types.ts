import {
  EquipementCabinets,
  EquipementMetters,
  EquipementStreetlights,
  EquipementSubstations,
} from "@/services/EquipementService";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface StreetlightType {
  id: number;
  name: string;
  category: "LED" | "Decharges";
  puissanceLumineuse: number; // en lumens
  puissanceConsommee: number; // en Watts
  dureeUtilisation: number; // en heures par nuit
  quantite: number; // nombre de lampadaires de ce type
  couleur: string; // couleur pour les graphiques
}

export interface ConsommationContextType {
  streetlightTypes: StreetlightType[];
  currentPeriod: string;
  setCurrentPeriod: (period: string) => void;
  data: any[];
  totals: Record<string, number>;
  formatXAF: (value: ValueType) => string;
  calculerConsommationMoyenne: (type: StreetlightType) => number;
  calculerRendement: (type: StreetlightType) => string;
  filterByCategory: (category: "LED" | "Decharges" | "All") => any[];
  filterTotalsByCategory: (
    category: "LED" | "Decharges" | "All"
  ) => Record<string, number>;
  loading: boolean;
  error: string | null;
}

// Définition du type du contexte
export interface EquipementContextType {
  streetlights: EquipementStreetlights[];
  metters: EquipementMetters[];
  cabinets: EquipementCabinets[];
  substations: EquipementSubstations[];
  loading: boolean;
  error: string | null;
  fetchStreetlights: () => Promise<void>;
  fetchMetters: () => Promise<void>;
  fetchCabinets: () => Promise<void>;
  fetchSubstations: () => Promise<void>;
  updateStreetlightPosition: (id: number, location: string) => Promise<void>;
  updateMeterPosition: (id: number, location: string) => Promise<void>;
  updateCabinetPosition: (id: number, location: string) => Promise<void>;
  updateSubstationPosition: (id: number, location: string) => Promise<void>;
}
