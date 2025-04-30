/* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // /* eslint-disable react-hooks/exhaustive-deps */
// // import { useState, useEffect } from "react";

// // // Define the types for the streetlight data
// // interface Streetlight {
// //   id: string;
// //   municipality?: string;
// //   status: "Allumé" | "Éteint" | "Défectueux";
// //   location?: string;
// //   powerConsumption?: number;
// //   lastMaintenance?: string;
// //   network?: string;
// //   lamps?: Array<{
// //     lamp_type: string;
// //     with_balast: boolean;
// //     streetlight_id: string;
// //   }>;
// //   power?: number;
// //   on_time?: string;
// //   off_time?: string;
// // }

// // interface ReportGeneratorProps {
// //   type: "pdf" | "excel" | null;
// //   data: Streetlight[];
// //   municipality: string;
// //   onClose: () => void;
// // }

// // export default function ReportGenerator({
// //   type,
// //   data,
// //   municipality,
// //   onClose,
// // }: ReportGeneratorProps) {
// //   const [isGenerating, setIsGenerating] = useState<boolean>(false);
// //   const [isComplete, setIsComplete] = useState<boolean>(false);
// //   const [reportUrl, setReportUrl] = useState<string | null>(null);
// //   const [processedData, setProcessedData] = useState<Streetlight[]>([]);

// //   // Utilisation du contexte de consommation
// //   // Removed unused calculerConsommationMoyenne to fix the error

// //   // Traitement des données des lampadaires pour le rapport
// //   useEffect(() => {
// //     // Filtrer les lampadaires pour la commune spécifiée
// //     const communeData = data.filter(
// //       (light) =>
// //         light.municipality?.toLowerCase() === municipality.toLowerCase()
// //     );

// //     // Enrichir les données avec les informations de statut et réseau
// //     const enrichedData = communeData.map((light) => {
// //       // Déterminer le statut du lampadaire
// //       let status: "Allumé" | "Éteint" | "Défectueux";

// //       // Logique pour déterminer le statut du lampadaire
// //       // Dans une application réelle, cela proviendrait d'un capteur ou d'un système de surveillance
// //       const currentHour = new Date().getHours();
// //       const onHour = light.on_time ? parseInt(light.on_time.split(":")[0]) : 18;
// //       const offHour = light.off_time
// //         ? parseInt(light.off_time.split(":")[0])
// //         : 6;

// //       if (light.id.includes("DEF") || Math.random() < 0.05) {
// //         status = "Défectueux";
// //       } else if (
// //         (currentHour >= onHour || currentHour < offHour) &&
// //         light.power &&
// //         light.power > 0
// //       ) {
// //         status = "Allumé";
// //       } else {
// //         status = "Éteint";
// //       }

// //       // Déterminer le réseau du lampadaire
// //       const network = determineNetwork(light.id, light.location);

// //       return {
// //         ...light,
// //         status,
// //         network,
// //         // Assurer que powerConsumption est défini
// //         powerConsumption: light.power || 0,
// //       };
// //     });

// //     setProcessedData(enrichedData);
// //   }, [data, municipality]);

// //   // Fonction pour déterminer le réseau basé sur l'ID et la localisation
// //   const determineNetwork = (id: string, location?: string): string => {
// //     if (id.startsWith("N1")) return "Réseau Principal";
// //     if (id.startsWith("N2")) return "Réseau Secondaire";
// //     if (id.startsWith("N3")) return "Réseau Tertiaire";
// //     if (id.includes("RURAL")) return "Réseau Rural";
// //     if (location?.includes("Centre")) return "Réseau Centre-Ville";
// //     if (location?.includes("Ouest")) return "Réseau Ouest";
// //     if (location?.includes("Est")) return "Réseau Est";
// //     if (location?.includes("Nord")) return "Réseau Nord";
// //     if (location?.includes("Sud")) return "Réseau Sud";

// //     return "Réseau Non Spécifié";
// //   };

// //   const generateReport = async () => {
// //     if (!type) return;

// //     setIsGenerating(true);

// //     try {
// //       // Simuler une requête API pour générer le rapport
// //       await new Promise((resolve) => setTimeout(resolve, 2000));

// //       // URL fictive du rapport généré
// //       const mockUrl =
// //         type === "pdf"
// //           ? `/reports/streetlights-${municipality
// //               .toLowerCase()
// //               .replace(/\s+/g, "-")}-${
// //               new Date().toISOString().split("T")[0]
// //             }.pdf`
// //           : `/reports/streetlights-${municipality
// //               .toLowerCase()
// //               .replace(/\s+/g, "-")}-${
// //               new Date().toISOString().split("T")[0]
// //             }.xlsx`;

// //       setReportUrl(mockUrl);
// //       setIsComplete(true);
// //       setIsGenerating(false);
// //     } catch (error) {
// //       console.error("Erreur lors de la génération du rapport:", error);
// //       setIsGenerating(false);
// //     }
// //   };

// //   // Lancer la génération du rapport au montage du composant
// //   useEffect(() => {
// //     generateReport();
// //   }, []);

// //   // Formater une date pour l'affichage
// //   const formatDate = (date: string | undefined) => {
// //     if (!date) return "N/A";
// //     return new Date(date).toLocaleDateString();
// //   };

