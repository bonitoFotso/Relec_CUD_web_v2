// contexts/MissionContext.tsx
import { Mission, MissionService } from '@/services/missions.service';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface MissionContextType {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  fetchMissions: () => Promise<void>;
  getMission: (id: number) => Promise<Mission>;
  createMission: (mission: Mission) => Promise<Mission>;
  deleteMission: (id: number) => Promise<void>;
  assignAgent: (missionId: number, userId: number) => Promise<void>;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

interface MissionProviderProps {
  children: ReactNode;
}

export const MissionProvider: React.FC<MissionProviderProps> = ({ children }) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedMissions = await MissionService.getAll();
      setMissions(fetchedMissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching missions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMission = useCallback(async (id: number): Promise<Mission> => {
    setLoading(true);
    setError(null);
    try {
      const mission = await MissionService.getById(id);
      return mission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching mission';
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
      const newMission = await MissionService.create(mission);
      setMissions((prevMissions) => [...prevMissions, newMission]);
      return newMission;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating mission';
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
      await MissionService.delete(id);
      setMissions((prevMissions) => prevMissions.filter((mission) => mission.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting mission';
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
      await MissionService.assignAgent(missionId, userId);
      // Optionally refresh the mission data after assignment
      const updatedMission = await MissionService.getById(missionId);
      setMissions((prevMissions) =>
        prevMissions.map((m) => (m.id === missionId ? updatedMission : m))
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while assigning agent';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    missions,
    loading,
    error,
    fetchMissions,
    getMission,
    createMission,
    deleteMission,
    assignAgent,
  };

  return <MissionContext.Provider value={value}>{children}</MissionContext.Provider>;
};

export const useMissions = (): MissionContextType => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMissions must be used within a MissionProvider');
  }
  return context;
};
