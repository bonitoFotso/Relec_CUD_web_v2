import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import EquipementService, { EquipementStreetlights, EquipementMetters, EquipementCabinets, EquipementSubstations } from "@/services/EquipementService";

// Définition du type du contexte
interface EquipementContextType {
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
}

// Création du contexte
const EquipementContext = createContext<EquipementContextType | undefined>(undefined);

// Interface pour le provider
interface EquipementProviderProps {
  children: ReactNode;
}

export const EquipementProvider: React.FC<EquipementProviderProps> = ({ children }) => {
  const [streetlights, setStreetlights] = useState<EquipementStreetlights[]>([]);
  const [metters, setMetters] = useState<EquipementMetters[]>([]);
  const [cabinets, setCabinets] = useState<EquipementCabinets[]>([]);
  const [substations, setSubstations] = useState<EquipementSubstations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération des lampadaires
  const fetchStreetlights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EquipementService.getAllStreetlights();
      setStreetlights(data);
    } catch (err) {
      setError("Erreur lors de la récupération des lampadaires.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupération des compteurs
  const fetchMetters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EquipementService.getAllMetters();
      setMetters(data);
    } catch (err) {
      setError("Erreur lors de la récupération des compteurs.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupération des armoires électriques
  const fetchCabinets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EquipementService.getAllCabinets();
      setCabinets(data);
    } catch (err) {
      setError("Erreur lors de la récupération des armoires électriques.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Récupération des sous-stations
  const fetchSubstations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EquipementService.getAllSubstations();
      setSubstations(data);
    } catch (err) {
      setError("Erreur lors de la récupération des sous-stations.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreetlights();
    fetchMetters();
    fetchCabinets();
    fetchSubstations();
  }, [fetchStreetlights, fetchMetters, fetchCabinets, fetchSubstations]);

  // Valeur du contexte
  const value = {
    streetlights,
    metters,
    cabinets,
    substations,
    loading,
    error,
    fetchStreetlights,
    fetchMetters,
    fetchCabinets,
    fetchSubstations,
  };

  return <EquipementContext.Provider value={value}>{children}</EquipementContext.Provider>;
};

// Hook pour utiliser le contexte
export const useEquipements = (): EquipementContextType => {
  const context = useContext(EquipementContext);
  if (!context) {
    throw new Error("useEquipements doit être utilisé à l'intérieur d'un EquipementProvider");
  }
  return context;
};
