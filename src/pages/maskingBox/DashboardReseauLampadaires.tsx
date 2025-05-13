import { useState, useMemo } from "react";

import { LampCountByNetworkTable } from "../maps/functions";
import StatistiquesCard from "./Statistiques";
import StatistiquesReseaux from "./StatistiquesReseaux";

// Composant pour afficher les statistiques par réseau et lampadaire
interface Streetlight {
  id: string;
  cabinet_id?: string;
  municipality?: string;
  is_on_night?: number;
  is_on_day?: number;
  lamps?: { lamp_type: string }[];
}

interface DashboardReseauLampadairesProps {
  filteredStreetlights: Streetlight[];
}

export default function DashboardReseauLampadaires({
  filteredStreetlights,
}: DashboardReseauLampadairesProps) {
  const [activeView, setActiveView] = useState("reseau"); // 'reseau' ou 'lampadaire'

  // Données groupées par cabinet (réseau)
  const groupedByCabinet = useMemo(() => {
    if (!filteredStreetlights || filteredStreetlights.length === 0) return {};

    return filteredStreetlights.reduce(
      (acc: Record<string, Streetlight[]>, streetlight) => {
        if (!streetlight.cabinet_id) return acc;

        if (!acc[streetlight.cabinet_id]) {
          acc[streetlight.cabinet_id] = [];
        }

        acc[streetlight.cabinet_id].push(streetlight);
        return acc;
      },
      {}
    );
  }, [filteredStreetlights]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Statistiques des {activeView === "reseau" ? "réseaux" : "lampadaires"}
        </h2>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-md ${
              activeView === "reseau"
                ? "bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setActiveView("reseau")}
          >
            Par Réseau
          </button>
          <button
            className={`px-3 py-1 rounded-md ${
              activeView === "lampadaire"
                ? "bg-blue-700 text-white"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
            onClick={() => setActiveView("lampadaire")}
          >
            Par Lampadaire
          </button>
        </div>
      </div>
      {activeView === "reseau" ? (
        <StatistiquesReseaux
          filteredStreetlights={filteredStreetlights}
          groupedByCabinet={groupedByCabinet}
        />
      ) : (
        <StatistiquesCard filteredStreetlights={filteredStreetlights} />
      )}

      {activeView === "reseau" ? (
        <div className="mt-4">
          <LampCountByNetworkTable
            groupedByCabinet={Object.fromEntries(
              Object.entries(groupedByCabinet).map(([key, streetlights]) => [
                key,
                streetlights.map((streetlight) => ({
                  id: parseInt(streetlight.id, 10),
                  location: streetlight.municipality || "Unknown",
                  meter_id: null,
                  municipality: streetlight.municipality || "Unknown",
                })),
              ])
            )}
          />
        </div>
      ) : (
        <div className="mt-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-center bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Réseau</th>
                  <th className="px-4 py-2">Commune</th>
                  <th className="px-4 py-2">État de supports</th>
                </tr>
              </thead>
              <tbody>
                {filteredStreetlights.slice(0, 10).map((light) => (
                  <tr key={light.id} className="border-b dark:border-gray-700">
                    <td className="px-4 py-2">{light.id}</td>
                    <td className="px-4 py-2">
                      {light.lamps && light.lamps[0]
                        ? light.lamps[0].lamp_type
                        : "N/A"}
                    </td>
                    <td className="px-4 py-2">
                      {light.cabinet_id || "Non connecté"}
                    </td>
                    <td className="px-4 py-2">{light.municipality || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          light.is_on_night === 1 && light.is_on_day === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {light.is_on_night === 1 && light.is_on_day === 0
                          ? "Conforme"
                          : "Défectueux"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStreetlights.length > 10 && (
              <div className="text-center mt-2 text-gray-500">
                Affichage des 10 premiers lampadaires sur{" "}
                {filteredStreetlights.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
