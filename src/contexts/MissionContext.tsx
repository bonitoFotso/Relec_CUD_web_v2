// contexts/MissionContext.tsx
import { Mission, MissionFormData, MissionsDetailsResponse, MissionsService } from '@/services/missions.service';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MissionContextType {
  missions: Mission[];
  formData: MissionFormData;
  loading: boolean;
  error: string | null;
  fetchMissions: () => Promise<void>;
  fetchFormData: () => Promise<void>;
  getMission: (id: number) => Promise<MissionsDetailsResponse>;
  createMission: (mission: Mission) => Promise<Mission>;
  updateMission: (mission: Mission) => Promise<Mission>;
  deleteMission: (id: number) => Promise<void>;
  assignAgent: (missionId: number, userId: number) => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

interface MissionProviderProps {
  children: ReactNode;
}

export const MissionProvider: React.FC<MissionProviderProps> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [formData, setFormData] = useState<MissionFormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedMissions = await MissionsService.getAll();
      setMissions(fetchedMissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des missions';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFormData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await MissionsService.getCreateFormData();
      setFormData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des données du formulaire';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMission = useCallback(async (id: number): Promise<MissionsDetailsResponse> => {
    setLoading(true);
    setError(null);
    try {
      const mission = await MissionsService.getById(id);
      console.log(mission);
      return mission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération de la mission';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createMission = useCallback(async (mission: Mission): Promise<Mission> => {
    setLoading(true);
    setError(null);
    try {
      const newMission = await MissionsService.create(mission);
      setMissions(prev => [...prev, newMission]);
      return newMission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création de la mission';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMission = useCallback(async (mission: Mission): Promise<Mission> => {
    setLoading(true);
    setError(null);
    try {
      const updatedMission = await MissionsService.update(mission);
      setMissions(prev => 
        prev.map(m => m.id === mission.id ? updatedMission : m)
      );
      return updatedMission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour de la mission';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMission = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await MissionsService.delete(id);
      setMissions(prev => prev.filter(mission => mission.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la suppression de la mission';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignAgent = useCallback(async (missionId: number, userId: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await MissionsService.assignAgent(missionId, userId);
      // Recharger la mission mise à jour
      await MissionsService.getById(missionId) ;
      const missions = await MissionsService.getAll();
      setMissions(missions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'assignation de l\'agent';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    missions,
    formData,
    loading,
    error,
    fetchMissions,
    fetchFormData,
    getMission,
    createMission,
    updateMission,
    deleteMission,
    assignAgent,
  };

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};

export const useMissions = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissions doit être utilisé à l\'intérieur d\'un MissionProvider');
  }
  return context;
};