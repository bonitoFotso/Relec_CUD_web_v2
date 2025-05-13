import { useState, useEffect } from "react";
import ConsommationsPrimaires from "./Consommation/ConsommationPrimaire";
import { useEquipements } from "@/contexts/EquipementContext";
import DashboardReseauLampadaires from "./DashboardReseauLampadaires";
import ConsommationStatistics from "./ConsommationStatistiques";

export default function Tableau() {
  // Get streetlights data from context
  const { streetlights, loading } = useEquipements();

  // State for the selected municipality
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");

  // State for available municipalities extracted from data
  const [availableMunicipalities, setAvailableMunicipalities] = useState<
    string[]
  >([]);

  // State for filtered streetlights based on selected municipality
  const [filteredStreetlights, setFilteredStreetlights] =
    useState(streetlights);

  // Extract unique municipalities from streetlights data
  useEffect(() => {
    if (streetlights && streetlights.length > 0) {
      const uniqueMunicipalities = Array.from(
        new Set(streetlights.map((light) => light.municipality || ""))
      ).filter((municipality) => municipality !== "");

      setAvailableMunicipalities(uniqueMunicipalities);
    }
  }, [streetlights]);

  // Filter streetlights based on selected municipality
  useEffect(() => {
    if (selectedMunicipality === "") {
      // If no municipality is selected, show all streetlights
      setFilteredStreetlights(streetlights);
    } else {
      // Filter streetlights by selected municipality
      const filtered = streetlights.filter(
        (light) => light.municipality === selectedMunicipality
      );
      setFilteredStreetlights(filtered);
    }
  }, [selectedMunicipality, streetlights]);

  // Handle municipality selection change
  const handleMunicipalityChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedMunicipality(e.target.value);
  };

  // State for active view
  const [activeView, setActiveView] = useState<string>("reseaux");

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen rounded-sm">
      <div className="py-4 px-2 md:px-3">
        <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0 mb-4 mt-4">
          <h2 className="text-2xl font-bold">
            PANNEAU DE CONTROLE MASSKING BOX
          </h2>

          <div className="flex items-center gap-2 justify-center flex-wrap">
            {loading ? (
              <div className="animate-pulse w-48 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ) : (
              <select
                className="border bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm"
                value={selectedMunicipality}
                onChange={handleMunicipalityChange}
              >
                <option value="">Toutes les communes</option>
                {availableMunicipalities.map((municipality, index) => (
                  <option key={index} value={municipality}>
                    {municipality}
                  </option>
                ))}
              </select>
            )}
            <select
              className="border bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm"
              defaultValue=""
              disabled={loading}
            >
              <option value="" disabled>
                Générer un rapport
              </option>
              <option value="pdf">📄 Exporter en PDF</option>
              <option value="excel">📊 Exporter en Excel</option>
            </select>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${
              activeView === "reseaux"
                ? "border-b-2 border-blue-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveView("reseaux")}
          >
            Réseaux & lampadaires
          </button>
          <button
            className={`py-2 px-4 ${
              activeView === "consommation"
                ? "border-b-2 border-blue-500 font-bold"
                : "text-gray-500"
            }`}
            onClick={() => setActiveView("consommation")}
          >
            Consommation d'énergie
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ) : (
          <>
            {activeView === "reseaux" && (
              <DashboardReseauLampadaires
                filteredStreetlights={filteredStreetlights.map((light) => ({
                  ...light,
                  id: light.id.toString(),
                  cabinet_id: light.cabinet_id?.toString(),
                }))}
              />
            )}

            {activeView === "consommation" && (
              <>
                <ConsommationsPrimaires
                  filteredStreetlights={filteredStreetlights}
                />
                <ConsommationStatistics
                  filteredStreetlights={filteredStreetlights}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
