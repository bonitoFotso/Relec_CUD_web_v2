/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

export default function ConsommationStatistics({
  filteredStreetlights,
}: {
  filteredStreetlights: any;
}) {
  // Calculer les statistiques de consommation par type de lampadaire
  const consommationData = useMemo(() => {
    if (!filteredStreetlights || filteredStreetlights.length === 0) {
      return [];
    }

    // Regrouper les lampadaires par type
    const groupedByType = filteredStreetlights.reduce(
      (
        acc: {
          [x: string]: {
            type: string;
            category: string;
            count: number;
            totalPower: number;
            totalOnTime: number;
            color: string;
          };
        },
        light: { lamps: { lamp_type: any }[]; power: any; on_time: any }
      ) => {
        if (!light.lamps || !light.lamps[0]) return acc;

        const lampType = light.lamps[0].lamp_type;
        const category = lampType.includes("LED") ? "LED" : "Décharge";

        const key = lampType;

        if (!acc[key]) {
          acc[key] = {
            type: lampType,
            category,
            count: 0,
            totalPower: 0,
            totalOnTime: 0,
            color: category === "LED" ? "#E91f67" : "#1F9800",
          };
        }

        acc[key].count += 1;
        acc[key].totalPower += light.power || 0;
        acc[key].totalOnTime += parseFloat(light.on_time || "6.5");

        return acc;
      },
      {}
    );

    // Calculer la consommation moyenne quotidienne (kWh/jour)
    return (
      Object.values(groupedByType) as {
        type: string;
        category: string;
        count: number;
        totalPower: number;
        totalOnTime: number;
        color: string;
      }[]
    )
      .map((group) => {
        const avgPower = group.count > 0 ? group.totalPower / group.count : 0;
        const avgOnTime =
          group.count > 0 ? group.totalOnTime / group.count : 6.5;

        // Consommation en kWh par jour = Puissance en W * Heures d'utilisation / 1000
        const dailyConsumption = (avgPower * avgOnTime) / 1000;

        // Coût journalier (94 FCFA/kWh)
        const dailyCost = dailyConsumption * 94;

        return {
          name: group.type,
          category: group.category,
          count: group.count,
          avgPower: Math.round(avgPower),
          avgOnTime: Math.round(avgOnTime * 10) / 10, // Arrondi à 1 décimale
          dailyConsumption: Math.round(dailyConsumption * 100) / 100,
          dailyCost: Math.round(dailyCost),
          color: group.color,
        };
      })
      .sort((a, b) => b.dailyConsumption - a.dailyConsumption); // Trier par consommation décroissante
  }, [filteredStreetlights]);

  // Calculer les totaux par catégorie
  const totals = useMemo(() => {
    const result: Record<
      "LED" | "Décharge",
      { count: number; consumption: number; cost: number }
    > = {
      LED: { count: 0, consumption: 0, cost: 0 },
      Décharge: { count: 0, consumption: 0, cost: 0 },
    };

    consommationData.forEach((item) => {
      result[item.category as "LED" | "Décharge"].count += item.count;
      result[item.category as "LED" | "Décharge"].consumption +=
        item.dailyConsumption * item.count;
      result[item.category as "LED" | "Décharge"].cost +=
        item.dailyCost * item.count;
    });

    return result;
  }, [consommationData]);

  // Données pour le graphique de consommation
  const chartData = useMemo(() => {
    return [
      {
        name: "LED",
        consommation: totals.LED.consumption,
        cout: totals.LED.cost,
        fill: "#E91f67",
      },
      {
        name: "Décharge",
        consommation: totals.Décharge.consumption,
        cout: totals.Décharge.cost,
        fill: "#1F9800",
      },
    ];
  }, [totals]);

  // Calculer la consommation totale
  const totalConsumption = totals.LED.consumption + totals.Décharge.consumption;
  const totalCost = totals.LED.cost + totals.Décharge.cost;

  // Formatter les valeurs monétaires
  const formatXAF = (value: ValueType) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " XAF";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-4">Consommation d'énergie</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Consommation totale</h3>
          <div className="text-3xl font-bold mb-2">
            {Math.round(totalConsumption * 100) / 100} kWh/jour
          </div>
          <div className="text-md text-gray-500">
            Coût estimé: {formatXAF(Math.round(totalCost))}/jour
          </div>
        </div>

        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg col-span-2">
          <h3 className="text-lg font-semibold mb-2">Répartition par type</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "consommation")
                      return [
                        typeof value === "number"
                          ? `${value.toFixed(2)} kWh`
                          : `${value} kWh`,
                        "Consommation",
                      ];
                    if (name === "cout") return [formatXAF(value), "Coût"];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="consommation"
                  name="Consommation (kWh)"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="cout"
                  name="Coût (XAF)"
                  fill="#82ca9d"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Type de lampadaire</th>
              <th className="px-4 py-2">Catégorie</th>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Puissance moyenne (W)</th>
              <th className="px-4 py-2">Temps d'allumage (h)</th>
              <th className="px-4 py-2">Consommation (kWh/jour)</th>
              <th className="px-4 py-2">Coût journalier</th>
            </tr>
          </thead>
          <tbody>
            {consommationData.map((item, index) => (
              <tr key={index} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.category === "LED"
                        ? "bg-pink-100 text-pink-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-2 text-right">{item.count}</td>
                <td className="px-4 py-2 text-right">{item.avgPower} W</td>
                <td className="px-4 py-2 text-right">{item.avgOnTime} h</td>
                <td className="px-4 py-2 text-right">
                  {item.dailyConsumption.toFixed(2)} kWh
                </td>
                <td className="px-4 py-2 text-right">
                  {formatXAF(item.dailyCost)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100 dark:bg-gray-700 font-bold">
            <tr>
              <td className="px-4 py-2" colSpan={2}>
                Total
              </td>
              <td className="px-4 py-2 text-right">
                {totals.LED.count + totals.Décharge.count}
              </td>
              <td className="px-4 py-2" colSpan={2}></td>
              <td className="px-4 py-2 text-right">
                {totalConsumption.toFixed(2)} kWh
              </td>
              <td className="px-4 py-2 text-right">{formatXAF(totalCost)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
