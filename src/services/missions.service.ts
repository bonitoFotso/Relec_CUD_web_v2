// services/MissionsService.ts
import { AxiosResponse } from 'axios';
import apiClient from './apiClient';
import { Sticker } from './stickers.service';
export interface Mission {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  street_id: number;
  intervention_type_id: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
  // Relations potentielles
  user?: {
    id: number;
    name: string;
  };
  street?: {
    id: number;
    name: string;
  };
  intervention_type?: {
    id: number;
    name: string;
  };
  agents?: Array<{
    id: number;
    name: string;
  }>;
}

export interface MissionsDetailsResponse {
  agents: Array<{id: number; name: string}>;
  mission: Mission;
  stickers: Sticker[];
}

export interface MissionsDetailsServiceResponse {
  status: boolean;
  message: string;
  data: MissionsDetailsResponse;
}


export interface MissionsServiceResponse {
  status: boolean;
  message: string;
  mission?: Mission;
  data?: Mission[];
}

export interface MissionFormData {
  agents?: Array<{id: number; name: string}>;
  streets?: Array<{id: number; name: string}>;
  interventions?: Array<{id: number; name: string}>;
}

export const MissionsService = {
  getAll: async (): Promise<Mission[]> => {
    try {
      const response: AxiosResponse<MissionsServiceResponse> = await apiClient.get('/missions/index');
      if (!response.data.status) {
        throw new Error(response.data.message || 'Erreur lors de la récupération des missions');
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur dans MissionsService.getAll:', error);
      throw error;
    }
  },
  
  getById: async (id: number): Promise<MissionsDetailsResponse> => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      
      const response: AxiosResponse<MissionsDetailsServiceResponse> = await apiClient.post('/missions/show', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      
      if (!response.data.status || !response.data) {
        throw new Error(response.data.message || 'Mission non trouvée');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erreur dans MissionsService.getById(${id}):`, error);
      throw error;
    }
  },
  
  getCreateFormData: async (): Promise<MissionFormData> => {
    try {
      const response = await apiClient.get('/missions/create');
      return response.data || {};
    } catch (error) {
      console.error('Erreur dans MissionsService.getCreateFormData:', error);
      throw error;
    }
  },
  
  create: async (mission: Mission): Promise<Mission> => {
    try {
      const formData = new FormData();
      
      // Ajout de tous les champs à FormData
      Object.entries(mission).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      const response: AxiosResponse<MissionsServiceResponse> = await apiClient.post('/missions/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.status || !response.data.mission) {
        throw new Error(response.data.message || 'Erreur lors de la création de la mission');
      }
      
      return response.data.mission;
    } catch (error) {
      console.error('Erreur dans MissionsService.create:', error);
      throw error;
    }
  },
  
  getEditFormData: async (id: number): Promise<{mission: Mission; formData: MissionFormData}> => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      
      const response = await apiClient.post('/missions/edit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.status) {
        throw new Error(response.data.message || 'Erreur lors de la récupération des données de la mission');
      }
      
      return {
        mission: response.data.mission,
        formData: response.data.data || {}
      };
    } catch (error) {
      console.error(`Erreur dans MissionsService.getEditFormData(${id}):`, error);
      throw error;
    }
  },
  
  update: async (mission: Mission): Promise<Mission> => {
    try {
      if (!mission.id) {
        throw new Error('ID de mission requis pour la mise à jour');
      }
      
      const formData = new FormData();
      
      // Ajout de tous les champs à FormData
      Object.entries(mission).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      const response: AxiosResponse<MissionsServiceResponse> = await apiClient.post('/missions/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.status || !response.data.mission) {
        throw new Error(response.data.message || 'Erreur lors de la mise à jour de la mission');
      }
      
      return response.data.mission;
    } catch (error) {
      console.error(`Erreur dans MissionsService.update(${mission.id}):`, error);
      throw error;
    }
  },
  
  delete: async (id: number): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      
      const response: AxiosResponse<MissionsServiceResponse> = await apiClient.post('/missions/delete', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.status) {
        throw new Error(response.data.message || 'Erreur lors de la suppression de la mission');
      }
    } catch (error) {
      console.error(`Erreur dans MissionsService.delete(${id}):`, error);
      throw error;
    }
  },
  
  assignAgent: async (missionId: number, userId: number): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('mission_id', missionId.toString());
      formData.append('user_id', userId.toString());
      
      const response = await apiClient.post('/missions/assign-mission-agents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.status) {
        throw new Error(response.data.message || 'Erreur lors de l\'assignation de l\'agent à la mission');
      }
    } catch (error) {
      console.error(`Erreur dans MissionsService.assignAgent(${missionId}, ${userId}):`, error);
      throw error;
    }
  }
};