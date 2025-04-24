// import { Settings } from "lucide-react";

// export default function Recommandations() {
//   return (
//     <div className="p-3">
//       <div className="flex items-center mb-4">
//         <Settings className="text-blue-600 dark:text-blue-400 mr-2" size={20} />
//         <h2 className="text-xl font-bold ">Recommandations</h2>
//       </div>
//       <div className="space-y-3">
//         <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-amber-500">
//           <h4 className="font-medium">Maintenance préventive</h4>
//           <p className="text-sm mt-1">
//             Planifier le remplacement des lampadaires du secteur Est (efficacité
//             &lt; 60%)
//           </p>
//         </div>

//         <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-green-500">
//           <h4 className="font-medium">Optimisation énergétique</h4>
//           <p className="text-sm mt-1">
//             Ajuster la sensibilité des capteurs d'éclairage adaptatif pour
//             gagner 5% d'économie
//           </p>
//         </div>

//         <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-blue-500">
//           <h4 className="font-medium">Réduction pollution</h4>
//           <p className="text-sm mt-1">
//             Réduire l'intensité lumineuse de 10% dans les zones résidentielles
//             après 23h
//           </p>
//         </div>
//         <div className="p-2 bg-white dark:bg-gray-900 rounded-md border-l-4 border-blue-500">
//           <h4 className="font-medium">Réduction pollution</h4>
//           <p className="text-sm mt-1">
//             Réduire l'intensité lumineuse de 10% dans les zones résidentielles
//             après 23h
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo } from "react";
import {
  Settings,
  AlertTriangle,
  Zap,
  ThumbsUp,
  LightbulbOff,
  BatteryCharging,
  PenTool,
} from "lucide-react";
import { useEquipements } from "@/contexts/EquipementContext";
import { Recommendation, RecommendationType } from "./types";

