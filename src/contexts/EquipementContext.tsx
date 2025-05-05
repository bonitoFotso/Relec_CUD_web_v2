/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
  useContext,
} from "react";

import EquipementService, {
  EquipementStreetlights,
  EquipementMetters,
  EquipementCabinets,
  EquipementSubstations,
} from "@/services/EquipementService";
import { useAuth } from "./AuthContext";

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
  updateStreetlightPosition: (id: number, location: string) => Promise<void>;
  updateMeterPosition: (id: number, location: string) => Promise<void>;
  updateCabinetPosition: (id: number, location: string) => Promise<void>;
  updateSubstationPosition: (id: number, location: string) => Promise<void>;
  refreshAll: () => Promise<void>;
}

const EquipementContext = createContext<EquipementContextType | undefined>(undefined);

interface EquipementProviderProps {
  children: ReactNode;
}

export const EquipementProvider: React.FC<EquipementProviderProps> = ({ children }) => {
  const [equipments, setEquipments] = useState({
    streetlights: [] as EquipementStreetlights[],
    metters: [] as EquipementMetters[],
    cabinets: [] as EquipementCabinets[],
    substations: [] as EquipementSubstations[],
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null as string | null,
  });
  const { isAuthenticated } = useAuth(); // Vérifie si l'utilisateur est connecté
  // Fonction générique pour gérer les requêtes
  const handleRequest = async <T,>(
    request: () => Promise<T>,
    errorMessage: string
  ): Promise<T | undefined> => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    try {
      return await request();
    } catch (err) {
      const message = err instanceof Error ? err.message : errorMessage;
      setStatus(prev => ({ ...prev, error: message }));
      console.error(err);
      return undefined;
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Récupération des données
  const fetchStreetlights = useCallback(async () => {
    const data = await handleRequest(
      EquipementService.getAllStreetlights,
      "Erreur lors de la récupération des lampadaires"
    );
    if (data) setEquipments(prev => ({ ...prev, streetlights: data }));
  }, [isAuthenticated]);

  const fetchMetters = useCallback(async () => {
    const data = await handleRequest(
      EquipementService.getAllMetters,
      "Erreur lors de la récupération des compteurs"
    );
    if (data) setEquipments(prev => ({ ...prev, metters: data }));
  }, [isAuthenticated]);

  const fetchCabinets = useCallback(async () => {
    const data = await handleRequest(
      EquipementService.getAllCabinets,
      "Erreur lors de la récupération des armoires"
    );
    if (data) setEquipments(prev => ({ ...prev, cabinets: data }));
  }, [isAuthenticated]);

  const fetchSubstations = useCallback(async () => {
    const data = await handleRequest(
      EquipementService.getAllSubstations,
      "Erreur lors de la récupération des sous-stations"
    );
    if (data) setEquipments(prev => ({ ...prev, substations: data }));
  }, [isAuthenticated]);

  // Mise à jour des positions
  const updateStreetlightPosition = useCallback(
    async (id: number, location: string) => {
      await handleRequest(
        () => EquipementService.updateStreetlightLocation(id, location),
        "Erreur lors de la mise à jour du lampadaire"
      );
      await fetchStreetlights();
    },
    [fetchStreetlights]
  );

  const updateMeterPosition = useCallback(
    async (id: number, location: string) => {
      await handleRequest(
        () => EquipementService.updateMeterLocation(id, location),
        "Erreur lors de la mise à jour du compteur"
      );
      await fetchMetters();
    },
    [fetchMetters]
  );

  const updateCabinetPosition = useCallback(
    async (id: number, location: string) => {
      await handleRequest(
        () => EquipementService.updateCabinetLocation(id, location),
        "Erreur lors de la mise à jour de l'armoire"
      );
      await fetchCabinets();
    },
    [fetchCabinets]
  );

  const updateSubstationPosition = useCallback(
    async (id: number, location: string) => {
      await handleRequest(
        () => EquipementService.updateSubstationLocation(id, location),
        "Erreur lors de la mise à jour de la sous-station"
      );
      await fetchSubstations();
    },
    [fetchSubstations]
  );

  // Rafraîchir toutes les données
  const refreshAll = useCallback(async () => {
    setStatus(prev => ({ ...prev, loading: true, error: null }));
    try {
      await Promise.all([fetchStreetlights(), fetchMetters(), fetchCabinets(), fetchSubstations()]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur lors du rafraîchissement";
      setStatus(prev => ({ ...prev, error: message }));
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [fetchStreetlights, fetchMetters, fetchCabinets, fetchSubstations]);

  // Chargement initial
  // useEffect(() => {
  //   refreshAll();
  // }, [refreshAll]);

  // Valeur du contexte
  const value = {
    streetlights: equipments.streetlights,
    metters: equipments.metters,
    cabinets: equipments.cabinets,
    substations: equipments.substations,
    loading: status.loading,
    error: status.error,
    fetchStreetlights,
    fetchMetters,
    fetchCabinets,
    fetchSubstations,
    updateStreetlightPosition,
    updateMeterPosition,
    updateCabinetPosition,
    updateSubstationPosition,
    refreshAll,
  };

  return (
    <EquipementContext.Provider value={value}>
      {children}
    </EquipementContext.Provider>
  );
};

export const useEquipements = (): EquipementContextType => {
  const context = useContext(EquipementContext);
  if (context === undefined) {
    throw new Error("useEquipements must be used within a EquipementProvider");
  }
  return context;
};