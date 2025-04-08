// src/components/Dashboard/StickerUsageChart.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartProps, BarChartData } from "./types";
import { MoveDownRight, MoveUpRight } from "lucide-react";

const StickerUsageChart: React.FC<ChartProps> = ({ data }) => {
  // Définir un gradient de couleurs pour représenter l'intensité d'utilisation
  const lowColor = "#EF4444"; // rouge clair pour faible utilisation
  const mediumColor = "#F59E00"; // Orange pour utilisation moyenne
  const highColor = "#10B722"; // Vert fonce pour utilisation élevée
  const criticalColor = "#059FFF"; // bleu pour utilisation très élevée

  // Définir des seuils pour déterminer les couleurs
  const getBarColor = (value: number) => {
    if (value < 40) return lowColor;
    if (value < 60) return mediumColor;
    if (value < 80) return highColor;
    return criticalColor;
  };

  // Calculer la valeur maximum pour l'affichage contextuel
  const maxValue = Math.max(
    ...(data as BarChartData[]).map((item) => item.stickers)
  );

  // Calculer la valeur moyenne
  const avgValue =
    (data as BarChartData[]).reduce((sum, item) => sum + item.stickers, 0) /
    data.length;

  return (
    <div className="h-full bg-white dark:bg-gray-950 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Utilisation des stickers par mois
      </h2>

      {/* Légende personnalisée */}
      <div className="flex flex-wrap mb-2 text-xs">
        <div className="flex items-center mr-4 mb-1">
          <div
            className="w-3 h-3 mr-1 rounded"
            style={{ backgroundColor: lowColor }}
          ></div>
          <span>Faible (&lt;40)</span>
        </div>
        <div className="flex items-center mr-4 mb-1">
          <div
            className="w-3 h-3 mr-1 rounded"
            style={{ backgroundColor: mediumColor }}
          ></div>
          <span>Moyen (40-59)</span>
        </div>
        <div className="flex items-center mr-4 mb-1">
          <div
            className="w-3 h-3 mr-1 rounded"
            style={{ backgroundColor: highColor }}
          ></div>
          <span>Élevé (60-79)</span>
        </div>
        <div className="flex items-center mb-1">
          <div
            className="w-3 h-3 mr-1 rounded"
            style={{ backgroundColor: criticalColor }}
          ></div>
          <span>Très élevé (80+)</span>
        </div>
      </div>

      {/* Statistiques sommaires */}
      <div className="flex flex-wrap mb-4 text-xs ">
        <div className="mr-4">
          Maximum: <span className="font-semibold">{maxValue} stickers</span>
        </div>
        <div>
          Moyenne:{" "}
          <span className="font-semibold">{avgValue.toFixed(1)} stickers</span>
        </div>
      </div>

      <div className="h-64 dark:bg-gray-900 bg-gray-100 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              opacity={0.2}
              // stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={{ stroke: "#ccc" }}
            />
            <YAxis
              tick={{ fill: "#666", fontSize: 12 }}
              axisLine={{ stroke: "#ccc" }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`${value} stickers`, "Quantité"]}
              labelFormatter={(name: string) => `Mois: ${name}`}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
            <Bar
              dataKey="stickers"
              name="Stickers utilisés"
              radius={[4, 4, 0, 0]}
            >
              {(data as BarChartData[]).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getBarColor(entry.stickers)}
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Bar>

            {/* Ligne pour la valeur moyenne */}
            <CartesianGrid
              horizontal={false}
              vertical={false}
              strokeDasharray="3 3"
              stroke="#666"
              y={140 - (avgValue / maxValue) * 120}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tendance */}
      <div className="flex  items-center gap-2 mt-2 text-xs ">
        <span className="font-medium">Tendance: </span>
        {(data as BarChartData[]).length >= 2 &&
        (data as BarChartData[])[data.length - 1].stickers >
          (data as BarChartData[])[data.length - 2].stickers ? (
          <span className="text-green-600 flex items-center justify-center">
            En hausse
            <MoveUpRight size={10} />{" "}
          </span>
        ) : (
          <span className="flex items-center justify-center text-red-600">
            En baisse
            <MoveDownRight size={10} />
          </span>
        )}
      </div>
    </div>
  );
};

export default StickerUsageChart;
