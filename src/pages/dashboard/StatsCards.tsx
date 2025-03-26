// src/components/Dashboard/StatsCards.tsx
import React from 'react';
import { Calendar, Users, Tag, CheckCircle } from 'lucide-react';
import { StatsCardsProps, StatCardProps } from './types';

// Composant StatCard individuel
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  // Mapping des noms d'icônes aux composants d'icônes
  const iconComponents: Record<string, React.ElementType> = {
    'Calendar': Calendar,
    'Users': Users,
    'Tag': Tag,
    'CheckCircle': CheckCircle
  };
  
  const IconComponent = iconComponents[icon] || Calendar;
  
  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-950 transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Composant principal pour afficher toutes les cartes de statistiques
const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  // Configuration des cartes de statistiques
  const statCardsConfig = [
    {
      title: "Missions totales",
      value: stats.missionsCount,
      icon: "Calendar",
      color: "bg-blue-500"
    },
    {
      title: "Agents actifs",
      value: stats.agentsCount,
      icon: "Users",
      color: "bg-green-500"
    },
    {
      title: "Stickers utilisés",
      value: stats.stickersCount,
      icon: "Tag",
      color: "bg-purple-500"
    },
    {
      title: "Missions terminées",
      value: stats.completedMissionsCount,
      icon: "CheckCircle",
      color: "bg-amber-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCardsConfig.map((config, index) => (
        <StatCard
          key={index}
          title={config.title}
          value={config.value}
          icon={config.icon}
          color={config.color}
        />
      ))}
    </div>
  );
};

export default StatsCards;