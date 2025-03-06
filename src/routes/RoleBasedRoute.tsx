// src/components/RoleBasedRoute.tsx

import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Navigate } from 'react-router-dom';

interface RoleBasedRouteProps {
  element: React.ReactNode;
  allowedRoles: string[];
  redirectPath?: string;
}

/**
 * Composant pour protéger les routes basées sur les rôles de l'utilisateur
 * @param element - Le composant à afficher si l'utilisateur a les permissions
 * @param allowedRoles - Liste des rôles autorisés à accéder à cette route
 * @param redirectPath - Chemin de redirection si l'accès est refusé
 */
const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  element, 
  allowedRoles, 
  redirectPath = '/unauthorized' 
}) => {
  const { isAuthenticated, loading, hasRole } = useAuth();
  
  // Afficher un indicateur de chargement pendant la vérification
  if (loading) {
    return <div>Chargement...</div>;
  }
  
  // Vérifier l'authentification d'abord
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Vérifier ensuite les rôles
  const hasPermission = allowedRoles.some(role => hasRole(role));
  
  if (!hasPermission) {
    return <Navigate to={redirectPath} />;
  }
  
  // Si tout est bon, afficher le composant
  return <>{element}</>;
};

export default RoleBasedRoute;