// services/StickersService.ts
import axios, { AxiosResponse } from 'axios';
import apiClient from './apiClient';
import { Mission } from './missions.service';

export interface Sticker {
  id?: number;
  used?: number;
  qrcode_id?: number;
  equipment_type_id?: number;
  mission_id?: number;
  url?: string;
  extension?: string;
  size?: string;
  created_at?: string;
  updated_at?: string;
  count?: number;
}



export interface StickersServiceResponse {
  status: boolean;
  message: string;
  data?: Sticker[];
  sticker?: Sticker;
}

export interface Equipment {
  id: number;
  name: string;
}

export interface StickerFormData {
  data?: Array<Equipment>;
  missions?: Array<Mission>;
}

export const StickersService = {
  getAll: async (): Promise<Sticker[]> => {
    try {
      const response: AxiosResponse<StickersServiceResponse> = await apiClient.get('/stickers/index');
      if (!response.data.status) {
        throw new Error(response.data.message || 'Erreur lors de la récupération des stickers');
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error('Erreur dans StickersService.getAll:', error);
      throw error;
    }
  },
  
  getByMissionId: async (missionId: number): Promise<Sticker[]> => {
    try {
      const stickers = await StickersService.getAll();
      // Filtrer les stickers par mission_id
      return stickers.filter(sticker => sticker.mission_id === missionId);
    } catch (error) {
      console.error(`Erreur dans StickersService.getByMissionId(${missionId}):`, error);
      throw error;
    }
  },
  
  getById: async (id: number): Promise<Sticker> => {
    try {
      const formData = new FormData();
      formData.append('id', id.toString());
      
      const response: AxiosResponse<StickersServiceResponse> = await apiClient.post('/stickers/show', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.data.status || !response.data.sticker) {
        throw new Error(response.data.message || 'Sticker non trouvé');
      }
      
      return response.data.sticker;
    } catch (error) {
      console.error(`Erreur dans StickersService.getById(${id}):`, error);
      throw error;
    }
  },
  
  getCreateFormData: async (): Promise<StickerFormData> => {
    try {
      const response = await apiClient.get('/stickers/create');
      return response.data || {};
    } catch (error) {
      console.error('Erreur dans StickersService.getCreateFormData:', error);
      throw error;
    }
  },
  
  create: async (sticker: Sticker, downloadAsZip = false): Promise<Sticker | Blob> => {
    try {
      const formData = new FormData();
      
      // Ajout de tous les champs à FormData
      Object.entries(sticker).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Si on veut télécharger le zip
      if (downloadAsZip) {
        formData.append('download_as_zip', 'true');
        
        // Créer une instance axios avec un timeout plus long pour les téléchargements volumineux
        const timeoutMs = Math.max(120000, sticker.count ? sticker.count * 1000 : 120000); // Min 2 min, ou 1 sec par étiquette
        
        const response = await apiClient.post('/stickers/store', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
          timeout: timeoutMs, // Timeout dynamique basé sur le nombre d'étiquettes
          // Annulabilité pour permettre d'annuler la requête si nécessaire
          cancelToken: new axios.CancelToken(() => {
            // Stockage optionnel du token dans un état externe pour permettre l'annulation
            // cancelTokenSource = cancel;
          })
        });
        
        return response.data; // Retourne le blob
      }
      // Sinon, on veut juste créer le sticker
      else {
        const response: AxiosResponse<StickersServiceResponse> = await apiClient.post('/stickers/store', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        
        if (!response.data.status || !response.data.sticker) {
          throw new Error(response.data.message || 'Erreur lors de la création du sticker');
        }
        
        return response.data.sticker;
      }
    } catch (error) {
      // Gestion d'erreur améliorée
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error(`La requête a expiré. La génération de ${sticker.count || 'nombreuses'} étiquettes prend plus de temps que prévu.`);
        } else if (error.response?.status === 500) {
          throw new Error("Erreur serveur lors de la génération des étiquettes. Vérifiez les ressources nécessaires sur le serveur.");
        } else if (error.response?.status === 413) {
          throw new Error("Le fichier généré est trop volumineux. Essayez avec moins d'étiquettes.");
        }
      }
      
      console.error('Erreur dans StickersService.create:', error);
      throw error;
    }
  }
};