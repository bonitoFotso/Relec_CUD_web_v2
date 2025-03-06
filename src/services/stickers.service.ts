// api/stickers.service.ts
import apiClient from './apiClient';

export interface Sticker {
  id?: number;
  count: number;
  mission_id: number;
  equipment_type_id: number;
}

export const StickerService = {
  getAll: async (): Promise<Sticker[]> => {
    const { data } = await apiClient.get('/stickers/index');
    return data.stickers || [];
  },
  
  getCreateForm: async (): Promise<Sticker> => {
    const { data } = await apiClient.get('/stickers/create');
    return data;
  },
  
  create: async (sticker: Sticker): Promise<Sticker> => {
    const formData = new FormData();
    Object.entries(sticker).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    
    const { data } = await apiClient.post('/stickers/store', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.sticker;
  },
  
  getById: async (id: number): Promise<Sticker> => {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    const { data } = await apiClient.post('/stickers/show', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data.sticker;
  }
};