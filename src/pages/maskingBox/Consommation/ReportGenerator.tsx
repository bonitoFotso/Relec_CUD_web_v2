// import { useState } from "react";

// // Define the types for the streetlight data
// interface Streetlight {
//   id: string;
//   municipality?: string;
//   status?: string;
//   location?: string;
//   powerConsumption?: number;
//   lastMaintenance?: string;
//   // Add other properties as needed
// }

// interface ReportGeneratorProps {
//   type: "pdf" | "excel" | null;
//   data: Streetlight[];
//   municipality: string;
//   onClose: () => void;
// }

// export default function ReportGenerator({
//   type,
//   data,
//   municipality,
//   onClose,
// }: ReportGeneratorProps) {
//   const [isGenerating, setIsGenerating] = useState<boolean>(false);
//   const [isComplete, setIsComplete] = useState<boolean>(false);
//   const [reportUrl, setReportUrl] = useState<string | null>(null);

//   const generateReport = async () => {
//     if (!type) return;

//     setIsGenerating(true);

//     try {
//       // In a real implementation, you would send the data to your backend API
//       // For now, we'll simulate this process
//       await new Promise((resolve) => setTimeout(resolve, 2000));

//       // Mock result URL (in a real app, this would come from your backend)
//       const mockUrl =
//         type === "pdf"
//           ? `/reports/streetlights-${municipality
//               .toLowerCase()
//               .replace(/\s+/g, "-")}.pdf`
//           : `/reports/streetlights-${municipality
//               .toLowerCase()
//               .replace(/\s+/g, "-")}.xlsx`;

//       setReportUrl(mockUrl);
//       setIsComplete(true);
//       setIsGenerating(false);
//     } catch (error) {
//       console.error("Error generating report:", error);
//       setIsGenerating(false);
//     }
//   };

//   // Call the generate function when the component mounts
//   useState(() => {
//     generateReport();
//   });

//   // Format the data for display in the preview
//   const formatDate = (date: string | undefined) => {
//     if (!date) return "N/A";
//     return new Date(date).toLocaleDateString();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-bold">
//             {type === "pdf"
//               ? "Génération du rapport PDF"
//               : "Génération du rapport Excel"}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         <div className="mb-4">
//           <p className="mb-2">
//             <strong>Commune:</strong> {municipality}
//           </p>
//           <p className="mb-2">
//             <strong>Nombre d'équipements:</strong> {data.length}
//           </p>
//         </div>

//         {isGenerating ? (
//           <div className="flex flex-col items-center justify-center p-8">
//             <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
//             <p className="mt-4">Génération du rapport en cours...</p>
//           </div>
//         ) : isComplete && reportUrl ? (
//           <div className="flex flex-col items-center justify-center p-4">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mb-4">
//               ✓
//             </div>
//             <p className="mb-4">Rapport généré avec succès!</p>
//             <button
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
//               onClick={() => {
//                 // In a real app, this would trigger a file download
//                 alert(
//                   `Dans une application réelle, cela téléchargerait le fichier depuis: ${reportUrl}`
//                 );
//               }}
//             >
//               Télécharger le rapport
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center p-4">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
//               ✕
//             </div>
//             <p className="mb-4">
//               Erreur lors de la génération du rapport. Veuillez réessayer.
//             </p>
//             <button
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
//               onClick={generateReport}
//             >
//               Réessayer
//             </button>
//           </div>
//         )}

//         {/* Data Preview */}
//         <div className="mt-6">
//           <h4 className="font-bold mb-2">Aperçu des données</h4>
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100 dark:bg-gray-700">
//                   <th className="border px-4 py-2">ID</th>
//                   <th className="border px-4 py-2">Commune</th>
//                   <th className="border px-4 py-2">Statut</th>
//                   <th className="border px-4 py-2">Consommation</th>
//                   <th className="border px-4 py-2">Dernière maintenance</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.slice(0, 5).map((light) => (
//                   <tr
//                     key={light.id}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-600"
//                   >
//                     <td className="border px-4 py-2">{light.id}</td>
//                     <td className="border px-4 py-2">
//                       {light.municipality || "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {light.status || "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {light.powerConsumption
//                         ? `${light.powerConsumption} W`
//                         : "N/A"}
//                     </td>
//                     <td className="border px-4 py-2">
//                       {formatDate(light.lastMaintenance)}
//                     </td>
//                   </tr>
//                 ))}
//                 {data.length > 5 && (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="border px-4 py-2 text-center text-gray-500"
//                     >
//                       {data.length - 5} autres équipements non affichés
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="mt-6 flex justify-end space-x-2">
//           <button
//             onClick={onClose}
//             className="border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
//           >
//             Fermer
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

