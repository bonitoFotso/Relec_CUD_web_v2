import { Companie, CompanieService, CompanieWithUsers } from "@/services/companieService";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

interface CompanieContextType {
  companies: Companie[];
  loading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  createCompanie: (compagnie: Companie) => Promise<Companie>;
  deleteCompanie: (id: number) => Promise<void>;
  getAllUserId: (id: number) => Promise<CompanieWithUsers>;
}

const CompanieContext = createContext<CompanieContextType | undefined>(
  undefined
);

interface CompanieProviderProps {
  children: ReactNode;
}

export const CompanieProvider: React.FC<CompanieProviderProps> = ({
  children,
}) => {
  const [companies, setCompanies] = useState<Companie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCompagnies = await CompanieService.getAll();
      setCompanies(fetchedCompagnies);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des compagnies"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  const createCompanie = useCallback(
    async (compagnie: Companie): Promise<Companie> => {
      setLoading(true);
      setError(null);
      try {
        const newCompanie = await CompanieService.create(compagnie);
        setCompanies((prevCompanies) => [...prevCompanies, newCompanie]); // Mise à jour immédiate

        return newCompanie;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la création de la companie"
        );
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCompanie = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await CompanieService.delete(id);
      setCompanies((prevCompanies) =>
        prevCompanies.filter((companie) => companie.id !== id)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de la companie"
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllUserId = useCallback(async (id: number): Promise<CompanieWithUsers> => {
    const data = await CompanieService.getAllUserId(id);
    return data
  },[])


  const value = {
    companies,
    loading,
    error,
    fetchCompanies,
    createCompanie,
    deleteCompanie,
    getAllUserId,
  };

  return (
    <CompanieContext.Provider value={value}>
      {children}
    </CompanieContext.Provider>
  );
};

export const useCompanies = (): CompanieContextType => {
  const context = useContext(CompanieContext);
  if (!context) {
    throw new Error(
      "useCompanies doit être utilisé à l'intérieur d'un CompanieProvider"
    );
  }
  return context;
};
