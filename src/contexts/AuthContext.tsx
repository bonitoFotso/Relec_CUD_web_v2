// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AuthService, { Role, User } from '../services/AuthService';

// Structure du contexte d'authentification
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roleName: string) => boolean;
  userRoles: Role[];
}

// Création du contexte avec une valeur par défaut
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props pour le AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Composant AuthProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Vérification de l'authentification au chargement
  useEffect(() => {
    let isMounted = true; // Pour éviter les mises à jour après un démontage
  
    const initAuth = async () => {
      if (!isMounted) return;
      setLoading(true);
      try {
        const isValid = await AuthService.validateToken();
        if (isValid) {
          const user = await AuthService.getCurrentUser();
          if (isMounted) {
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        } else {
          if (isMounted) {
            setCurrentUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Erreur d'initialisation");
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    initAuth();
  
    return () => {
      isMounted = false;
    };
  }, []);
  

  // Fonction de connexion
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await AuthService.login({ email, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la connexion');
      setIsAuthenticated(false);
    } 
      setLoading(false);
    
  };

  // Fonction d'inscription
  const register = async (email: string, username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const user = await AuthService.register({ email, username, password });
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de l\'inscription');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Vérifie si l'utilisateur a un rôle spécifique
  const hasRole = (roleName: string): boolean => {
    if (!currentUser) return false;
    return currentUser.roles.some(role => role.name === roleName);
  };

  // Récupère les rôles de l'utilisateur
  const userRoles = currentUser?.roles || [];

  // Valeur du contexte
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    userRoles
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
};

export default AuthProvider;