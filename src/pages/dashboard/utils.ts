// src/components/Dashboard/utils.ts
import { AlertCircle, Clock } from 'lucide-react';
import { AlertType } from './types';

/**
 * Fonction utilitaire pour mapper les IDs de type d'intervention aux noms
 */
export const getInterventionTypeName = (id: number): string => {
  const types: Record<number, string> = {
    1:'Déploiement',
    2:'Dépannage',
    3:'Identification',
    4:'Installation',
    5:'Inventaire',
    6:'Maintenance',
    7:'Rapport',
    8:'Visite'
  };
  return types[id] || `Type ${id}`;
};

/**
 * Obtient l'icône React correspondant au nom d'icône
 */
export const getIconComponent = (iconName: string) => {
  const icons: Record<string, React.ElementType> = {
    'AlertCircle': AlertCircle,
    'Clock': Clock,
    // Ajouter d'autres icônes au besoin
  };
  return icons[iconName] || AlertCircle;
};

/**
 * Obtient les styles pour un type d'alerte spécifique
 */
export const getAlertStyles = (type: AlertType) => {
  const styles = {
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      icon: 'text-yellow-400'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-700',
      icon: 'text-red-400'
    }
  };
  
  return styles[type];
};

/**
 * Obtient les styles pour un statut de mission
 */
export const getMissionStatusStyles = (status: string | undefined) => {
  switch (status) {
    case 'Terminée':
      return 'bg-green-100 text-green-800';
    case 'En attente':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-blue-100 text-blue-800';
  }
};
