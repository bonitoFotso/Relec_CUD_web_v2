/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { useEquipements } from "@/contexts/EquipementContext";
import { Filter, MapPin, RefreshCw } from "lucide-react";
import { MunicipalityStats, SupportConditionStats } from "../maskingBox/types";

const Etat_de_Support: React.FC = () => {
  const { streetlights, loading, error, fetchStreetlights } = useEquipements();
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    number | null
  >(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Extract unique municipalities from streetlights
  const municipalities = useMemo(() => {
    const uniqueMunicipalities = new Map();

    streetlights.forEach((light) => {
      if (light.municipality_id && light.municipality) {
        uniqueMunicipalities.set(light.municipality_id, light.municipality);
      }
    });

    return Array.from(uniqueMunicipalities.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [streetlights]);

  // Calculate statistics for each municipality
  const municipalityStats = useMemo(() => {
    const stats: MunicipalityStats[] = [];

    municipalities.forEach((municipality) => {
      const municipalityLights = streetlights.filter(
        (light) => light.municipality_id === municipality.id
      );

      const totalStreetlights = municipalityLights.length;

      // Count streetlights by support condition
      const conditionCounts = new Map<string, number>();

      municipalityLights.forEach((light) => {
        const condition = light.support_condition || "Non spécifié";
        conditionCounts.set(
          condition,
          (conditionCounts.get(condition) || 0) + 1
        );
      });

      // Calculate percentages
      const supportConditions: SupportConditionStats[] = Array.from(
        conditionCounts.entries()
      )
        .map(([condition, count]) => ({
          condition,
          count,
          percentage:
            totalStreetlights > 0 ? (count / totalStreetlights) * 100 : 0,
        }))
        .sort((a, b) => b.count - a.count); // Sort by count in descending order

      stats.push({
        id: municipality.id,
        name: municipality.name,
        totalStreetlights,
        supportConditions,
      });
    });

    return stats.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  }, [streetlights, municipalities]);

  // Handle refresh action
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchStreetlights();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter the stats based on selected municipality
  const filteredStats = selectedMunicipality
    ? municipalityStats.filter((stat) => stat.id === selectedMunicipality)
    : municipalityStats;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p className="text-xl font-semibold">Une erreur est survenue</p>
        <p>{error}</p>
        <button
          onClick={handleRefresh}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          État des Supports par Commune
        </h1>

        <div className="flex space-x-4">
          <div className="relative">
            <select
              className="appearance-none  border border-gray-300  rounded-md py-2 pl-3 pr-10 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={selectedMunicipality || ""}
              onChange={(e) =>
                setSelectedMunicipality(
                  e.target.value ? Number(e.target.value) : null
                )
              }
            >
              <option value="">Toutes les communes</option>
              {municipalities.map((municipality) => (
                <option key={municipality.id} value={municipality.id}>
                  {municipality.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <Filter size={16} />
            </div>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            disabled={isRefreshing}
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Actualiser
          </button>
        </div>
      </div>

      {filteredStats.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <p>Aucune donnée disponible</p>
        </div>
      ) : (
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredStats.map((stat) => (
            <div
              key={stat.id}
              className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center">
                    <MapPin size={18} className="mr-2 text-blue-500" />
                    {stat.name}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold py-1 px-2 rounded-full">
                    {stat.totalStreetlights} lampadaires
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-medium mb-3">État des supports</h3>

                {stat.supportConditions.length === 0 ? (
                  <p className="text-gray-500 text-center py-2">
                    Aucune donnée d'etat disponibles
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stat.supportConditions.map(
                      (
                        condition: {
                          percentage: any;
                          condition: string;
                          count: number;
                        },
                        index: number
                      ) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">
                              {condition.condition}
                            </span>
                            <span className="text-sm text-gray-600">
                              {condition.count} (
                              {condition.percentage.toFixed(1)}
                              %)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getColorByCondition(
                                condition.condition
                              )}`}
                              style={{ width: `${condition.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* <div className=" p-4 bg-gray-50 rounded-b-lg">
                <button
                  onClick={() =>
                    // (window.location.href = `/equipements/lampadaires?municipality=${stat.id}`)
                    console.info("Voir les détails")
                  }
                  className="w-full py-2 bg-transparent hover:bg-gray-100 text-blue-600 font-semibold rounded border border-blue-500 transition-colors"
                >
                  Voir les détails
                </button>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to get color based on support condition
const getColorByCondition = (condition: string): string => {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes("excellent")) {
    return "bg-green-500";
  } else if (conditionLower.includes("bien")) {
    return "bg-blue-500";
  } else if (
    conditionLower.includes("moyen") || 
    conditionLower.includes("normal")
  ) {
    return "bg-orange-500";
  } else if (
    conditionLower.includes("defectueux") ||
    conditionLower.includes("bad")
  ) {
    return "bg-amber-400";
  } else {
    return "bg-red-500";
  }
};

export default Etat_de_Support;
