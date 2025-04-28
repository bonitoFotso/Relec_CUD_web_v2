import { useEquipements } from "@/contexts/EquipementContext";
import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "recharts";
import {
  BarChart,
  LineChart,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import ComparisationTable from "./ComparisationTable";

interface MunicipalityData {
  name: string;
  streetlightCount: number;
  avgOperatingHours: number;
  powerConsumption: number;
  ledPercentage: number;
  streetlightsByType: Record<string, number>;
}

interface OperatingHoursData {
  time: string;
  dayValue: number;
  nightValue: number;
}

const Analyses = () => {
  const { streetlights, loading, error } = useEquipements();
  const [municipalities, setMunicipalities] = useState<MunicipalityData[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");
  const [operatingHoursData, setOperatingHoursData] = useState<
    OperatingHoursData[]
  >([]);
  const [typeDistribution, setTypeDistribution] = useState<
    { name: string; value: number; color: string }[]
  >([]);

  // Process data when streetlights are loaded
  useEffect(() => {
    if (streetlights && streetlights.length > 0) {
      // Group streetlights by municipality
      const municipalityMap = new Map<string, MunicipalityData>();

      streetlights.forEach((streetlight) => {
        // Extract municipalities from streelights
        const municipality = streetlight.municipality || "Unknown";

        // Calculate operating hours
        const onTime = String(streetlight.on_time || "18:00");
        const offTime = String(streetlight.off_time || "06:00");
        const operatingHours = calculateOperatingHours(onTime, offTime);

        // Check if LED
        const isLED =
          streetlight.lamps?.[0]?.lamp_type?.includes("LED") || false;

        // Get type
        const lampType = streetlight.lamps?.[0]?.lamp_type || "Unknown";

        if (!municipalityMap.has(municipality)) {
          municipalityMap.set(municipality, {
            name: municipality,
            streetlightCount: 1,
            avgOperatingHours: operatingHours,
            powerConsumption: streetlight.power || 0,
            ledPercentage: isLED ? 100 : 0,
            streetlightsByType: { [lampType]: 1 },
          });
        } else {
          const data = municipalityMap.get(municipality)!;
          data.streetlightCount++;
          data.avgOperatingHours =
            (data.avgOperatingHours * (data.streetlightCount - 1) +
              operatingHours) /
            data.streetlightCount;
          data.powerConsumption += streetlight.power || 0;
          data.ledPercentage =
            (((data.ledPercentage / 100) * (data.streetlightCount - 1) +
              (isLED ? 1 : 0)) /
              data.streetlightCount) *
            100;

          // Update streetlight type count
          if (data.streetlightsByType[lampType]) {
            data.streetlightsByType[lampType]++;
          } else {
            data.streetlightsByType[lampType] = 1;
          }
        }
      });

      // Convert map to array
      const municipalitiesArray = Array.from(municipalityMap.values());
      setMunicipalities(municipalitiesArray);

      // Set first municipality as selected if available
      if (municipalitiesArray.length > 0 && !selectedMunicipality) {
        setSelectedMunicipality(municipalitiesArray[0].name);
      }
    }
  }, [selectedMunicipality, streetlights]);

  // Update operating hours data when municipality changes
  useEffect(() => {
    if (selectedMunicipality && streetlights) {
      // Filter streetlights for selected municipality
      const municipalityStreetlights = streetlights.filter(
        (streetlight) => streetlight.municipality === selectedMunicipality
      );

      // Create hourly operating data (24-hour format)
      const hourlyData: OperatingHoursData[] = Array.from(
        { length: 24 },
        (_, i) => ({
          time: `${i}:00`,
          dayValue: 0,
          nightValue: 0,
        })
      );

      // Fill in operating hours
      municipalityStreetlights.forEach((streetlight) => {
        const onTime = streetlight.on_time || "18:00";
        const offTime = streetlight.off_time || "06:00";

        const onHour = parseInt(String(onTime).split(":")[0], 10);
        const offHour = parseInt(String(offTime).split(":")[0], 10);

        // Définir les heures de jour (6h à 18h) et de nuit (18h à 6h)
        const isDayHour = (hour: number) => hour >= 6 && hour < 18;
        const isNightHour = (hour: number) => hour >= 18 || hour < 6;

        // Déterminer si le lampadaire est allumé à chaque heure
        // et incrémenter les valeurs de jour ou de nuit selon l'heure
        for (let i = 0; i < 24; i++) {
          let isActive = false;

          if (onHour < offHour) {
            // Simple case: on at 18:00, off at 06:00
            isActive = i >= onHour && i < offHour;
          } else {
            // Complex case: crosses midnight
            isActive = i >= onHour || i < offHour;
          }

          if (isActive) {
            if (isDayHour(i)) {
              hourlyData[i].dayValue++;
            } else if (isNightHour(i)) {
              hourlyData[i].nightValue++;
            }
          }
        }

        // On ajoute aussi la valeur d'activité basée sur is_on_day et is_on_night
        if (streetlight.is_on_day === 1) {
          for (let i = 6; i < 18; i++) {
            hourlyData[i].dayValue++;
          }
        }

        if (streetlight.is_on_night === 1) {
          for (let i = 0; i < 6; i++) {
            hourlyData[i].nightValue++;
          }
          for (let i = 18; i < 24; i++) {
            hourlyData[i].nightValue++;
          }
        }
      });

      setOperatingHoursData(hourlyData);

      // Process type distribution data
      if (selectedMunicipality && municipalities.length > 0) {
        const selectedData = municipalities.find(
          (m) => m.name === selectedMunicipality
        );
        if (selectedData) {
          const types = Object.entries(selectedData.streetlightsByType).map(
            ([name, value], index) => ({
              name,
              value,
              color: getChartColor(index),
            })
          );
          setTypeDistribution(types);
        }
      }
    }
  }, [selectedMunicipality, streetlights, municipalities]);

  // Helper function to calculate operating hours
  const calculateOperatingHours = (onTime: string, offTime: string): number => {
    const [onHour, onMinute] = onTime.split(":").map(Number);
    const [offHour, offMinute] = offTime.split(":").map(Number);

    let hours;
    if (offHour < onHour) {
      // Crossing midnight
      hours = 24 - onHour + offHour + (offMinute - onMinute) / 60;
    } else {
      hours = offHour - onHour + (offMinute - onMinute) / 60;
    }

    return parseFloat(hours.toFixed(2));
  };

  // Helper function to get chart colors
  const getChartColor = (index: number): string => {
    const colors = [
      "#10B722",
      "#059FFF",
      "#F59E00",
      "#EF4444",
      "#9333EA",
      "#8B5CF6",
      "#FBBF24",
      "#F87171",
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-center items-center h-64">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Chargement des données...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex justify-center items-center h-64">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Analyses du Fonctionnement des Réseaux d'Éclairage Publique
      </h1>
      <div className="flex gap-3 items-center mb-6">
        <label
          htmlFor="municipality"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Sélectionner une commune:
        </label>
        <select
          id="municipality"
          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 text-gray-700 dark:text-white"
          value={selectedMunicipality}
          onChange={(e) => setSelectedMunicipality(e.target.value)}
        >
          {municipalities.map((municipality) => (
            <option key={municipality.name} value={municipality.name}>
              {municipality.name}
            </option>
          ))}
        </select>
      </div>

      <ComparisationTable
        selectedMunicipality={selectedMunicipality}
        municipalities={municipalities}
        setSelectedMunicipality={setSelectedMunicipality}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Operating Hours Chart - Modifié pour afficher jour/nuit */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Heures de Fonctionnement Réelles (Jour/Nuit)
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={operatingHoursData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  dataKey="time"
                  tick={{ fill: "gray" }}
                  tickFormatter={(value) => value.split(":")[0]}
                />
                <YAxis tick={{ fill: "gray" }} />
                <Tooltip
                  formatter={(value, name) => {
                    const label =
                      name === "dayValue"
                        ? "Jour"
                        : name === "nightValue"
                        ? "Nuit"
                        : name;
                    return [`${value} lampadaires actifs`, label];
                  }}
                  labelFormatter={(label) => `Heure: ${label}`}
                />
                <Legend
                  formatter={(value) => {
                    return value === "dayValue"
                      ? "Jour (6h-18h)"
                      : value === "nightValue"
                      ? "Nuit (18h-6h)"
                      : value;
                  }}
                />
                {/* Ligne pour le fonctionnement de jour (bleu) */}
                <Line
                  type="monotone"
                  dataKey="dayValue"
                  name="dayValue"
                  stroke="#059FFF"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                {/* Ligne pour le fonctionnement de nuit (orange) */}
                <Line
                  type="monotone"
                  dataKey="nightValue"
                  name="nightValue"
                  stroke="#F59E00"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lamp Type Distribution */}
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Distribution par Type de Lampadaire
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} lampadaires`, "Quantité"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consumption Bar Chart */}
      <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
          Consommation Électrique par Commune
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={municipalities}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fill: "gray" }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tick={{ fill: "gray" }}
                label={{
                  value: "Consommation (kWh)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "gray" },
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} kWh`, "Consommation"]}
              />
              <Legend />
              <Bar
                dataKey="powerConsumption"
                name="Consommation Électrique"
                fill="#10B722"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analyses;
