/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  selectedMunicipality: string;
  municipalities: any[];
  setSelectedMunicipality: (municipality: string) => void;
}
export default function ComparisationTable({
  selectedMunicipality,
  municipalities,
}: // setSelectedMunicipality,
Props) {
  return (
    <div className="w-full">
      {selectedMunicipality && (
        <div className="mb-8 ">
          {municipalities
            .filter((m) => m.name === selectedMunicipality)
            .map((municipality) => (
              <div key={municipality.name}>
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
                  <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
                    Vue d'ensemble - {municipality.name}
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Nombre de lampadaires:
                      </span>
                      <div className="bg-green-700  px-4 py-0.2 rounded">
                        <span className="font-medium text-white">
                          {municipality.streetlightCount}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Heures de fonctionnement:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {municipality.avgOperatingHours.toFixed(1)} h/jour
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Consommation totale:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {municipality.powerConsumption.toFixed(0)} kWh
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">
                        Pourcentage LED:
                      </span>
                      <span className="font-medium text-gray-800 dark:text-white">
                        {municipality.ledPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