// //   // Calculer la consommation quotidienne en kWh
// //   const calculateDailyConsumption = (light: Streetlight): string => {
// //     if (!light.power) return "N/A";

// //     // Calculer la durée d'utilisation
// //     let duration = 12; // Valeur par défaut
// //     if (light.on_time && light.off_time) {
// //       const [onHour, onMinute] = light.on_time.split(":").map(Number);
// //       const [offHour, offMinute] = light.off_time.split(":").map(Number);

// //       if (offHour < onHour) {
// //         // Si l'heure d'arrêt est le jour suivant
// //         duration = 24 - onHour + offHour + (offMinute - onMinute) / 60;
// //       } else {
// //         duration = offHour - onHour + (offMinute - onMinute) / 60;
// //       }
// //     }

// //     // Calculer la consommation en kWh
// //     const consumption = (light.power * duration) / 1000;
// //     return consumption.toFixed(2) + " kWh/jour";
// //   };

// //   // Obtenir la classe CSS pour le statut
// //   const getStatusClass = (status: string): string => {
// //     switch (status) {
// //       case "Allumé":
// //         return "bg-green-100 text-green-800";
// //       case "Éteint":
// //         return "bg-gray-100 text-gray-800";
// //       case "Défectueux":
// //         return "bg-red-100 text-red-800";
// //       default:
// //         return "bg-gray-100 text-gray-800";
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
// //       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-auto">
// //         <div className="flex justify-between items-center mb-4">
// //           <h3 className="text-xl font-bold">
// //             {type === "pdf"
// //               ? "Génération du rapport PDF"
// //               : "Génération du rapport Excel"}
// //           </h3>
// //           <button
// //             onClick={onClose}
// //             className="text-gray-500 hover:text-gray-700"
// //           >
// //             ✕
// //           </button>
// //         </div>

// //         <div className="mb-4">
// //           <p className="mb-2">
// //             <strong>Commune:</strong> {municipality}
// //           </p>
// //           <p className="mb-2">
// //             <strong>Nombre d'équipements:</strong> {processedData.length}
// //           </p>
// //           <p className="mb-2">
// //             <strong>Date du rapport:</strong> {new Date().toLocaleDateString()}
// //           </p>
// //         </div>

// //         {isGenerating ? (
// //           <div className="flex flex-col items-center justify-center p-8">
// //             <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
// //             <p className="mt-4">Génération du rapport en cours...</p>
// //           </div>
// //         ) : isComplete && reportUrl ? (
// //           <div className="flex flex-col items-center justify-center p-4">
// //             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mb-4">
// //               ✓
// //             </div>
// //             <p className="mb-4">Rapport généré avec succès!</p>
// //             <button
// //               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
// //               onClick={() => {
// //                 // Dans une application réelle, cela téléchargerait le fichier
// //                 alert(
// //                   `Dans une application réelle, cela téléchargerait le fichier depuis: ${reportUrl}`
// //                 );
// //               }}
// //             >
// //               Télécharger le rapport
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="flex flex-col items-center justify-center p-4">
// //             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
// //               ✕
// //             </div>
// //             <p className="mb-4">
// //               Erreur lors de la génération du rapport. Veuillez réessayer.
// //             </p>
// //             <button
// //               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
// //               onClick={generateReport}
// //             >
// //               Réessayer
// //             </button>
// //           </div>
// //         )}

