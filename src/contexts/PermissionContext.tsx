import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
    useEffect,
  } from "react";
  import { AssignRoles, UserService } from "@/services/UsersService";
  
  interface PermissionContextType {
    assignRolesData: AssignRoles | null;
    loading: boolean;
    error: string | null;
    fetchAssignRoles: () => Promise<AssignRoles>;
  }
  
  const PermissionContext = createContext<PermissionContextType | undefined>(undefined);
  
  interface PermissionProviderProps {
    children: ReactNode;
  }
  
  export const PermissionProvider: React.FC<PermissionProviderProps> = ({ children }) => {
    const [assignRolesData, setAssignRolesData] = useState<AssignRoles | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    // Fonction pour récupérer les données assignRoles via UserService
    const fetchAssignRoles = useCallback(async (): Promise<AssignRoles> => {
      setLoading(true);
      setError(null);
      try {
        const data = await UserService.assignRoles();
        setAssignRolesData(data);
        return data;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération des assignations de rôles"
        );
        console.error("Erreur dans fetchAssignRoles :", err);
        throw err;
      } finally {
        setLoading(false);
      }
    }, []);
  
    // Vous pouvez aussi lancer fetchAssignRoles dès le montage du composant si nécessaire
    // useEffect(() => {
    //   fetchAssignRoles();
    // }, [fetchAssignRoles]);
  
    const value = {
      assignRolesData,
      loading,
      error,
      fetchAssignRoles,
    };
  
    return (
      <PermissionContext.Provider value={value}>
        {children}
      </PermissionContext.Provider>
    );
  };
  
  export const usePermissions = (): PermissionContextType => {
    const context = useContext(PermissionContext);
    if (!context) {
      throw new Error("usePermissions doit être utilisé à l'intérieur d'un PermissionProvider");
    }
    return context;
  };
  