/* eslint-disable @typescript-eslint/no-explicit-any */

interface Municipality {
  name: string;
  streetlightCount: number;
  avgOperatingHours: number;
  powerConsumption: number;
  ledPercentage: number;
}

export default function MunicipalityTable({
  municipalities,
  selectedMunicipality,
}: {
  municipalities: any;
  selectedMunicipality: any;
}) {
  return (
    <div className="mt-5 bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-8">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
        Comparaison par Commune
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Commune
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre de Lampadaires
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Heures/Jour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Consommation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                % LED
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {municipalities.map((municipality: Municipality) => (
              <tr
                key={municipality.name}
                className={`${
                  municipality.name === selectedMunicipality
                    ? "bg-blue-50 dark:bg-blue-900"
                    : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {municipality.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {municipality.streetlightCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {municipality.avgOperatingHours.toFixed(1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {municipality.powerConsumption.toFixed(0)} kWh
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {municipality.ledPercentage.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
