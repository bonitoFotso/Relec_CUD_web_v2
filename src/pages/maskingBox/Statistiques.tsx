// import React from "react";
// import {
//   AlertTriangle,
//   CheckCircle,
//   Lightbulb,
//   PowerOff,
//   Siren,
// } from "lucide-react";
// import { StatistiqueCardProps, StatistiquesCardsProps } from "./types";

// const Statistiques: React.FC<StatistiqueCardProps> = ({
//   title,
//   value,
//   icon,
//   color,
//   cardBackground,
//   subtitle,
//   stats,
//   unit,
// }) => {
//   const iconComponents: Record<string, React.ElementType> = {
//     PowerOff: PowerOff,
//     Alert: AlertTriangle,
//     Check: Siren,
//     Lamp: Lightbulb,
//   };
//   const IconComponent = iconComponents[icon] || PowerOff;
//   return (
//     <div
//       className={`
//         rounded-lg ${cardBackground} dark:bg-gray-950 transition-shadow duration-200`}
//     >
//       <div className="p-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <p className="text-sm font-medium text-gray-500">{title}</p>
//             <p className="text-2xl font-bold mt-1">{value}</p>
//             {/* <p className="text-gray-600 text-sm font-medium mt-2">{subtitle}</p>
//           <p className="text-2xl  font-bold mt-1">
//             {stats}
//             {unit}
//           </p> */}
//           </div>
//           <div className={`p-3 rounded-full ${color}`}>
//             <IconComponent className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>

//       <div className={` ${color} p-2 rounded-bl-lg rounded-br-lg`}>
//         <div className=" px-5 flex justify-between items-center text-white">
//           <p className="text-xs font-medium">{subtitle}</p>
//           <p className="text-xl font-bold ml-2">
//             {stats}
//             {unit}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatistiquesCard: React.FC<StatistiquesCardsProps> = () => {
//   // Configuration des cartes de statistiques
//   const statCardsConfig = [
//     {
//       title: "Total Lampadaires",
//       value: 120,
//       icon: "Lamp",
//       color: "bg-blue-500",
//       cardBackground: "bg-blue-100",
//       subtitle: "Durée moyenne d'activité",
//       stats: 6,
//       unit: "h",
//     },
//     {
//       title: "Lampadaires allumés",
//       value: 50,
//       icon: "Check",
//       color: "bg-amber-500",
//       cardBackground: "bg-amber-100",
//       subtitle: "Intensité lumineuse moyenne",
//       stats: 80,
//       unit: "%",
//     },
//     {
//       title: "Lampadaires éteints",
//       value: 30,
//       icon: "PowerOff",
//       color: "bg-gray-600",
//       cardBackground: "bg-gray-200",
//       subtitle: "Durée d'inactivité moyen",
//       stats: 12,
//       unit: "h",
//     },
//     {
//       title: "Lampadaires défectueux",
//       value: 40,
//       icon: "Alert",
//       color: "bg-red-500",
//       cardBackground: "bg-red-100",
//       subtitle: " Temps de disfonctionnement moyen",
//       stats: 5,
//       unit: "h",
//     },
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {statCardsConfig.map((card, index) => (
//         <Statistiques key={index} {...card} />
//       ))}
//     </div>
//   );
// };

// export default StatistiquesCard;

import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Lightbulb,
  LightbulbOff,
  PowerOff,
  Siren,
} from "lucide-react";
import { StatistiqueCardProps, StatistiquesCardsProps } from "./types";

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
  const [statisticsData, setStatisticsData] = useState<StatistiqueCardProps[]>(
    []
  );

  // Simulating API fetch
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/streetlight-statistics');
        // const data = await response.json();

        // Simulated API response data
        const data = [
          {
            title: "Total Lampadaires",
            value: 120,
            icon: "Lamp",
            color: "bg-blue-500",
            cardBackground: "bg-blue-100",
            subtitle: "Durée moyenne d'activité",
            stats: 6.5, // 6h 30min
            unit: "h",
          },
          {
            title: "Lampadaires allumés",
            value: 50,
            icon: "Check",
            color: "bg-amber-500",
            cardBackground: "bg-amber-100",
            subtitle: "Intensité lumineuse moyenne",
            stats: 80,
            unit: "%",
          },
          {
            title: "Lampadaires éteints",
            value: 30,
            icon: "PowerOff",
            color: "bg-gray-600",
            cardBackground: "bg-gray-200",
            subtitle: "Durée d'inactivité moyen",
            stats: 12.25, // 12h 15min
            unit: "h",
          },
          {
            title: "Lampadaires défectueux",
            value: 40,
            icon: "Alert",
            color: "bg-red-500",
            cardBackground: "bg-red-100",
            subtitle: "Temps de disfonctionnement moyen",
            stats: 5.75, // 5h 45min
            unit: "h",
          },
        ];

        setStatisticsData(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        // Show default data in case of error
      } finally {
        // Simulate loading delay
        // setTimeout(() => setIsLoading(false), 800);
      }
    };

    fetchStatistics();

    // Optional: Set up polling for real-time updates
    const intervalId = setInterval(fetchStatistics, 60000); // Refresh every minute

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsData.map((card, index) => (
        <Statistique key={index} {...card} />
      ))}
    </div>
  );
};

export default StatistiquesCard;
