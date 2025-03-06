// contexts/UserContext.tsx
import { User, UserService } from '@/services/UsersService';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  createUser: (user: User) => Promise<User>;
  updateUser: (user: User) => Promise<User>;
  deleteUser: (id: number) => Promise<void>;
  assignPermissions: (roleId: number, permissions: number[]) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedUsers = await UserService.getAll();
      console.log(fetchedUsers);
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (user: User): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await UserService.create(user);
      // setUsers((prevUsers) => [...prevUsers, newUser]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating user';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (user: User): Promise<User> => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await UserService.update(user);
      setUsers((prevUsers) => 
        prevUsers.map((u) => (u.id === user.id ? updatedUser : u))
      );
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while updating user';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await UserService.delete(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting user';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignPermissions = useCallback(async (roleId: number, permissions: number[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await UserService.assignPermissions(roleId, permissions);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while assigning permissions';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    assignPermissions,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUsers = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};