// //         {/* Aperçu des données */}
// //         <div className="mt-6">
// //           <h4 className="font-bold mb-2">Aperçu des données</h4>
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full border-collapse">
// //               <thead>
// //                 <tr className="bg-gray-100 dark:bg-gray-700">
// //                   <th className="border px-4 py-2">ID</th>
// //                   <th className="border px-4 py-2">Type</th>
// //                   <th className="border px-4 py-2">Statut</th>
// //                   <th className="border px-4 py-2">Puissance</th>
// //                   <th className="border px-4 py-2">Consommation</th>
// //                   <th className="border px-4 py-2">Réseau</th>
// //                   <th className="border px-4 py-2">Dernière maintenance</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {processedData.slice(0, 10).map((light) => (
// //                   <tr
// //                     key={light.id}
// //                     className="hover:bg-gray-50 dark:hover:bg-gray-600"
// //                   >
// //                     <td className="border px-4 py-2">{light.id}</td>
// //                     <td className="border px-4 py-2">
// //                       {light.lamps && light.lamps[0]
// //                         ? light.lamps[0].lamp_type
// //                         : "N/A"}
// //                     </td>
// //                     <td className="border px-4 py-2">
// //                       <span
// //                         className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
// //                           light.status
// //                         )}`}
// //                       >
// //                         {light.status}
// //                       </span>
// //                     </td>
// //                     <td className="border px-4 py-2">
// //                       {light.powerConsumption
// //                         ? `${light.powerConsumption} W`
// //                         : "N/A"}
// //                     </td>
// //                     <td className="border px-4 py-2">
// //                       {calculateDailyConsumption(light)}
// //                     </td>
// //                     <td className="border px-4 py-2">{light.network}</td>
// //                     <td className="border px-4 py-2">
// //                       {formatDate(light.lastMaintenance)}
// //                     </td>
// //                   </tr>
// //                 ))}
// //                 {processedData.length > 10 && (
// //                   <tr>
// //                     <td
// //                       colSpan={7}
// //                       className="border px-4 py-2 text-center text-gray-500"
// //                     >
// //                       {processedData.length - 10} autres équipements non
// //                       affichés
// //                     </td>
// //                   </tr>
// //                 )}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         {/* Résumé par réseau */}
// //         <div className="mt-6">
// //           <h4 className="font-bold mb-2">Résumé par réseau</h4>
// //           <div className="overflow-x-auto">
// //             <table className="min-w-full border-collapse">
// //               <thead>
// //                 <tr className="bg-gray-100 dark:bg-gray-700">
// //                   <th className="border px-4 py-2">Réseau</th>
// //                   <th className="border px-4 py-2">Nombre d'équipements</th>
// //                   <th className="border px-4 py-2">Allumés</th>
// //                   <th className="border px-4 py-2">Éteints</th>
// //                   <th className="border px-4 py-2">Défectueux</th>
// //                   <th className="border px-4 py-2">Consommation totale</th>
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {Array.from(
// //                   new Set(processedData.map((light) => light.network))
// //                 ).map((network) => {
// //                   const networkLights = processedData.filter(
// //                     (light) => light.network === network
// //                   );
// //                   const onLights = networkLights.filter(
// //                     (light) => light.status === "Allumé"
// //                   ).length;
// //                   const offLights = networkLights.filter(
// //                     (light) => light.status === "Éteint"
// //                   ).length;
// //                   const defectiveLights = networkLights.filter(
// //                     (light) => light.status === "Défectueux"
// //                   ).length;

// //                   // Calculer la consommation totale du réseau
// //                   const totalConsumption = networkLights.reduce(
// //                     (sum, light) => {
// //                       if (light.status === "Allumé" && light.power) {
// //                         const duration =
// //                           light.on_time && light.off_time
// //                             ? calculateDuration(light.on_time, light.off_time)
// //                             : 12;
// //                         return sum + (light.power * duration) / 1000;
// //                       }
// //                       return sum;
// //                     },
// //                     0
// //                   );

// //                   return (
// //                     <tr
// //                       key={network}
// //                       className="hover:bg-gray-50 dark:hover:bg-gray-600"
// //                     >
// //                       <td className="border px-4 py-2">{network}</td>
// //                       <td className="border px-4 py-2">
// //                         {networkLights.length}
// //                       </td>
// //                       <td className="border px-4 py-2">{onLights}</td>
// //                       <td className="border px-4 py-2">{offLights}</td>
// //                       <td className="border px-4 py-2">{defectiveLights}</td>
// //                       <td className="border px-4 py-2">
// //                         {totalConsumption.toFixed(2)} kWh/jour
// //                       </td>
// //                     </tr>
// //                   );
// //                 })}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>

// //         <div className="mt-6 flex justify-end space-x-2">
// //           <button
// //             onClick={onClose}
// //             className="border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
// //           >
// //             Fermer
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Fonction utilitaire pour calculer la durée entre deux heures
// // function calculateDuration(onTime: string, offTime: string): number {
// //   try {
// //     const [onHour, onMinute] = onTime.split(":").map(Number);
// //     const [offHour, offMinute] = offTime.split(":").map(Number);

// //     let duration;
// //     if (offHour < onHour) {
// //       // Si l'heure d'arrêt est le jour suivant
// //       duration = 24 - onHour + offHour + (offMinute - onMinute) / 60;
// //     } else {
// //       duration = offHour - onHour + (offMinute - onMinute) / 60;
// //     }

// //     return Math.round(duration);
// //   } catch (e) {
// //     console.error("Erreur de calcul de la durée:", e);
// //     return 12; // Valeur par défaut
// //   }
// // }

// import { useState, useEffect, useRef } from "react";
// import { saveAs } from "file-saver";
// import * as XLSX from "xlsx";
// import { jsPDF } from "jspdf";

// // Cette interface doit correspondre à ce qui est défini dans EquipementService
// interface Streetlight {
//   id: number;
//   municipality?: string;
//   location?: string;
//   power: number;
//   on_time: string;
//   off_time: string;
//   is_on_day: number;
//   is_on_night: number;
//   network_id: number;
//   network?: string;
//   lastMaintenance?: string;
//   updated_at: string;
//   support_condition: string;
//   lamps?: Array<{
//     id: number;
//     streelight_id: number;
//     lamp_type: string;
//     with_balast: boolean;
//     power: number;
//   }>;
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
//   const [error, setError] = useState<string | null>(null);
//   const [processedData, setProcessedData] = useState<any[]>([]);
//   const [networkSummary, setNetworkSummary] = useState<any[]>([]);

//   // References for downloading files
//   const downloadLinkRef = useRef<HTMLAnchorElement>(null);

//   // Process data for the report
//   useEffect(() => {
//     try {
//       // Transform the API data into a format suitable for reporting
//       const enrichedData = data.map((light) => {
//         // Calculate light status based on real data
//         let status: "Allumé" | "Éteint" | "Défectueux";

//         // Determine status from API data
//         if (
//           light.support_condition?.toLowerCase().includes("défectueux") ||
//           light.support_condition?.toLowerCase().includes("defectueux")
//         ) {
//           status = "Défectueux";
//         } else if (
//           light.is_on_night === 1 &&
//           isNightTime(light.on_time, light.off_time)
//         ) {
//           status = "Allumé";
//         } else {
//           status = "Éteint";
//         }

//         // Get network from API or derive from network_id
//         const network = light.network || getNetworkFromId(light.network_id);

//         // Get last maintenance date from updated_at
//         const lastMaintenance = light.lastMaintenance || light.updated_at;

//         // Calculate daily consumption
//         const dailyConsumption = calculateDailyConsumption(light);

//         return {
//           id: light.id,
//           lamp_type: light.lamps?.[0]?.lamp_type || "Standard",
//           status,
//           power: light.power || light.lamps?.[0]?.power || 0,
//           dailyConsumption,
//           network,
//           lastMaintenance,
//           location: light.location || "Non spécifié",
//         };
//       });

//       setProcessedData(enrichedData);

//       // Generate network summary
//       const networks = Array.from(
//         new Set(enrichedData.map((item) => item.network))
//       );
//       const summary = networks.map((network) => {
//         const networkItems = enrichedData.filter(
//           (item) => item.network === network
//         );
//         const onLights = networkItems.filter(
//           (item) => item.status === "Allumé"
//         ).length;
//         const offLights = networkItems.filter(
//           (item) => item.status === "Éteint"
//         ).length;
//         const defectiveLights = networkItems.filter(
//           (item) => item.status === "Défectueux"
//         ).length;

//         // Calculate total consumption for this network
//         const totalConsumption = networkItems.reduce((sum, item) => {
//           if (item.status === "Allumé") {
//             const consumption = parseFloat(item.dailyConsumption);
//             return isNaN(consumption) ? sum : sum + consumption;
//           }
//           return sum;
//         }, 0);

//         return {
//           network,
//           total: networkItems.length,
//           on: onLights,
//           off: offLights,
//           defective: defectiveLights,
//           consumption: totalConsumption.toFixed(2),
//         };
//       });

//       setNetworkSummary(summary);
//     } catch (err) {
//       console.error("Erreur lors du traitement des données:", err);
//       setError("Erreur lors du traitement des données pour le rapport.");
//     }
//   }, [data]);

//   // Generate and download the report
//   useEffect(() => {
//     if (!type || processedData.length === 0) return;

//     const generateReport = async () => {
//       setIsGenerating(true);
//       setError(null);

//       try {
//         if (type === "pdf") {
//           await generatePDFReport();
//         } else if (type === "excel") {
//           generateExcelReport();
//         }

//         setIsComplete(true);
//       } catch (err) {
//         console.error("Erreur lors de la génération du rapport:", err);
//         setError("Échec de la génération du rapport. Veuillez réessayer.");
//       } finally {
//         setIsGenerating(false);
//       }
//     };

//     generateReport();
//   }, [type, processedData]);

//   // Generate PDF report using jsPDF
//   const generatePDFReport = async () => {
//     return new Promise<void>((resolve, reject) => {
//       try {
//         // Create PDF document
//         const doc = new jsPDF();

//         // Add title
//         doc.setFontSize(18);
//         doc.text(`Rapport des Lampadaires - ${municipality}`, 14, 20);

//         // Add report date
//         doc.setFontSize(11);
//         doc.text(`Date du rapport: ${new Date().toLocaleDateString()}`, 14, 30);
//         doc.text(`Nombre d'équipements: ${processedData.length}`, 14, 37);

//         // Add equipment table
//         (doc as any).autoTable({
//           head: [
//             [
//               "ID",
//               "Type",
//               "Statut",
//               "Puissance",
//               "Conso. Quotidienne",
//               "Réseau",
//             ],
//           ],
//           body: processedData.map((item) => [
//             item.id,
//             item.lamp_type,
//             item.status,
//             `${item.power} W`,
//             `${item.dailyConsumption} kWh/j`,
//             item.network,
//           ]),
//           startY: 45,
//           theme: "grid",
//           headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//           alternateRowStyles: { fillColor: [245, 245, 245] },
//         });

//         // Add network summary table
//         const finalY = (doc as any).lastAutoTable.finalY;

//         doc.setFontSize(14);
//         doc.text("Résumé par Réseau", 14, finalY + 15);

//         (doc as any).autoTable({
//           head: [
//             [
//               "Réseau",
//               "Total",
//               "Allumés",
//               "Éteints",
//               "Défectueux",
//               "Conso. Totale",
//             ],
//           ],
//           body: networkSummary.map((item) => [
//             item.network,
//             item.total,
//             item.on,
//             item.off,
//             item.defective,
//             `${item.consumption} kWh/j`,
//           ]),
//           startY: finalY + 20,
//           theme: "grid",
//           headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//         });

//         // Add footer
//         const pageCount = (doc as any).internal.getNumberOfPages();
//         for (let i = 1; i <= pageCount; i++) {
//           doc.setPage(i);
//           doc.setFontSize(10);
//           doc.text(
//             `Page ${i} sur ${pageCount}`,
//             doc.internal.pageSize.width - 30,
//             doc.internal.pageSize.height - 10
//           );
//         }

//         // Save PDF
//         const pdfBlob = doc.output("blob");
//         const url = URL.createObjectURL(pdfBlob);

//         // Trigger download
//         if (downloadLinkRef.current) {
//           downloadLinkRef.current.href = url;
//           downloadLinkRef.current.download = `rapport-lampadaires-${municipality
//             .toLowerCase()
//             .replace(/\s+/g, "-")}-${
//             new Date().toISOString().split("T")[0]
//           }.pdf`;
//           downloadLinkRef.current.click();
//         }

//         resolve();
//       } catch (error) {
//         console.error("Erreur PDF:", error);
//         reject(error);
//       }
//     });
//   };

//   // Generate Excel report using XLSX
//   const generateExcelReport = () => {
//     try {
//       // Create worksheet for equipment data
//       const equipmentWS = XLSX.utils.json_to_sheet(
//         processedData.map((item) => ({
//           ID: item.id,
//           Type: item.lamp_type,
//           Statut: item.status,
//           Puissance: `${item.power} W`,
//           "Consommation Quotidienne": `${item.dailyConsumption} kWh/j`,
//           Réseau: item.network,
//           "Dernière Maintenance": formatDate(item.lastMaintenance),
//           Localisation: item.location,
//         }))
//       );

//       // Create worksheet for network summary
//       const summaryWS = XLSX.utils.json_to_sheet(
//         networkSummary.map((item) => ({
//           Réseau: item.network,
//           "Total Équipements": item.total,
//           Allumés: item.on,
//           Éteints: item.off,
//           Défectueux: item.defective,
//           "Consommation Totale": `${item.consumption} kWh/j`,
//         }))
//       );

//       // Create workbook with both worksheets
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, equipmentWS, "Équipements");
//       XLSX.utils.book_append_sheet(wb, summaryWS, "Résumé par Réseau");

//       // Generate Excel file
//       const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//       const blob = new Blob([excelBuffer], {
//         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       });

//       // Save file
//       saveAs(
//         blob,
//         `rapport-lampadaires-${municipality
//           .toLowerCase()
//           .replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.xlsx`
//       );
//     } catch (error) {
//       console.error("Erreur Excel:", error);
//       throw error;
//     }
//   };

//   // Helper function to format date
//   const formatDate = (dateStr?: string) => {
//     if (!dateStr) return "N/A";
//     try {
//       return new Date(dateStr).toLocaleDateString();
//     } catch (e) {
//       return "N/A";
//     }
//   };

//   // Helper function to calculate daily consumption in kWh
//   const calculateDailyConsumption = (light: Streetlight): string => {
//     if (!light.power) return "N/A";

//     // Calculate usage duration based on on_time and off_time
//     let duration = 12; // Default
//     if (light.on_time && light.off_time) {
//       try {
//         const [onHour, onMinute] = light.on_time.split(":").map(Number);
//         const [offHour, offMinute] = light.off_time.split(":").map(Number);

//         if (offHour < onHour) {
//           // If off time is next day
//           duration = 24 - onHour + offHour + (offMinute - onMinute) / 60;
//         } else {
//           duration = offHour - onHour + (offMinute - onMinute) / 60;
//         }
//       } catch (e) {
//         console.warn("Erreur de format d'heure:", e);
//       }
//     }

//     // Calculate consumption in kWh
//     const consumption = (light.power * duration) / 1000;
//     return consumption.toFixed(2);
//   };

//   // Helper function to check if current time is between on_time and off_time
//   const isNightTime = (onTime?: string, offTime?: string): boolean => {
//     if (!onTime || !offTime) return false;

//     try {
//       const now = new Date();
//       const currentHour = now.getHours();
//       const currentMinute = now.getMinutes();

//       const [onHour, onMinute] = onTime.split(":").map(Number);
//       const [offHour, offMinute] = offTime.split(":").map(Number);

//       // Convert times to minutes for easier comparison
//       const currentTimeInMinutes = currentHour * 60 + currentMinute;
//       const onTimeInMinutes = onHour * 60 + onMinute;
//       const offTimeInMinutes = offHour * 60 + offMinute;

//       if (offTimeInMinutes < onTimeInMinutes) {
//         // Night spans midnight (e.g., 18:00 to 06:00)
//         return (
//           currentTimeInMinutes >= onTimeInMinutes ||
//           currentTimeInMinutes <= offTimeInMinutes
//         );
//       } else {
//         // Night contained within same day (e.g., 00:00 to 06:00)
//         return (
//           currentTimeInMinutes >= onTimeInMinutes &&
//           currentTimeInMinutes <= offTimeInMinutes
//         );
//       }
//     } catch (e) {
//       console.warn("Erreur lors de la vérification de l'heure:", e);
//       return false;
//     }
//   };

//   // Helper function to derive network from network_id
//   const getNetworkFromId = (networkId: number): string => {
//     const networks: { [key: number]: string } = {
//       1: "Réseau Principal",
//       2: "Réseau Secondaire",
//       3: "Réseau Tertiaire",
//       4: "Réseau Rural",
//       5: "Réseau Centre-Ville",
//     };

//     return networks[networkId] || `Réseau ${networkId}`;
//   };

//   // Get CSS class for status label
//   const getStatusClass = (status: string): string => {
//     switch (status) {
//       case "Allumé":
//         return "bg-green-100 text-green-800";
//       case "Éteint":
//         return "bg-gray-100 text-gray-800";
//       case "Défectueux":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-auto">
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
//           <p className="mb-2">
//             <strong>Date du rapport:</strong> {new Date().toLocaleDateString()}
//           </p>
//         </div>

//         {isGenerating ? (
//           <div className="flex flex-col items-center justify-center p-8">
//             <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
//             <p className="mt-4">Génération du rapport en cours...</p>
//           </div>
//         ) : error ? (
//           <div className="flex flex-col items-center justify-center p-4">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mb-4">
//               ✕
//             </div>
//             <p className="mb-4">{error}</p>
//             <button
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
//               onClick={() => {
//                 setError(null);
//                 setIsGenerating(true);

//                 if (type === "pdf") {
//                   generatePDFReport()
//                     .then(() => {
//                       setIsComplete(true);
//                       setIsGenerating(false);
//                     })
//                     .catch(() => {
//                       setError("Échec de la génération du rapport PDF.");
//                       setIsGenerating(false);
//                     });
//                 } else if (type === "excel") {
//                   try {
//                     generateExcelReport();
//                     setIsComplete(true);
//                     setIsGenerating(false);
//                   } catch (e) {
//                     setError("Échec de la génération du rapport Excel.");
//                     setIsGenerating(false);
//                   }
//                 }
//               }}
//             >
//               Réessayer
//             </button>
//           </div>
//         ) : isComplete ? (
//           <div className="flex flex-col items-center justify-center p-4">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mb-4">
//               ✓
//             </div>
//             <p className="mb-4">Rapport généré avec succès!</p>
//             <button
//               className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
//               onClick={() => {
//                 // Trigger report generation again for download
//                 if (type === "pdf") {
//                   generatePDFReport();
//                 } else if (type === "excel") {
//                   generateExcelReport();
//                 }
//               }}
//             >
//               Télécharger à nouveau
//             </button>
//           </div>
//         ) : null}

//         {/* Hidden download link for PDF */}
//         <a
//           ref={downloadLinkRef}
//           style={{ display: "none" }}
//           href="#"
//           download="report.pdf"
//         >
//           Download
//         </a>

//         {/* Aperçu des données */}
//         <div className="mt-6">
//           <h4 className="font-bold mb-2">Aperçu des données</h4>
//           <div className="overflow-x-auto">
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-100 dark:bg-gray-700">
//                   <th className="border px-4 py-2">ID</th>
//                   <th className="border px-4 py-2">Type</th>
//                   <th className="border px-4 py-2">Statut</th>
//                   <th className="border px-4 py-2">Puissance</th>
//                   <th className="border px-4 py-2">Consommation</th>
//                   <th className="border px-4 py-2">Réseau</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {processedData.slice(0, 10).map((item) => (
//                   <tr
//                     key={item.id}
//                     className="hover:bg-gray-50 dark:hover:bg-gray-600"
//                   >
//                     <td className="border px-4 py-2">{item.id}</td>
//                     <td className="border px-4 py-2">{item.lamp_type}</td>
//                     <td className="border px-4 py-2">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
//                           item.status
//                         )}`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     <td className="border px-4 py-2">{item.power} W</td>
//                     <td className="border px-4 py-2">
//                       {item.dailyConsumption} kWh/j
//                     </td>
//                     <td className="border px-4 py-2">{item.network}</td>
//                   </tr>
//                 ))}
//                 {processedData.length > 10 && (
//                   <tr>
//                     <td
//                       colSpan={6}
//                       className="border px-4 py-2 text-center text-gray-500"
//                     >
//                       {processedData.length - 10} autres équipements non
//                       affichés
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Résumé par réseau */}
//         {networkSummary.length > 0 && (
//           <div className="mt-6">
//             <h4 className="font-bold mb-2">Résumé par réseau</h4>
//             <div className="overflow-x-auto">
//               <table className="min-w-full border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100 dark:bg-gray-700">
//                     <th className="border px-4 py-2">Réseau</th>
//                     <th className="border px-4 py-2">Nombre d'équipements</th>
//                     <th className="border px-4 py-2">Allumés</th>
//                     <th className="border px-4 py-2">Éteints</th>
//                     <th className="border px-4 py-2">Défectueux</th>
//                     <th className="border px-4 py-2">Consommation totale</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {networkSummary.map((item, index) => (
//                     <tr
//                       key={index}
//                       className="hover:bg-gray-50 dark:hover:bg-gray-600"
//                     >
//                       <td className="border px-4 py-2">{item.network}</td>
//                       <td className="border px-4 py-2">{item.total}</td>
//                       <td className="border px-4 py-2">{item.on}</td>
//                       <td className="border px-4 py-2">{item.off}</td>
//                       <td className="border px-4 py-2">{item.defective}</td>
//                       <td className="border px-4 py-2">
//                         {item.consumption} kWh/j
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

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

