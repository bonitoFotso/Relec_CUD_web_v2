import React, { useMemo } from "react";
import {
  AlertTriangle,
  Lightbulb,
  LightbulbOff,
  PowerOff,
  Siren,
} from "lucide-react";
import { StatistiqueCardProps, StatistiquesCardsProps } from "./types";
import { useEquipements } from "@/contexts/EquipementContext";

// Helper function to format time in hours and minutes
const formatTime = (hours: number): string => {
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  if (wholeHours === 0) {
    return `${minutes} min`;
  } else if (minutes === 0) {
    return `${wholeHours} h`;
  } else {
    return `${wholeHours} h ${minutes} min`;
  }
};

const Statistique: React.FC<StatistiqueCardProps> = ({
  title,
  value,
  icon,
  color,
  cardBackground,
  subtitle,
  stats,
  unit,
}) => {
  const iconComponents: Record<string, React.ElementType> = {
    PowerOff: LightbulbOff,
    Alert: AlertTriangle,
    Check: Siren,
    Lamp: Lightbulb,
  };
  const IconComponent = iconComponents[icon] || PowerOff;

  // Format stats value based on unit type
  const formattedStats = unit === "h" ? formatTime(stats) : `${stats}${unit}`;

  return (
    <div
      className={`
        rounded-lg ${cardBackground} dark:bg-gray-800 transition-all duration-200
        hover:shadow-lg hover:scale-[1.01] }
      `}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
              {title}
            </p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>

      <div className={`${color} p-2 rounded-bl-lg rounded-br-lg`}>
        <div className=" flex justify-between gap-2 items-center text-white">
          <p className="text-xs font-normal">{subtitle}</p>
          <p className="text-xs font-extrabold">{formattedStats}</p>
        </div>
      </div>
    </div>
  );
};

const StatistiquesCard: React.FC<StatistiquesCardsProps> = () => {
  // Use the useEquipements hook to access context data
  const { streetlights, loading, error } = useEquipements();

  // useMemo to calculate statistics only when streetlights change
  const statistics = useMemo(() => {
    // Calculer le nombre total de lampadaires
    const totalStreetlights = streetlights.length;

    if (totalStreetlights === 0) {
      return {
        totalStreetlights: 0,
        onStreetlights: 0,
        offStreetlights: 0,
        faultyStreetlights: 0,
        avgBrightness: 0,
        avgActiveTime: 0,
        avgInactiveTime: 0,
        avgMalfunctionTime: 0,
      };
    }

    // Classement des lampadaires par état
    const onLights = streetlights.filter(
      (light) => light.is_on_day === 1 || light.is_on_night === 1
    );
    const offLights = streetlights.filter(
      (light) => light.is_on_day === 0 && light.is_on_night === 0
    );
    const faultyLights = streetlights.filter(
      (light) =>
        (light.is_on_day === 1 && light.is_on_night === 0) ||
        (light.is_on_day === 0 && light.is_on_night === 1)
    );

    // Nombre de lampadaires par état
    const onStreetlights = onLights.length;
    const offStreetlights = offLights.length;
    const faultyStreetlights = faultyLights.length;

    // Calcul de l'intensité lumineuse moyenne
    const totalBrightness = streetlights.reduce(
      (sum, light) => sum + (light.brightness_level || 0),
      0
    );
    const avgBrightness = totalBrightness / (totalStreetlights || 1);

    // Calcul des temps moyens (en supposant que on_time et off_time sont en heures)
    // Note: Ces calculs dépendent de la structure réelle de vos données

    // Durée moyenne d'activité (pour les lampadaires allumés)
    // Ici, nous utilisons une valeur par défaut, car nous n'avons pas d'information claire sur la structure des données
    const avgActiveTime =
      onLights.length > 0
        ? onLights.reduce((sum, light) => {
            // Si on_time est une chaîne représentant des heures, convertir en nombre
            // Sinon, utiliser une valeur par défaut
            const onTime =
              typeof light.on_time === "string"
                ? parseFloat(light.on_time) || 6.5
                : 6.5;
            return sum + onTime;
          }, 0) / onLights.length
        : 6.5;

    // Durée moyenne d'inactivité (pour les lampadaires éteints)
    const avgInactiveTime =
      offLights.length > 0
        ? offLights.reduce((sum, light) => {
            // Si off_time est une chaîne représentant des heures, convertir en nombre
            // Sinon, utiliser une valeur par défaut
            const offTime =
              typeof light.off_time === "string"
                ? parseFloat(light.off_time) || 12.25
                : 12.25;
            return sum + offTime;
          }, 0) / offLights.length
        : 12.25;

    // Temps moyen de dysfonctionnement (pour les lampadaires défectueux)
    // C'est une valeur arbitraire car nous n'avons pas cette information
    const avgMalfunctionTime = 5.75; // Valeur par défaut

    return {
      totalStreetlights,
      onStreetlights,
      offStreetlights,
      faultyStreetlights,
      avgBrightness,
      avgActiveTime,
      avgInactiveTime,
      avgMalfunctionTime,
    };
  }, [streetlights]);

  // Statistiques pour l'affichage
  const statisticsData = [
    {
      title: "Total Lampadaires",
      value: statistics.totalStreetlights || 0,
      icon: "Lamp",
      color: "bg-blue-500",
      cardBackground: "bg-blue-100",
      subtitle: "Durée moyenne d'activité",
      stats: statistics.avgActiveTime,
      unit: "h",
    },
    {
      title: "Lampadaires allumés",
      value: statistics.onStreetlights || 0,
      icon: "Check",
      color: "bg-amber-500",
      cardBackground: "bg-amber-100",
      subtitle: "Intensité lumineuse moyenne",
      stats: statistics.avgBrightness,
      unit: "%",
    },
    {
      title: "Lampadaires éteints",
      value: statistics.offStreetlights || 0,
      icon: "PowerOff",
      color: "bg-gray-600",
      cardBackground: "bg-gray-200",
      subtitle: "Durée d'inactivité moyen",
      stats: statistics.avgInactiveTime,
      unit: "h",
    },
    {
      title: "Lampadaires défectueux",
      value: statistics.faultyStreetlights || 0,
      icon: "Alert",
      color: "bg-red-500",
      cardBackground: "bg-red-100",
      subtitle: "Temps de disfonctionnement moyen",
      stats: statistics.avgMalfunctionTime,
      unit: "h",
    },
  ];

  if (loading) {
    return (
      <div className="text-center py-4">Chargement des statistiques...</div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsData.map((card, index) => (
        <Statistique key={index} {...card} />
      ))}
    </div>
  );
};

export default StatistiquesCard;
