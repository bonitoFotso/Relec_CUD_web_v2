/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import {
  AlertTriangle,
  Lightbulb,
  LightbulbOff,
  PowerOff,
  Siren,
} from "lucide-react";
import { StatistiqueCardProps } from "./types";

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
      className={`relative overflow-hidden
        rounded-lg ${cardBackground} dark:bg-gray-800 transition-all duration-200
        hover:shadow-lg hover:scale-[1.01]
      `}
    >
      <div className="p-6 mb-6">
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

      <div
        className={`absolute bottom-0 left-0 right-0 ${color} p-2 rounded-bl-lg rounded-br-lg`}
      >
        <div className="flex justify-between gap-2 items-center text-white">
          <p className="text-xs font-normal">{subtitle}</p>
          <p className="text-xs font-extrabold">{formattedStats}</p>
        </div>
      </div>
    </div>
  );
};

// Updated interface to accept filtered streetlights
interface StatistiquesCardsPropsUpdated {
  filteredStreetlights: any[]; // Replace with your actual streetlight type
}

const StatistiquesCard: React.FC<StatistiquesCardsPropsUpdated> = ({
  filteredStreetlights,
}) => {
  // useMemo to calculate statistics based on filtered streetlights
  const statistics = useMemo(() => {
    // Calculate total number of streetlights
    const totalStreetlights = filteredStreetlights.length;

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

    // Classify streetlights by state
    // const onLights = filteredStreetlights.filter(
    //   (light) => light.is_on_day === 0 || light.is_on_night === 1
    // );
    // const offLights = filteredStreetlights.filter(
    //   (light) => light.is_on_day === 0 && light.is_on_night === 0
    // );
    // const faultyLights = filteredStreetlights.filter(
    //   (light) =>
    //     (light.is_on_day === 1 && light.is_on_night === 0) ||
    //     (light.is_on_day === 0 && light.is_on_night === 1)
    // );
    const onLights = filteredStreetlights.filter(
      (light) => light.is_on_day === 0 && light.is_on_night === 1
    );
    const offLights = filteredStreetlights.filter(
      (light) => light.is_on_day === 0 && light.is_on_night === 0
    );
    const faultyLights = filteredStreetlights.filter(
      (light) =>
        (light.is_on_day === 1 && light.is_on_night === 0) || // Allumé le jour, éteint la nuit
        (light.is_on_day === 1 && light.is_on_night === 1) // Toujours allumé
    );

    // Number of streetlights by state
    const onStreetlights = onLights.length;
    const offStreetlights = offLights.length;
    const faultyStreetlights = faultyLights.length;

    // Calculate average brightness
    const totalBrightness = filteredStreetlights.reduce(
      (sum, light) => sum + (light.brightness_level || 0),
      0
    );
    const avgBrightness = Math.round(
      totalBrightness / (totalStreetlights || 1)
    );

    // Calculate average times (assuming on_time and off_time are in hours)
    // Average active time (for lit streetlights)
    const avgActiveTime =
      onLights.length > 0
        ? onLights.reduce((sum, light) => {
            const onTime =
              typeof light.on_time === "string"
                ? parseFloat(light.on_time) || 6.5
                : 6.5;
            return sum + onTime;
          }, 0) / onLights.length
        : 6.5;

    // Average inactive time (for turned off streetlights)
    const avgInactiveTime =
      offLights.length > 0
        ? offLights.reduce((sum, light) => {
            const offTime =
              typeof light.off_time === "string"
                ? parseFloat(light.off_time) || 12.25
                : 12.25;
            return sum + offTime;
          }, 0) / offLights.length
        : 12.25;

    // Average malfunction time (for faulty streetlights)
    const avgMalfunctionTime = 5.75; // Default value

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
  }, [filteredStreetlights]);

  // Statistics for display
  const statisticsData = [
    {
      title: "Total des réseaux supervisés",
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
      value: statistics.onStreetlights,
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

  // Check if data is loading
  if (!filteredStreetlights) {
    return (
      <div className="text-center py-4">Chargement des statistiques...</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
      {statisticsData.map((card, index) => (
        <Statistique key={index} {...card} />
      ))}
    </div>
  );
};

export default StatistiquesCard;

// import React, { useMemo } from "react";
// import {
//   AlertTriangle,
//   Lightbulb,
//   LightbulbOff,
//   PowerOff,
//   Siren,
// } from "lucide-react";
// import { StatistiqueCardProps } from "./types";

// // Helper function to format time in hours and minutes
// const formatTime = (hours: number): string => {
//   const wholeHours = Math.floor(hours);
//   const minutes = Math.round((hours - wholeHours) * 60);

//   if (wholeHours === 0) {
//     return `${minutes} min`;
//   } else if (minutes === 0) {
//     return `${wholeHours} h`;
//   } else {
//     return `${wholeHours} h ${minutes} min`;
//   }
// };

// const Statistique: React.FC<StatistiqueCardProps> = ({
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
//     PowerOff: LightbulbOff,
//     Alert: AlertTriangle,
//     Check: Siren,
//     Lamp: Lightbulb,
//   };
//   const IconComponent = iconComponents[icon] || PowerOff;

//   // Format stats value based on unit type
//   const formattedStats = unit === "h" ? formatTime(stats) : `${stats}${unit}`;

//   return (
//     <div
//       className={`relative overflow-hidden
//         rounded-lg ${cardBackground} dark:bg-gray-800 transition-all duration-200
//         hover:shadow-lg hover:scale-[1.01]
//       `}
//     >
//       <div className="p-6 mb-6">
//         <div className="flex justify-between items-start">
//           <div>
//             <p className="text-sm font-medium text-gray-500 dark:text-gray-100">
//               {title}
//             </p>
//             <p className="text-2xl font-bold mt-1">{value}</p>
//           </div>
//           <div className={`p-3 rounded-full ${color}`}>
//             <IconComponent className="w-6 h-6 text-white" />
//           </div>
//         </div>
//       </div>

//       <div
//         className={`absolute bottom-0 left-0 right-0 ${color} p-2 rounded-bl-lg rounded-br-lg`}
//       >
//         <div className="flex justify-between gap-2 items-center text-white">
//           <p className="text-xs font-normal">{subtitle}</p>
//           <p className="text-xs font-extrabold">{formattedStats}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Updated interface to accept filtered streetlights
// interface StatistiquesCardsPropsUpdated {
//   filteredStreetlights: any[]; // Replace with your actual streetlight type
// }

// const StatistiquesCard: React.FC<StatistiquesCardsPropsUpdated> = ({
//   filteredStreetlights,
// }) => {
//   // useMemo to calculate statistics based on filtered streetlights
//   const statistics = useMemo(() => {
//     // Calculate total number of networks (based on unique network_id)
//     const uniqueNetworks = new Set(
//       filteredStreetlights.map((light) => light.network_id)
//     );
//     const totalNetworks = uniqueNetworks.size;

//     if (totalNetworks === 0) {
//       return {
//         totalNetworks: 0,
//         activeNetworks: 0,
//         inactiveNetworks: 0,
//         faultyNetworks: 0,
//         avgBrightness: 0,
//         avgActiveTime: 0,
//         avgInactiveTime: 0,
//         avgMalfunctionTime: 0,
//       };
//     }

//     // Group streetlights by network
//     const networkMap = filteredStreetlights.reduce((acc, light) => {
//       if (!acc[light.network_id]) {
//         acc[light.network_id] = [] as typeof filteredStreetlights;
//       }
//       acc[light.network_id].push(light);
//       return acc;
//     }, {} as Record<number, typeof filteredStreetlights>); // Explicitly define the type as an array of the same type as filteredStreetlights

//     // Classify networks by their state
//     let activeNetworks = 0;
//     let inactiveNetworks = 0;
//     let faultyNetworks = 0;
//     let totalBrightness = 0;
//     let totalActiveTime = 0;
//     let totalInactiveTime = 0;
//     let activeNetworksCount = 0;
//     let inactiveNetworksCount = 0;

//     Object.values(networkMap).forEach((networkLights) => {
//       // Check if all lights are functional (consistent state)
//       const allOn = networkLights.every(
//         (light: { is_on_day: number; is_on_night: number; }) => light.is_on_day === 1 || light.is_on_night === 1
//       );
//       const allOff = networkLights.every(
//         (light: { is_on_day: number; is_on_night: number; }) => light.is_on_day === 0 && light.is_on_night === 0
//       );

//       // Network has inconsistent states - some lights on, some off
//       const isFaulty = !allOn && !allOff;

//       // For proper day/night operation, lights should be OFF during day and ON during night
//       const hasProperDayNightCycle = networkLights.every(
//         (light: { is_on_day: number; is_on_night: number; }) => light.is_on_day === 0 && light.is_on_night === 1
//       );

//       // If some lights in the network have improper day/night cycle, mark as faulty
//       const hasDayNightIssue = networkLights.some(
//         (light: { is_on_day: number; is_on_night: number; }) =>
//           (light.is_on_day === 1 && light.is_on_night === 0) || // On during day, off at night
//           (light.is_on_day === 1 && light.is_on_night === 1) // Always on (energy waste)
//       );

//       if (isFaulty || hasDayNightIssue) {
//         faultyNetworks++;
//       } else if (hasProperDayNightCycle || allOn) {
//         activeNetworks++;

//         // Calculate average brightness and active time for active networks
//         const networkBrightness = networkLights.reduce(
//           (sum: any, light: { brightness_level: any; }) => sum + (light.brightness_level || 0),
//           0
//         );
//         totalBrightness += networkBrightness / (networkLights as typeof filteredStreetlights).length;

//         const networkActiveTime =
//           networkLights.reduce((sum: number, light: { on_time: string; }) => {
//             const onTime =
//               typeof light.on_time === "string"
//                 ? parseFloat(light.on_time) || 6.5
//                 : 6.5;
//             return sum + onTime;
//           }, 0) / networkLights.length;

//         totalActiveTime += networkActiveTime;
//         activeNetworksCount++;
//       } else if (allOff) {
//         inactiveNetworks++;

//         // Calculate average inactive time for inactive networks
//         const networkInactiveTime =
//           networkLights.reduce((sum: number, light: { off_time: string; }) => {
//             const offTime =
//               typeof light.off_time === "string"
//                 ? parseFloat(light.off_time) || 12.25
//                 : 12.25;
//             return sum + offTime;
//           }, 0) / networkLights.length;

//         totalInactiveTime += networkInactiveTime;
//         inactiveNetworksCount++;
//       }
//     });

//     // Calculate final averages
//     const avgBrightness =
//       activeNetworksCount > 0
//         ? Math.round(totalBrightness / activeNetworksCount)
//         : 0;

//     const avgActiveTime =
//       activeNetworksCount > 0 ? totalActiveTime / activeNetworksCount : 6.5;

//     const avgInactiveTime =
//       inactiveNetworksCount > 0
//         ? totalInactiveTime / inactiveNetworksCount
//         : 12.25;

//     // Average malfunction time for faulty networks (default value)
//     const avgMalfunctionTime = 5.75;

//     return {
//       totalNetworks,
//       activeNetworks,
//       inactiveNetworks,
//       faultyNetworks,
//       avgBrightness,
//       avgActiveTime,
//       avgInactiveTime,
//       avgMalfunctionTime,
//     };
//   }, [filteredStreetlights]);

//   // Statistics for display
//   const statisticsData = [
//     {
//       title: "Total des réseaux supervisés",
//       value: statistics.totalNetworks || 0,
//       icon: "Lamp",
//       color: "bg-blue-500",
//       cardBackground: "bg-blue-100",
//       subtitle: "Durée moyenne d'activité",
//       stats: statistics.avgActiveTime,
//       unit: "h",
//     },
//     {
//       title: "Réseaux actifs",
//       value: statistics.activeNetworks,
//       icon: "Check",
//       color: "bg-amber-500",
//       cardBackground: "bg-amber-100",
//       subtitle: "Intensité lumineuse moyenne",
//       stats: statistics.avgBrightness,
//       unit: "%",
//     },
//     {
//       title: "Réseaux inactifs",
//       value: statistics.inactiveNetworks || 0,
//       icon: "PowerOff",
//       color: "bg-gray-600",
//       cardBackground: "bg-gray-200",
//       subtitle: "Durée d'inactivité moyenne",
//       stats: statistics.avgInactiveTime,
//       unit: "h",
//     },
//     {
//       title: "Réseaux défectueux",
//       value: statistics.faultyNetworks || 0,
//       icon: "Alert",
//       color: "bg-red-500",
//       cardBackground: "bg-red-100",
//       subtitle: "Temps de dysfonctionnement moyen",
//       stats: statistics.avgMalfunctionTime,
//       unit: "h",
//     },
//   ];

//   // Check if data is loading
//   if (!filteredStreetlights) {
//     return (
//       <div className="text-center py-4">Chargement des statistiques...</div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
//       {statisticsData.map((card, index) => (
//         <Statistique key={index} {...card} />
//       ))}
//     </div>
//   );
// };

// export default StatistiquesCard;
