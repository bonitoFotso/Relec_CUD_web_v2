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
}

// Création du contexte
const EquipementContext = createContext<EquipementContextType | undefined>(
  undefined
);

// Interface pour le provider
interface EquipementProviderProps {
  children: ReactNode;
}

export const EquipementProvider: React.FC<EquipementProviderProps> = ({
  children,
}) => {
  const [streetlights, setStreetlights] = useState<EquipementStreetlights[]>(
    []
  );
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

  //modifier la position d'un lampadaire
  const updateStreetlightPosition = useCallback(
    async (id: number, location: string) => {
      setLoading(true);
      setError(null);
      try {
        await EquipementService.updateStreetlightLocation(id, location);
        await fetchStreetlights(); // rafraîchit les données après la mise à jour
      } catch (err) {
        setError("Erreur lors de la mise à jour de la position du lampadaire.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchStreetlights]
  );

  //modifier la position  d'un compteur
  const updateMeterPosition = useCallback(
    async (id: number, location: string) => {
      setLoading(true);
      setError(null);
      try {
        await EquipementService.updateMeterLocation(id, location);
        await fetchMetters(); // rafraîchit les données après la mise à jour
      } catch (err) {
        setError("Erreur lors de la mise à jour de la position du compteur.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );
  //modifier la position  d'un amoire
  const updateCabinetPosition = useCallback(
    async (id: number, location: string) => {
      setLoading(true);
      setError(null);
      try {
        await EquipementService.updateCabinetLocation(id, location);
        await fetchCabinets(); // rafraîchit les données après la mise à jour
      } catch (err) {
        setError("Erreur lors de la mise à jour de la position du cabinet.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  //modifier la position  d'un poste
  const updateSubstationPosition = useCallback(
    async (id: number, location: string) => {
      setLoading(true);
      setError(null);
      try {
        await EquipementService.updateSubstationLocation(id, location);
        await fetchSubstations(); // rafraîchit les données après la mise à jour
      } catch (err) {
        setError("Erreur lors de la mise à jour de la position du cabinet.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [fetchMetters]
  );

  // useEffect(() => {
  //   fetchStreetlights();
  //   fetchMetters();
  //   fetchCabinets();
  //   fetchSubstations();
  // }, [fetchStreetlights, fetchMetters, fetchCabinets, fetchSubstations]);

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
    updateStreetlightPosition,
    updateMeterPosition,
    updateCabinetPosition,
    updateSubstationPosition,
  };

  return (
    <EquipementContext.Provider value={value}>
      {children}
    </EquipementContext.Provider>
  );
};

// Import the hook from the new file
export const useEquipements = () => {
  const context = useContext(EquipementContext);
  if (context === undefined) {
    throw new Error("useEquipements must be used within a EquipementProvider");
  }
  return context;
};