import React, { useState } from "react";
import { FilePen, FileSpreadsheet } from "lucide-react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Extend jsPDF type to include autoTable and lastAutoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => void;
    lastAutoTable: { finalY: number };
  }
}
import * as XLSX from "xlsx";
import { useConsommation } from "@/hooks/useConsommation";
import { useEquipements } from "@/contexts/EquipementContext";

interface ReportGeneratorProps {
  title?: string;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({
  title = "Statistiques du panneau de contrôle",
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadType, setDownloadType] = useState<string>("");

  // Utiliser les hooks pour accéder aux données
  const { streetlightTypes, currentPeriod, data, totals, formatXAF } =
    useConsommation();
  const { streetlights } = useEquipements();

  // Fonction pour générer un fichier PDF
  const generatePDF = async () => {
    setLoading(true);
    setDownloadType("pdf");

    try {
      // Créer un nouveau document PDF
      const doc = new jsPDF();

      // Ajouter le titre
      doc.setFontSize(18);
      doc.text(title, 14, 20);

      // Ajouter la date
      const date = new Date().toLocaleDateString("fr-FR");
      doc.setFontSize(10);
      doc.text(`Généré le : ${date}`, 14, 30);
      doc.text(`Période : ${currentPeriod}`, 14, 35);

      // Statistiques générales
      doc.setFontSize(14);
      doc.text("Statistiques générales", 14, 45);

      // Tableau des lampadaires
      const lampHeaders = [
        [
          "Type",
          "Quantité",
          "Puissance (W)",
          "Rendement (lm/W)",
          "Conso./nuit (kWh)",
        ],
      ];

      const lampData = streetlightTypes.map((type) => [
        type.name,
        type.quantite.toString(),
        type.puissanceConsommee.toString(),
        (type.puissanceLumineuse / type.puissanceConsommee || 0).toFixed(2),
        ((type.puissanceConsommee * type.dureeUtilisation) / 1000).toFixed(2),
      ]);

      doc.autoTable({
        head: lampHeaders,
        body: lampData,
        startY: 50,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      // Consommation d'énergie
      doc.setFontSize(14);
      doc.text("Consommation d'énergie", 14, doc.lastAutoTable.finalY + 15);

      // Résumé de la consommation
      const consumptionHeaders = [
        ["Catégorie", "Consommation totale (kWh)", "Coût total (XAF)"],
      ];

      const consumptionData = [
        [
          "LED",
          totals?.totalConsommation_LED?.toString() || "0",
          formatXAF(totals?.totalCout_LED || 0).replace(" XAF", ""),
        ],
        [
          "Lampes à décharge",
          totals?.totalConsommation_Decharges?.toString() || "0",
          formatXAF(totals?.totalCout_Decharges || 0).replace(" XAF", ""),
        ],
        [
          "Total",
          (
            (totals?.totalConsommation_LED || 0) +
            (totals?.totalConsommation_Decharges || 0)
          ).toString(),
          formatXAF(
            (totals?.totalCout_LED || 0) + (totals?.totalCout_Decharges || 0)
          ).replace(" XAF", ""),
        ],
      ];

      doc.autoTable({
        head: consumptionHeaders,
        body: consumptionData,
        startY: doc.lastAutoTable.finalY + 20,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      // État des lampadaires
      doc.setFontSize(14);
      doc.text("État des lampadaires", 14, doc.lastAutoTable.finalY + 15);

      // Calculer le nombre de lampadaires par état
      const onLights = streetlights.filter(
        (light) => light.is_on_day === 1 || light.is_on_night === 1
      ).length;
      const offLights = streetlights.filter(
        (light) => light.is_on_day === 0 && light.is_on_night === 0
      ).length;
      const faultyLights = streetlights.filter(
        (light) =>
          (light.is_on_day === 1 && light.is_on_night === 0) ||
          (light.is_on_day === 0 && light.is_on_night === 1)
      ).length;

      const statusHeaders = [["État", "Nombre", "Pourcentage"]];
      const totalLights = streetlights.length;

      const statusData = [
        [
          "Allumés",
          onLights.toString(),
          ((onLights / totalLights) * 100).toFixed(1) + "%",
        ],
        [
          "Éteints",
          offLights.toString(),
          ((offLights / totalLights) * 100).toFixed(1) + "%",
        ],
        [
          "Défectueux",
          faultyLights.toString(),
          ((faultyLights / totalLights) * 100).toFixed(1) + "%",
        ],
        ["Total", totalLights.toString(), "100%"],
      ];

      doc.autoTable({
        head: statusHeaders,
        body: statusData,
        startY: doc.lastAutoTable.finalY + 20,
        theme: "grid",
        styles: { fontSize: 8 },
        headStyles: { fillColor: [66, 139, 202] },
      });

      // Pied de page
      const pageCount = doc.internal.pages.length - 1;
      doc.setFontSize(8);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(
          `Page ${i} sur ${pageCount}`,
          14,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          "Rapport généré par Masking Box",
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: "center" }
        );
      }

      // Enregistrer le PDF
      doc.save(`Rapport_${currentPeriod}_${date.replace(/\//g, "-")}.pdf`);
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error);
      alert("Une erreur est survenue lors de la génération du PDF.");
    } finally {
      setLoading(false);
      setDownloadType("");
    }
  };

  // Fonction pour générer un fichier Excel
  const generateExcel = async () => {
    setLoading(true);
    setDownloadType("excel");

    try {
      // Créer un nouveau classeur
      const wb = XLSX.utils.book_new();

      // Feuille 1: Statistiques générales
      const generalStats = [
        ["Rapport de statistiques du panneau de contrôle"],
        ["Généré le", new Date().toLocaleDateString("fr-FR")],
        ["Période", currentPeriod],
        [""],
        ["Nombre total de lampadaires", streetlights.length],
        [
          "Lampadaires allumés",
          streetlights.filter(
            (light) => light.is_on_day === 1 || light.is_on_night === 1
          ).length,
        ],
        [
          "Lampadaires éteints",
          streetlights.filter(
            (light) => light.is_on_day === 0 && light.is_on_night === 0
          ).length,
        ],
        [
          "Lampadaires défectueux",
          streetlights.filter(
            (light) =>
              (light.is_on_day === 1 && light.is_on_night === 0) ||
              (light.is_on_day === 0 && light.is_on_night === 1)
          ).length,
        ],
      ];

      const wsGeneral = XLSX.utils.aoa_to_sheet(generalStats);
      XLSX.utils.book_append_sheet(wb, wsGeneral, "Statistiques générales");

      // Feuille 2: Types de lampadaires
      const typeHeaders = [
        [
          "Type",
          "Quantité",
          "Puissance (W)",
          "Rendement (lm/W)",
          "Consommation par nuit (kWh)",
        ],
      ];

      const typeData = streetlightTypes.map((type) => [
        type.name,
        type.quantite,
        type.puissanceConsommee,
        (type.puissanceLumineuse / type.puissanceConsommee || 0).toFixed(2),
        ((type.puissanceConsommee * type.dureeUtilisation) / 1000).toFixed(2),
      ]);

      const wsTypes = XLSX.utils.aoa_to_sheet([...typeHeaders, ...typeData]);
      XLSX.utils.book_append_sheet(wb, wsTypes, "Types de lampadaires");

      // Feuille 3: Consommation & coûts
      const consumptionHeaders = [
        ["Catégorie", "Consommation totale (kWh)", "Coût total (XAF)"],
      ];

      const consumptionData = [
        ["LED", totals?.totalConsommation_LED || 0, totals?.totalCout_LED || 0],
        [
          "Lampes à décharge",
          totals?.totalConsommation_Decharges || 0,
          totals?.totalCout_Decharges || 0,
        ],
        [
          "Total",
          (totals?.totalConsommation_LED || 0) +
            (totals?.totalConsommation_Decharges || 0),
          (totals?.totalCout_LED || 0) + (totals?.totalCout_Decharges || 0),
        ],
      ];

      const wsConsumption = XLSX.utils.aoa_to_sheet([
        ...consumptionHeaders,
        ...consumptionData,
      ]);
      XLSX.utils.book_append_sheet(wb, wsConsumption, "Consommation & coûts");

      // Feuille 4: Données périodiques
      const periodData = [["Période", ...data.map((item) => item.temps)]];

      // Ajouter les données de consommation pour chaque type
      streetlightTypes.forEach((type) => {
        const row = [
          `Consommation ${type.name} (kWh)`,
          ...data.map((item) => item[`consommation_${type.id}`] || 0),
        ];
        periodData.push(row);

        const costRow = [
          `Coût ${type.name} (XAF)`,
          ...data.map((item) => item[`cout_${type.id}`] || 0),
        ];
        periodData.push(costRow);
      });

      // Ajouter les données de consommation par catégorie
      periodData.push([
        `Consommation LED (kWh)`,
        ...data.map((item) => item[`consommation_LED`] || 0),
      ]);
      periodData.push([
        `Coût LED (XAF)`,
        ...data.map((item) => item[`cout_LED`] || 0),
      ]);

      periodData.push([
        `Consommation Décharges (kWh)`,
        ...data.map((item) => item[`consommation_Decharges`] || 0),
      ]);
      periodData.push([
        `Coût Décharges (XAF)`,
        ...data.map((item) => item[`cout_Decharges`] || 0),
      ]);

      const wsPeriod = XLSX.utils.aoa_to_sheet(periodData);
      XLSX.utils.book_append_sheet(wb, wsPeriod, "Données périodiques");

      // Exporter le fichier Excel
      const date = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");
      XLSX.writeFile(wb, `Rapport_${currentPeriod}_${date}.xlsx`);
    } catch (error) {
      console.error("Erreur lors de la génération du fichier Excel:", error);
      alert("Une erreur est survenue lors de la génération du fichier Excel.");
    } finally {
      setLoading(false);
      setDownloadType("");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        onClick={generatePDF}
        disabled={loading}
      >
        {loading && downloadType === "pdf" ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        ) : (
          <FilePen size={16} />
        )}
        Télécharger PDF
      </button>

      <button
        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300"
        onClick={generateExcel}
        disabled={loading}
      >
        {loading && downloadType === "excel" ? (
          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
        ) : (
          <FileSpreadsheet size={16} />
        )}
        Télécharger Excel
      </button>
    </div>
  );
};

export default ReportGenerator;
