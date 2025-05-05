// src/components/Dashboard/StatsCards.tsx
import React from "react";
import { Calendar, Users, Tag, CheckCircle } from "lucide-react";
import { StatsCardsProps, StatCardProps } from "./types";

// Composant StatCard individuel
const StatCard: React.FC<StatCardProps> = ({
  bgcolor,
  title,
  value,
  icon,
  color,
}) => {
  // Mapping des noms d'icônes aux composants d'icônes
  const iconComponents: Record<string, React.ElementType> = {
    Calendar: Calendar,
    Users: Users,
    Tag: Tag,
    CheckCircle: CheckCircle,
  };

  const IconComponent = iconComponents[icon] || Calendar;

  return (
    <div
      className={`
        rounded-lg p-6 ${bgcolor} dark:bg-gray-800 transition-all duration-200
        hover:shadow-lg hover:scale-[1.01] }
      `}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-white">{title}</p>
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
      color: "bg-blue-600",
      bgcolor: "bg-blue-200",
    },
    {
      title: "Agents actifs",
      value: stats.agentsCount,
      icon: "Users",
      color: "bg-green-500",
      bgcolor: "bg-green-200",
    },
    {
      title: "Plaquettes d'identifications utilisés",
      value: stats.stickersCount,
      icon: "Tag",
      color: "bg-purple-500",
      bgcolor: "bg-purple-200",
    },
    {
      title: "Plaquettes d'identificattions générées",
      value: stats.completedMissionsCount,
      icon: "CheckCircle",
      color: "bg-amber-500",
      bgcolor: "bg-amber-100",
    },
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
          bgcolor={config.bgcolor}
        />
      ))}
    </div>
  );
};

export default StatsCards;
