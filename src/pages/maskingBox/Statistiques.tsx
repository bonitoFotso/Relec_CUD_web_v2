import React from "react";
import { AlertTriangle, CheckCircle, Lightbulb, PowerOff } from "lucide-react";
import { StatistiqueCardProps, StatistiquesCardsProps } from "./types";

const Statistiques: React.FC<StatistiqueCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  const iconComponents: Record<string, React.ElementType> = {
    PowerOff: PowerOff,
    Alert: AlertTriangle,
    Check: CheckCircle,
    Lamp: Lightbulb,
  };
  const IconComponent = iconComponents[icon] || PowerOff;
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

const StatistiquesCard: React.FC<StatistiquesCardsProps> = () => {
  // Configuration des cartes de statistiques
  const statCardsConfig = [
    {
      title: "Total Lampadaires",
      value: 120,
      icon: "Lamp",
      color: "bg-blue-500",
    },
    {
      title: "Lampadaires allumés",
      value: 50, //this shall be dynamic
      icon: "Check",
      color: "bg-green-500",
    },
    {
      title: "Lampadaires éteints",
      value: 30,
      icon: "Alert",
      color: "bg-purple-500",
    },
    {
      title: "Lampadaires en panne",
      value: 40,
      icon: "PowerOff",
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCardsConfig.map((card, index) => (
        <Statistiques key={index} {...card} />
      ))}
    </div>
  );
};

export default StatistiquesCard;
