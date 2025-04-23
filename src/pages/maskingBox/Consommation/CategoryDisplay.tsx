import { useConsommation } from "@/hooks/useConsommation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CategoryDisplay = ({
  category,
}: {
  category: "LED" | "Decharges" | "All";
}) => {
  const {
    streetlightTypes,
    currentPeriod,
    setCurrentPeriod,
    filterByCategory,
    filterTotalsByCategory,
    formatXAF,
  } = useConsommation();

  const filteredData = filterByCategory(category);
  const filteredTotals = filterTotalsByCategory(category);
  const filteredTypes =
    category === "All"
      ? streetlightTypes
      : streetlightTypes.filter((type) => type.category === category);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {/* Consommation d'énergie */}
      <div>
        <div className="h-full bg-white dark:bg-gray-950 px-3 py-3 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              Consommation Énergétique {/* Détaillées */}
              {category !== "All" ? `- ${category}` : ""}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                className="border bg-white dark:bg-gray-900 rounded-lg p-2 text-sm"
                value={currentPeriod}
                onChange={(e) => setCurrentPeriod(e.target.value)}
              >
                <option>Journaliere</option>
                <option>Hebdomadaire</option>
                <option>Mensuelle</option>
                <option>Annuelle</option>
              </select>
            </div>
          </div>
          <div className="h-64 dark:bg-gray-900 bg-gray-100 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="temps" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" kWh" />
                <Tooltip
                  formatter={(value) => [`${value} kWh`]}
                  labelFormatter={(label) => `Temps: ${label}`}
                />
                <Legend verticalAlign="top" height={36} />
                {filteredTypes.map((type) => (
                  <Line
                    key={type.id}
                    type="monotone"
                    dataKey={`consommation_${type.id}`}
                    name={type.name}
                    stroke={type.couleur}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
            {filteredTypes.map((type) => (
              <div
                key={type.id}
                className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">
                      Lampadaires {type.name}
                    </p>
                    <p
                      className="font-medium text-lg mt-2"
                      style={{ color: type.couleur }}
                    >
                      {filteredTotals[`totalConsommation_${type.id}`] || 0} kWh
                    </p>
                  </div>
                  <div className="flex justify-center flex-col items-center">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: type.couleur }}
                    >
                      {type.quantite}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coût énergétique */}
      <div className="h-full bg-white dark:bg-gray-950 px-3 py-3 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Estimation Coût Énergétique{" "}
            {category !== "All" ? `- ${category}` : ""}
          </h2>
          <div className="border dark:bg-gray-900 rounded-lg p-2 text-sm text-gray-500">
            {currentPeriod}
          </div>
        </div>
        <div className="h-64 dark:bg-gray-900 bg-gray-100 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="temps" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${formatXAF(value)}`]}
                labelFormatter={(label) => `Temps: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />
              {filteredTypes.map((type) => (
                <Bar
                  key={type.id}
                  dataKey={`cout_${type.id}`}
                  name={`Coût ${type.name}`}
                  fill={type.couleur}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
          {filteredTypes.map((type) => (
            <div
              key={type.id}
              className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg"
            >
              <p className="text-xs text-gray-500">
                Coût énergétique {type.name}
              </p>
              <p
                className="font-medium text-lg mt-1"
                style={{ color: type.couleur }}
              >
                {formatXAF(filteredTotals[`totalCout_${type.id}`] || 0)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDisplay;
