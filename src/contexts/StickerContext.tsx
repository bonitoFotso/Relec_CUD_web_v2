// contexts/StickerContext.tsx
import { Sticker, StickerService } from '@/services/stickers.service';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface StickerContextType {
  stickers: Sticker[];
  loading: boolean;
  error: string | null;
  fetchStickers: () => Promise<void>;
  getSticker: (id: number) => Promise<Sticker>;
  createSticker: (sticker: Sticker) => Promise<Sticker>;
}

const StickerContext = createContext<StickerContextType | undefined>(undefined);

interface StickerProviderProps {
  children: ReactNode;
}

export const StickerProvider: React.FC<StickerProviderProps> = ({ children }) => {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStickers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedStickers = await StickerService.getAll();
      setStickers(fetchedStickers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching stickers');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getSticker = useCallback(async (id: number): Promise<Sticker> => {
    setLoading(true);
    setError(null);
    try {
      const sticker = await StickerService.getById(id);
      return sticker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching sticker';
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
      const newSticker = await StickerService.create(sticker);
      setStickers((prevStickers) => [...prevStickers, newSticker]);
      return newSticker;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating sticker';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    stickers,
    loading,
    error,
    fetchStickers,
    getSticker,
    createSticker,
  };

  return <StickerContext.Provider value={value}>{children}</StickerContext.Provider>;
};

export const useStickers = (): StickerContextType => {
  const context = useContext(StickerContext);
  if (!context) {
    throw new Error('useStickers must be used within a StickerProvider');
  }
  return context;
};