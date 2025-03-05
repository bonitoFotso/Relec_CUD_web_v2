import { Notification } from '../types/header.types';

export const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Nouvelle mise à jour',
    message: 'Une nouvelle version est disponible',
    time: '2 min',
    read: false,
    type: 'info'
  },
  {
    id: 2,
    title: 'Sauvegarde réussie',
    message: 'Vos données ont été sauvegardées',
    time: '1h',
    read: false,
    type: 'success'
  }
]; 