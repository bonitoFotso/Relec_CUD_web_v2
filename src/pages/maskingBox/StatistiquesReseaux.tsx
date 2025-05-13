// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useMemo } from "react";
// import {
//   AlertTriangle,
//   Lightbulb,
//   LightbulbOff,
//   PowerOff,
//   Siren,
// } from "lucide-react";
// import { StatistiqueCardProps } from "./types";

// const Statistique: React.FC<StatistiqueCardProps> = ({
//   title,
//   value,
//   icon,
//   color,
//   cardBackground,
// }) => {
//   const iconComponents: Record<string, React.ElementType> = {
//     PowerOff: LightbulbOff,
//     Alert: AlertTriangle,
//     Check: Siren,
//     Lamp: Lightbulb,
//   };
//   const IconComponent = iconComponents[icon] || PowerOff;

//   return (
//     <div
//       className={`relative overflow-hidden
//         rounded-lg ${cardBackground} dark:bg-gray-800 transition-all duration-200
//         hover:shadow-lg hover:scale-[1.01]
//       `}
//     >
//       <div className="p-6">
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
//     </div>
//   );
// };

// interface StatistiquesCardsProps {
//   filteredStreetlights: any[];
// }

// export default function StatistiquesReseaux({
//   filteredStreetlights,
// }: StatistiquesCardsProps) {
//   // useMemo to calculate statistics based on filtered streetlights
//   const statistics = useMemo(() => {
//     const totalStreetlights = filteredStreetlights.length;

//     // Group streetlights by cabinet_id and count unique cabinets
//     const cabinetIds = new Set<number>();
//     filteredStreetlights.forEach((streetlight) => {
//       if (streetlight.cabinet_id) {
//         cabinetIds.add(streetlight.cabinet_id);
//       }
//     });
//     const totalNetworks = cabinetIds.size;

//     if (totalStreetlights === 0) {
//       return {
//         totalNetworks: 0,
//       };
//     }

//     return {
//       totalNetworks,
//     };
//   }, [filteredStreetlights]);

//   // Statistics for display
//   const statisticsData = [
//     {
//       title: "Total des Reseaux",
//       value: statistics.totalNetworks || 0,
//       icon: "Lamp",
//       color: "bg-blue-700",
//       cardBackground: "bg-blue-100",
//     },
//     {
//       title: "Reseaux avec Compteurs & amoires",
//       value: statistics.connectedToCabinetAndMeter || 0,
//       icon: "Check",
//       color: "bg-green-700",
//       cardBackground: "bg-green-100",
//     },
//     {
//       title: "Reseaux avec Compteurs uniquement",
//       value: statistics.connectedToCabinetOnly || 0,
//       icon: "PowerOff",
//       color: "bg-gray-600",
//       cardBackground: "bg-gray-200",
//     },
//     {
//       title: "Reseaux avec Amoires uniquement",
//       value: statistics.connectedToMeterOnly || 0,
//       icon: "Alert",
//       color: "bg-red-500",
//       cardBackground: "bg-red-100",
//     },
//     {
//       title: "Reseaux non connectés",
//       value: statistics.notConnected || 0,
//       icon: "Alert",
//       color: "bg-red-500",
//       cardBackground: "bg-red-100",
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
//         <Statistique stats={0} unit={""} subtitle={""} key={index} {...card} />
//       ))}
//     </div>
//   );
// }

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

const Statistique: React.FC<StatistiqueCardProps> = ({
  title,
  value,
  icon,
  color,
  cardBackground,
}) => {
  const iconComponents: Record<string, React.ElementType> = {
    PowerOff: LightbulbOff,
    Alert: AlertTriangle,
    Check: Siren,
    Lamp: Lightbulb,
  };
  const IconComponent = iconComponents[icon] || PowerOff;

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
    </div>
  );
};

interface Streetlight {
  id: string;
  cabinet_id?: string;
  meter_id?: string;
  municipality?: string;
  is_on_night?: number;
  is_on_day?: number;
  lamps?: { lamp_type: string }[];
}

interface StatistiquesReseauxProps {
  filteredStreetlights: Streetlight[];
  groupedByCabinet: Record<string, Streetlight[]>;
}

export default function StatistiquesReseaux({
  filteredStreetlights,
  groupedByCabinet,
}: StatistiquesReseauxProps) {
  // useMemo to calculate statistics based on filtered streetlights
  const statistics = useMemo(() => {
    const totalStreetlights = filteredStreetlights.length;

    // Group streetlights by cabinet_id and count unique cabinets
    const cabinetIds = new Set<string>();
    const cabinetAndMeterIds = new Set<string>();
    const cabinetOnlyIds = new Set<string>();

    // Process each network (cabinet)
    Object.entries(groupedByCabinet).forEach(([cabinetId, streetlights]) => {
      cabinetIds.add(cabinetId);

      // Check if any streetlight in this network has a meter_id
      const hasMeter = streetlights.some((light) => light.meter_id);

      if (hasMeter) {
        cabinetAndMeterIds.add(cabinetId);
      } else {
        cabinetOnlyIds.add(cabinetId);
      }
    });

    // Count streetlights with meter_id but no cabinet_id
    const metersWithoutCabinet = new Set<string>();
    filteredStreetlights.forEach((light) => {
      if (light.meter_id && !light.cabinet_id) {
        metersWithoutCabinet.add(light.meter_id);
      }
    });

    // Count streetlights with neither meter_id nor cabinet_id
    const notConnected = filteredStreetlights.filter(
      (light) => !light.cabinet_id && !light.meter_id
    ).length;

    if (totalStreetlights === 0) {
      return {
        totalNetworks: 0,
        connectedToCabinetAndMeter: 0,
        connectedToCabinetOnly: 0,
        connectedToMeterOnly: 0,
        notConnected: 0,
      };
    }

    return {
      totalNetworks: cabinetIds.size,
      connectedToCabinetAndMeter: cabinetAndMeterIds.size,
      connectedToCabinetOnly: cabinetOnlyIds.size,
      connectedToMeterOnly: metersWithoutCabinet.size,
      notConnected,
    };
  }, [filteredStreetlights, groupedByCabinet]);

  // Statistics for display
  const statisticsData = [
    
    {
      title: "Reseaux avec Compteurs et armoires",
      value: statistics.connectedToCabinetAndMeter || 0,
      icon: "Check",
      color: "bg-green-700",
      cardBackground: "bg-green-100",
    },
    {
      title: "Reseaux avec Armoires uniquement",
      value: statistics.connectedToCabinetOnly || 0,
      icon: "PowerOff",
      color: "bg-orange-600",
      cardBackground: "bg-orange-200",
    },
    {
      title: "Reseaux avec Compteurs uniquement",
      value: statistics.connectedToMeterOnly || 0,
      icon: "Alert",
      color: "bg-cyan-500",
      cardBackground: "bg-cyan-100",
    },
    {
      title: "Reseaux non connectés",
      value: statistics.notConnected || 0,
      icon: "Alert",
      color: "bg-red-500",
      cardBackground: "bg-red-100",
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
        <Statistique stats={0} unit={""} subtitle={""} key={index} {...card} />
      ))}
    </div>
  );
}
