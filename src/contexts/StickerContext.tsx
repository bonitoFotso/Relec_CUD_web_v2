// contexts/StickerContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { StickersService, Sticker, StickerFormData } from '@/services/stickers.service';

interface StickerContextType {
  stickers: Sticker[];
  formData: StickerFormData;
  loading: boolean;
  error: string | null;
  fetchStickers: () => Promise<void>;
  fetchFormData: () => Promise<void>;
  getSticker: (id: number) => Promise<Sticker>;
  getStickersByMission: (missionId: number) => Promise<Sticker[]>;
  createSticker: (sticker: Sticker) => Promise<Sticker>;
}

const StickerContext = createContext<StickerContextType | undefined>(undefined);

interface StickerProviderProps {
  children: ReactNode;
}

export const StickerProvider: React.FC<StickerProviderProps> = ({ children }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [formData, setFormData] = useState<StickerFormData>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStickers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedStickers = await StickersService.getAll();
      setStickers(fetchedStickers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des stickers';
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
      const data = await StickersService.getCreateFormData();
      setFormData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des données du formulaire';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSticker = useCallback(async (id: number): Promise<Sticker> => {
    setLoading(true);
    setError(null);
    try {
      const sticker = await StickersService.getById(id);
      return sticker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération du sticker';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStickersByMission = useCallback(async (missionId: number): Promise<Sticker[]> => {
    setLoading(true);
    setError(null);
    try {
      const missionStickers = await StickersService.getByMissionId(missionId);
      return missionStickers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la récupération des stickers de la mission';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createSticker = useCallback(async (sticker: Sticker): Promise<Sticker> => {
    setLoading(true);
    setError(null);
    try {
      const newSticker = await StickersService.create(sticker) as Sticker;
      setStickers(prev => [...prev, newSticker]);
      return newSticker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la création du sticker';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    stickers,
    formData,
    loading,
    error,
    fetchStickers,
    fetchFormData,
    getSticker,
    getStickersByMission,
    createSticker,
  };

  return <StickerContext.Provider value={value}>{children}</StickerContext.Provider>;
};

export const useStickers = (): StickerContextType => {
  const context = useContext(StickerContext);
  if (!context) {
    throw new Error('useStickers doit être utilisé à l\'intérieur d\'un StickerProvider');
  }
  return context;
};