// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { useState } from "react";
// import { FilterState, municipalities, PanneauStats } from "./types";
// import StatistiquesCard from "./Statistiques";
// import Alertes from "./Alertes";
// import Recommandations from "./Recommandations";
// import ConsommationsPrimaires from "./Consommation/ConsommationPrimaire";

// export default function Tableau() {
//   const [lampStatus, setLampStatus] = useState<PanneauStats>({
//     total: 0,
//     allumés: 0,
//     éteints: 0,
//     défectueux: 0,
//   });
//   const [availableMunicipalities, setAvailableMunicipalities] = useState<
//     string[]
//   >([]);
//   const [activeFilters, setActiveFilters] = useState<municipalities>({
//     municipalities: [],
//   });
//   console.log("Active municipalities", activeFilters);

//   return (
//     <div className=" space-y-8">
//       <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
//         <h2 className="text-2xl font-bold">PANNEAU DE CONTROLE MASSKING BOX</h2>

//         <select className="ml-5 border bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm ml:3">
//           <option value="">Toutes les communes</option>
//           <option value="option1">Douala 1er</option>
//           <option value="option2">Douala 2eme</option>
//           <option value="option3">Douala 3eme</option>
//           <option value="option4">Douala 4eme</option>
//           <option value="option5">Douala 5eme</option>
//         </select>
//       </div>
//       <StatistiquesCard stats={lampStatus} />
//       <ConsommationsPrimaires />
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//         <Alertes />
//         <Recommandations />
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import StatistiquesCard from "./Statistiques";
import ConsommationsPrimaires from "./Consommation/ConsommationPrimaire";
import { useEquipements } from "@/contexts/EquipementContext";
import ReportGenerator from "./Consommation/ReportGenerator";

export default function Tableau() {
  // Get streetlights data from context
  const { streetlights } = useEquipements();
  // State for the selected municipality
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");

  // State to control report modal visibility
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // State for report type
  const [reportType, setReportType] = useState<"pdf" | "excel" | null>(null);

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
  const handleReportGeneration = (type: "pdf" | "excel") => {
    setReportType(type);
    setShowReportModal(true);
  };

  // Close report modal
  const closeReportModal = () => {
    setShowReportModal(false);
    setReportType(null);
  };
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-white">
          PANNEAU DE CONTROLE MASSKING BOX
        </h2>

        <div className="flex items-center gap-2 justify-center">
          <select
            className="ml-5 border bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm"
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
          <button
            className="border bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg px-3 py-2 text-sm flex items-center"
            onClick={() => handleReportGeneration("pdf")}
          >
            <span className="mr-1">📄</span> Exporter en PDF
          </button>
          <button
            className="border bg-white hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg px-3 py-2 text-sm flex items-center"
            onClick={() => handleReportGeneration("excel")}
          >
            <span className="mr-1">📊</span> Exporter en Excel
          </button>
        </div>
      </div>

      {/* Pass the filtered streetlights to StatistiquesCard */}
      <StatistiquesCard filteredStreetlights={filteredStreetlights} />

      {/* Pass filtered data to other components as needed */}
      <ConsommationsPrimaires filteredStreetlights={filteredStreetlights} />

      {showReportModal && (
        <ReportGenerator
          type={reportType}
          data={filteredStreetlights.map((light) => ({
            ...light,
            id: light.id.toString(),
          }))}
          municipality={selectedMunicipality || "Toutes les communes"}
          onClose={closeReportModal}
        />
      )}
    </div>
  );
}
