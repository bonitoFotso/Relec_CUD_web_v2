// api/missions.service.ts
import apiClient from './apiClient';

export interface Mission {
  id?: number;
  user_id: number;
  title: string;
  description?: string;
  street_id: number;
  intervention_type_id: number;
}

export const MissionService = {
  getAll: async (): Promise<Mission[]> => {
    const { data } = await apiClient.get('/missions/index');
    return data.missions || [];
  },
  
  getCreateForm: async (): Promise<Mission> => {
    const { data } = await apiClient.get('/missions/create');
    return data;
  },
  
  create: async (mission: Mission): Promise<Mission> => {
    const formData = new FormData();
    Object.entries(mission).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    const { data } = await apiClient.post('/missions/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.mission;
  },
  
  getById: async (id: number): Promise<Mission> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    const { data } = await apiClient.post('/missions/show', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.mission;
  },
  
  getEditForm: async (id: number): Promise<Mission> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    const { data } = await apiClient.post('/missions/edit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },
  
  delete: async (id: number): Promise<void> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    await apiClient.post('/missions/delete', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  assignAgent: async (missionId: number, userId: number): Promise<void> => {
    const formData = new FormData();
    formData.append('mission_id', missionId.toString());
    formData.append('user_id', userId.toString());
    
    await apiClient.post('/missions/assign-mission-agents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};