// Define the types for the streetlight data
interface Streetlight {
  id: string;
  municipality?: string;
  status: "Allumé" | "Éteint" | "Défectueux";
  location?: string;
  powerConsumption?: number;
  lastMaintenance?: string;
  network?: string;
  lamps?: Array<{
    lamp_type: string;
    with_balast: boolean;
    streetlight_id: string;
  }>;
  power?: number;
  on_time?: string;
  off_time?: string;
}

interface ReportGeneratorProps {
  type: "pdf" | "excel" | null;
  data: Streetlight[];
  municipality: string;
  onClose: () => void;
}

export default function ReportGenerator({
  type,
  data,
  municipality,
  onClose,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<Streetlight[]>([]);

  // Utilisation du contexte de consommation
  // Removed unused calculerConsommationMoyenne to fix the error

  // Traitement des données des lampadaires pour le rapport
  useEffect(() => {
    // Filtrer les lampadaires pour la commune spécifiée
    const communeData = data.filter(
      (light) =>
        light.municipality?.toLowerCase() === municipality.toLowerCase()
    );

    // Enrichir les données avec les informations de statut et réseau
    const enrichedData = communeData.map((light) => {
      // Déterminer le statut du lampadaire
      let status: "Allumé" | "Éteint" | "Défectueux";

      // Logique pour déterminer le statut du lampadaire
      // Dans une application réelle, cela proviendrait d'un capteur ou d'un système de surveillance
      const currentHour = new Date().getHours();
      const onHour = light.on_time ? parseInt(light.on_time.split(":")[0]) : 18;
      const offHour = light.off_time
        ? parseInt(light.off_time.split(":")[0])
        : 6;

      if (light.id.includes("DEF") || Math.random() < 0.05) {
        status = "Défectueux";
      } else if (
        (currentHour >= onHour || currentHour < offHour) &&
        light.power &&
        light.power > 0
      ) {
        status = "Allumé";
      } else {
        status = "Éteint";
      }

      // Déterminer le réseau du lampadaire
      const network = determineNetwork(light.id, light.location);

      return {
        ...light,
        status,
        network,
        // Assurer que powerConsumption est défini
        powerConsumption: light.power || 0,
      };
    });

    setProcessedData(enrichedData);
  }, [data, municipality]);

  // Fonction pour déterminer le réseau basé sur l'ID et la localisation
  const determineNetwork = (id: string, location?: string): string => {
    if (id.startsWith("N1")) return "Réseau Principal";
    if (id.startsWith("N2")) return "Réseau Secondaire";
    if (id.startsWith("N3")) return "Réseau Tertiaire";
    if (id.includes("RURAL")) return "Réseau Rural";
    if (location?.includes("Centre")) return "Réseau Centre-Ville";
    if (location?.includes("Ouest")) return "Réseau Ouest";
    if (location?.includes("Est")) return "Réseau Est";
    if (location?.includes("Nord")) return "Réseau Nord";
    if (location?.includes("Sud")) return "Réseau Sud";

    return "Réseau Non Spécifié";
  };

  const generateReport = async () => {
    if (!type) return;

    setIsGenerating(true);

    try {
      // Simuler une requête API pour générer le rapport
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // URL fictive du rapport généré
      const mockUrl =
        type === "pdf"
          ? `/reports/streetlights-${municipality
              .toLowerCase()
              .replace(/\s+/g, "-")}-${
              new Date().toISOString().split("T")[0]
            }.pdf`
          : `/reports/streetlights-${municipality
              .toLowerCase()
              .replace(/\s+/g, "-")}-${
              new Date().toISOString().split("T")[0]
            }.xlsx`;

      setReportUrl(mockUrl);
      setIsComplete(true);
      setIsGenerating(false);
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      setIsGenerating(false);
    }
  };

  // Lancer la génération du rapport au montage du composant
  useEffect(() => {
    generateReport();
  }, []);

  // Formater une date pour l'affichage
  const formatDate = (date: string | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Calculer la consommation quotidienne en kWh
  const calculateDailyConsumption = (light: Streetlight): string => {
    if (!light.power) return "N/A";

    // Calculer la durée d'utilisation
    let duration = 12; // Valeur par défaut
    if (light.on_time && light.off_time) {
      const [onHour, onMinute] = light.on_time.split(":").map(Number);
      const [offHour, offMinute] = light.off_time.split(":").map(Number);

      if (offHour < onHour) {
        // Si l'heure d'arrêt est le jour suivant
        duration = 24 - onHour + offHour + (offMinute - onMinute) / 60;
      } else {
        duration = offHour - onHour + (offMinute - onMinute) / 60;
      }
    }

    // Calculer la consommation en kWh
    const consumption = (light.power * duration) / 1000;
    return consumption.toFixed(2) + " kWh/jour";
  };

  // Obtenir la classe CSS pour le statut
  const getStatusClass = (status: string): string => {
    switch (status) {
      case "Allumé":
        return "bg-green-100 text-green-800";
      case "Éteint":
        return "bg-gray-100 text-gray-800";
      case "Défectueux":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            {type === "pdf"
              ? "Génération du rapport PDF"
              : "Génération du rapport Excel"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Commune:</strong> {municipality}
          </p>
          <p className="mb-2">
            <strong>Nombre d'équipements:</strong> {processedData.length}
          </p>
          <p className="mb-2">
            <strong>Date du rapport:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        {isGenerating ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
            <p className="mt-4">Génération du rapport en cours...</p>
          </div>
        ) : isComplete && reportUrl ? (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mb-4">
              ✓
            </div>
            <p className="mb-4">Rapport généré avec succès!</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={() => {
                // Dans une application réelle, cela téléchargerait le fichier
                alert(
                  `Dans une application réelle, cela téléchargerait le fichier depuis: ${reportUrl}`
                );
              }}
            >
              Télécharger le rapport
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
              ✕
            </div>
            <p className="mb-4">
              Erreur lors de la génération du rapport. Veuillez réessayer.
            </p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
              onClick={generateReport}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Aperçu des données */}
        <div className="mt-6">
          <h4 className="font-bold mb-2">Aperçu des données</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Type</th>
                  <th className="border px-4 py-2">Statut</th>
                  <th className="border px-4 py-2">Puissance</th>
                  <th className="border px-4 py-2">Consommation</th>
                  <th className="border px-4 py-2">Réseau</th>
                  <th className="border px-4 py-2">Dernière maintenance</th>
                </tr>
              </thead>
              <tbody>
                {processedData.slice(0, 10).map((light) => (
                  <tr
                    key={light.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="border px-4 py-2">{light.id}</td>
                    <td className="border px-4 py-2">
                      {light.lamps && light.lamps[0]
                        ? light.lamps[0].lamp_type
                        : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          light.status
                        )}`}
                      >
                        {light.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      {light.powerConsumption
                        ? `${light.powerConsumption} W`
                        : "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {calculateDailyConsumption(light)}
                    </td>
                    <td className="border px-4 py-2">{light.network}</td>
                    <td className="border px-4 py-2">
                      {formatDate(light.lastMaintenance)}
                    </td>
                  </tr>
                ))}
                {processedData.length > 10 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="border px-4 py-2 text-center text-gray-500"
                    >
                      {processedData.length - 10} autres équipements non
                      affichés
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Résumé par réseau */}
        <div className="mt-6">
          <h4 className="font-bold mb-2">Résumé par réseau</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="border px-4 py-2">Réseau</th>
                  <th className="border px-4 py-2">Nombre d'équipements</th>
                  <th className="border px-4 py-2">Allumés</th>
                  <th className="border px-4 py-2">Éteints</th>
                  <th className="border px-4 py-2">Défectueux</th>
                  <th className="border px-4 py-2">Consommation totale</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(
                  new Set(processedData.map((light) => light.network))
                ).map((network) => {
                  const networkLights = processedData.filter(
                    (light) => light.network === network
                  );
                  const onLights = networkLights.filter(
                    (light) => light.status === "Allumé"
                  ).length;
                  const offLights = networkLights.filter(
                    (light) => light.status === "Éteint"
                  ).length;
                  const defectiveLights = networkLights.filter(
                    (light) => light.status === "Défectueux"
                  ).length;

                  // Calculer la consommation totale du réseau
                  const totalConsumption = networkLights.reduce(
                    (sum, light) => {
                      if (light.status === "Allumé" && light.power) {
                        const duration =
                          light.on_time && light.off_time
                            ? calculateDuration(light.on_time, light.off_time)
                            : 12;
                        return sum + (light.power * duration) / 1000;
                      }
                      return sum;
                    },
                    0
                  );

                  return (
                    <tr
                      key={network}
                      className="hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="border px-4 py-2">{network}</td>
                      <td className="border px-4 py-2">
                        {networkLights.length}
                      </td>
                      <td className="border px-4 py-2">{onLights}</td>
                      <td className="border px-4 py-2">{offLights}</td>
                      <td className="border px-4 py-2">{defectiveLights}</td>
                      <td className="border px-4 py-2">
                        {totalConsumption.toFixed(2)} kWh/jour
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour calculer la durée entre deux heures
function calculateDuration(onTime: string, offTime: string): number {
  try {
    const [onHour, onMinute] = onTime.split(":").map(Number);
    const [offHour, offMinute] = offTime.split(":").map(Number);

    let duration;
    if (offHour < onHour) {
      // Si l'heure d'arrêt est le jour suivant
      duration = 24 - onHour + offHour + (offMinute - onMinute) / 60;
    } else {
      duration = offHour - onHour + (offMinute - onMinute) / 60;
    }

    return Math.round(duration);
  } catch (e) {
    console.error("Erreur de calcul de la durée:", e);
    return 12; // Valeur par défaut
  }
}
