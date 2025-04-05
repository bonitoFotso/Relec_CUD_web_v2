import { Activity } from "lucide-react";

export default function ConsommationEnergie() {
  return (
    <div className="h-[100%] bg-white dark:bg-gray-950 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Consommation Énergétique</h2>
        <select className="border rounded-lg p-2 text-sm">
          <option>Journaliere</option>
          <option>Hebdomadaire</option>
          <option>Mensuelle </option>
        </select>
      </div>
      <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
        {/* Graphique d'évolution  */}
        <Activity className="h-8 w-8 text-gray-400" />
        <p className="text-gray-500 ml-2">Graphique de consommation</p>
      </div>

      <div className="mt-4 grid grid-cols-3 sm:grid-cols-1 lg:grid-cols-3 gap-2">
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Consommation totale </p>
          <p className="font-medium text-lg text-blue-500 mt-1">547 kWh</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Coût énergétique estimé</p>
          <p className="font-medium text-lg  text-orange-500 mt-1">
            206, 000.89 xaf
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg">
          <p className="text-xs text-gray-500">Économies réalisées</p>
          <p className="font-medium text-lg text-green-600 mt-1">-23%</p>
        </div>
      </div>
    </div>
  );
}