const Recommandations: React.FC = () => {
  const { streetlights, loading, error } = useEquipements();

  // Generate recommendations based on streetlight data
  const recommendations = useMemo(() => {
    if (!streetlights.length) return [];

    const results: Recommendation[] = [];
    const municipalityMap = new Map<number, string>();
    const recommendationIds = new Set<string>();

    // Group data by municipality for analysis
    const municipalityData = new Map<
      number,
      {
        totalLights: number;
        faultyLights: number;
        oldLights: number; // Lights with older technology
        highConsumptionLights: number;
        supportConditions: Record<string, number>;
      }
    >();

    // Process streetlight data
    streetlights.forEach((light) => {
      const municipalityId = light.municipality_id;
      const municipalityName = light.municipality || "Unknown";

      // Store municipality name
      municipalityMap.set(municipalityId, municipalityName);

      // Initialize municipality data if not exists
      if (!municipalityData.has(municipalityId)) {
        municipalityData.set(municipalityId, {
          totalLights: 0,
          faultyLights: 0,
          oldLights: 0,
          highConsumptionLights: 0,
          supportConditions: {},
        });
      }

      const data = municipalityData.get(municipalityId)!;

      // Update counts
      data.totalLights++;

      // Check for faulty lights (inconsistent on/off status)
      if (
        (light.is_on_day === 1 && light.is_on_night === 0) ||
        (light.is_on_day === 0 && light.is_on_night === 1)
      ) {
        data.faultyLights++;
      }

      // Check for old technology (non-LED)
      const hasOldTech = light.lamps?.some(
        (lamp) => !lamp.lamp_type?.toLowerCase().includes("led")
      );
      if (hasOldTech) {
        data.oldLights++;
      }

      // Check for high consumption
      if (light.power > 100) {
        data.highConsumptionLights++;
      }

      // Track support conditions
      const condition = light.support_condition || "unknown";
      data.supportConditions[condition] =
        (data.supportConditions[condition] || 0) + 1;
    });

    // Generate recommendations based on analyzed data
    municipalityData.forEach((data, municipalityId) => {
      const municipalityName = municipalityMap.get(municipalityId) || "Unknown";

      // 1. Maintenance recommendations based on support conditions
      const poorConditionCount =
        data.supportConditions["mauvais"] ||
        data.supportConditions["poor"] ||
        data.supportConditions["bad"] ||
        0;

      if (poorConditionCount > 0) {
        const percentage = Math.round(
          (poorConditionCount / data.totalLights) * 100
        );
        if (percentage >= 15) {
          // Critical maintenance needed
          const recId = `maintenance-critical-${municipalityId}`;
          if (!recommendationIds.has(recId)) {
            recommendationIds.add(recId);
            results.push({
              id: recId,
              type: "urgent",
              title: "Maintenance urgente requise",
              description: `${percentage}% des supports sont en mauvais état dans ${municipalityName}. Planifier une inspection immédiate.`,
              municipality: municipalityName,
              municipalityId,
              priority: 5,
            });
          }
        } else if (percentage >= 5) {
          // Preventive maintenance recommended
          const recId = `maintenance-preventive-${municipalityId}`;
          if (!recommendationIds.has(recId)) {
            recommendationIds.add(recId);
            results.push({
              id: recId,
              type: "maintenance",
              title: "Maintenance préventive",
              description: `Planifier le remplacement de ${poorConditionCount} supports en mauvais état dans ${municipalityName}.`,
              municipality: municipalityName,
              municipalityId,
              priority: 3,
            });
          }
        }
      }

      // 2. Faulty lights recommendations
      if (data.faultyLights > 0) {
        const percentage = Math.round(
          (data.faultyLights / data.totalLights) * 100
        );
        if (percentage >= 10) {
          const recId = `faulty-lights-${municipalityId}`;
          if (!recommendationIds.has(recId)) {
            recommendationIds.add(recId);
            results.push({
              id: recId,
              type: "urgent",
              title: "Dysfonctionnements signalés",
              description: `${data.faultyLights} lampadaires présentent des anomalies jour/nuit dans ${municipalityName}. Vérifier le système de commande.`,
              municipality: municipalityName,
              municipalityId,
              priority: 4,
            });
          }
        }
      }

      // 3. Energy efficiency recommendations
      if (data.oldLights > 0) {
        const percentage = Math.round(
          (data.oldLights / data.totalLights) * 100
        );
        if (percentage >= 30) {
          const recId = `upgrade-old-tech-${municipalityId}`;
          if (!recommendationIds.has(recId)) {
            recommendationIds.add(recId);
            results.push({
              id: recId,
              type: "upgrade",
              title: "Modernisation recommandée",
              description: `Remplacer les ${data.oldLights} lampadaires de technologie ancienne par des LED dans ${municipalityName} pour réduire la consommation de 60%.`,
              municipality: municipalityName,
              municipalityId,
              priority: 3,
            });
          }
        }
      }

      // 4. High consumption recommendations
      if (data.highConsumptionLights > 0) {
        const percentage = Math.round(
          (data.highConsumptionLights / data.totalLights) * 100
        );
        if (percentage >= 20) {
          const recId = `energy-optimization-${municipalityId}`;
          if (!recommendationIds.has(recId)) {
            recommendationIds.add(recId);
            results.push({
              id: recId,
              type: "energy",
              title: "Optimisation énergétique",
              description: `Ajuster la puissance des ${data.highConsumptionLights} lampadaires à haute consommation dans ${municipalityName} pour économiser jusqu'à 15% d'énergie.`,
              municipality: municipalityName,
              municipalityId,
              priority: 2,
            });
          }
        }
      }

      // 5. Light pollution recommendations (for larger municipalities)
      if (data.totalLights > 50) {
        const recId = `pollution-reduction-${municipalityId}`;
        if (!recommendationIds.has(recId)) {
          recommendationIds.add(recId);
          results.push({
            id: recId,
            type: "pollution",
            title: "Réduction pollution lumineuse",
            description: `Réduire l'intensité lumineuse de 15% dans les zones résidentielles de ${municipalityName} après 23h pour diminuer la pollution lumineuse.`,
            municipality: municipalityName,
            municipalityId,
            priority: 1,
          });
        }
      }
    });

    // Sort by priority (highest first)
    return results.sort((a, b) => b.priority - a.priority);
  }, [streetlights]);

  // Get icon for each recommendation type
  const getIcon = (type: RecommendationType) => {
    switch (type) {
      case "maintenance":
        return (
          <PenTool className="text-amber-500 dark:text-amber-400" size={20} />
        );
      case "energy":
        return <Zap className="text-green-500 dark:text-green-400" size={20} />;
      case "pollution":
        return (
          <LightbulbOff
            className="text-blue-500 dark:text-blue-400"
            size={20}
          />
        );
      case "upgrade":
        return (
          <BatteryCharging
            className="text-purple-500 dark:text-purple-400"
            size={20}
          />
        );
      case "urgent":
        return (
          <AlertTriangle className="text-red-500 dark:text-red-400" size={20} />
        );
      default:
        return (
          <ThumbsUp className="text-gray-500 dark:text-gray-400" size={20} />
        );
    }
  };

  // Get border color for each recommendation type
  const getBorderColor = (type: RecommendationType) => {
    switch (type) {
      case "maintenance":
        return "border-amber-500";
      case "energy":
        return "border-green-500";
      case "pollution":
        return "border-blue-500";
      case "upgrade":
        return "border-purple-500";
      case "urgent":
        return "border-red-500";
      default:
        return "border-gray-500";
    }
  };

  // Group recommendations by municipality
  const groupedRecommendations = useMemo(() => {
    const grouped = new Map<string, Recommendation[]>();

    // Add "All" category
    grouped.set("Toutes les communes", [...recommendations]);

    // Group by municipality
    recommendations.forEach((rec) => {
      if (!grouped.has(rec.municipality)) {
        grouped.set(rec.municipality, []);
      }
      grouped.get(rec.municipality)!.push(rec);
    });

    return grouped;
  }, [recommendations]);

  // State for selected municipality filter
  const [selectedMunicipality, setSelectedMunicipality] =
    React.useState<string>("Toutes les communes");

  // Filter recommendations based on selected municipality
  const filteredRecommendations = useMemo(() => {
    return groupedRecommendations.get(selectedMunicipality) || [];
  }, [groupedRecommendations, selectedMunicipality]);

  if (loading) {
    return (
      <div className="p-3">
        <div className="flex items-center mb-4">
          <Settings
            className="text-blue-600 dark:text-blue-400 mr-2"
            size={20}
          />
          <h2 className="text-xl font-bold">Recommandations</h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3">
        <div className="flex items-center mb-4">
          <Settings
            className="text-blue-600 dark:text-blue-400 mr-2"
            size={20}
          />
          <h2 className="text-xl font-bold">Recommandations</h2>
        </div>
        <div className="p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          Erreur de chargement des données: {error}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="p-3">
        <div className="flex items-center mb-4">
          <Settings
            className="text-blue-600 dark:text-blue-400 mr-2"
            size={20}
          />
          <h2 className="text-xl font-bold">Recommandations</h2>
        </div>
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          Aucune recommandation disponible actuellement.
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div className="flex items-center mb-2 md:mb-0">
          <Settings
            className="text-blue-600 dark:text-blue-400 mr-2"
            size={20}
          />
          <h2 className="text-xl font-bold">Recommandations</h2>
        </div>

        <div className="relative">
          <select
            className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1.5 pl-3 pr-8 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedMunicipality}
            onChange={(e) => setSelectedMunicipality(e.target.value)}
          >
            {Array.from(groupedRecommendations.keys()).map((municipality) => (
              <option key={municipality} value={municipality}>
                {municipality}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
            <svg
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredRecommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-3 bg-white dark:bg-gray-800 rounded-md border-l-4 ${getBorderColor(
              rec.type
            )} shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className="flex items-center mb-1">
              {getIcon(rec.type)}
              <h4 className="font-medium ml-2">{rec.title}</h4>
            </div>
            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
              {rec.description}
            </p>
            {selectedMunicipality === "Toutes les communes" && (
              <div className="mt-2">
                <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {rec.municipality}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendation count */}
      <div className="mt-4 text-right text-xs text-gray-500 dark:text-gray-400">
        {filteredRecommendations.length} recommandation
        {filteredRecommendations.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default Recommandations;
