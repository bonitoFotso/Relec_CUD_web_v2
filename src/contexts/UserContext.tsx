import { User, UserService } from "@/services/UsersService";
import { Mission, MissionsService } from "@/services/missions.service";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { useDashboard } from "./DashboardContext";

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  roles: string[];
  initialized: boolean;
  getRoles: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  getUserById: (id: number) => User | undefined;
  createUser: (user: User) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  assignPermissions: (roleId: number, permissions: number[]) => Promise<void>;
  fetchAssignRoles: () => Promise<void>;
  getAgentMissions: (userId: number) => Promise<Mission[]>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { refresh } = useDashboard();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await UserService.getAll();
      setUsers(fetchedUsers);
      setInitialized(true); // Marquer comme chargé
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des utilisateurs"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les utilisateurs au premier rendu
  useEffect(() => {
    if (!initialized) {
      fetchUsers();
    }
  }, [initialized, fetchUsers]);

  const getUserById = useCallback(
    (id: number): User | undefined => {
      return users.find((user) => user.id === id);
    },
    [users]
  );

  const createUser = useCallback(async (user: User): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await UserService.create(user);
      setUsers((prevUsers) => [...prevUsers, newUser]); // Mise à jour immédiate
      refresh(); // Rafraîchir le dashboard
      return newUser;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la création de l'utilisateur"
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const updateUser = useCallback(async (user: User): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await UserService.update(user);
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );
      refresh();
      return updatedUser;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour de l'utilisateur"
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const deleteUser = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await UserService.delete(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la suppression de l'utilisateur"
      );
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const getRoles = useCallback(async () => {
    if (roles.length > 0) return; // Empêcher de recharger les rôles s'ils existent déjà
    const fetchedRoles = await UserService.getRoles();
    setRoles(fetchedRoles);
  }, [roles]);

  const assignPermissions = useCallback(
    async (roleId: number, permissions: number[]): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await UserService.assignPermissions(roleId, permissions);
        refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de l'assignation des permissions"
        );
        console.error(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  // Nouvelle méthode assignRoles utilisant l'API GET /users/assignroles

  const fetchAssignRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("11");
      await UserService.assignRoles();
      console.log("22");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de la récupération des assignroles"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  const getAgentMissions = useCallback(
    async (userId: number): Promise<Mission[]> => {
      try {
        return await MissionsService.getMissionsByAgent(userId);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des missions de l'agent:",
          error
        );
        throw error;
      }
    },
    []
  );

  const value = {
    users,
    loading,
    error,
    roles,
    initialized,
    getRoles,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    assignPermissions,
    fetchAssignRoles,
    getAgentMissions,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUsers doit être utilisé à l'intérieur d'un UserProvider");
  }
  return context;
};
