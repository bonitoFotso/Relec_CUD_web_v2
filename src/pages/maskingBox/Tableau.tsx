import { useState, useEffect } from "react";
import ConsommationsPrimaires from "./Consommation/ConsommationPrimaire";
import { useEquipements } from "@/contexts/EquipementContext";
import StatistiquesCard from "./Statistiques";

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

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ) : (
          <>
            {/* Pass the filtered streetlights to StatistiquesCard */}
            <StatistiquesCard filteredStreetlights={filteredStreetlights} />
            {/* Pass filtered data to consumption component */}
            <ConsommationsPrimaires
              filteredStreetlights={filteredStreetlights}
            />
          </>
        )}
      </div>
    </div>
  );
}
