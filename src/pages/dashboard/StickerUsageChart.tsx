// src/components/Dashboard/StickerUsageChart.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartProps } from "./types";
import { useEquipements } from "@/contexts/EquipementContext";

// Nouveau type pour les données du graphique
interface EquipmentData {
  name: string;
  streetlights: number;
  metters: number;
  cabinets: number;
  substations: number;
}

type EquipmentKey = 'streetlights' | 'metters' | 'cabinets' | 'substations';

const StickerUsageChart: React.FC<ChartProps> = () => {
  const {
    streetlights,
    metters,
    cabinets,
    substations
  } = useEquipements();

  // Préparer les données pour le graphique
  const chartData: EquipmentData[] = [
    {
      name: "Équipements",
      streetlights: streetlights.length,
      metters: metters.length,
      cabinets: cabinets.length,
      substations: substations.length,
    }
  ];

  // Couleurs pour chaque type d'équipement
  const colors: Record<EquipmentKey, string> = {
    streetlights: "#3B82F6",
    metters: "#10B981",
    cabinets: "#F59E0B",
    substations: "#EF4444",
  };

  return (
    <div className="h-full bg-white dark:bg-gray-950 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        Répartition des plaquettes d'identification par type d'équipement
      </h2>

      {/* Légende */}
      <div className="flex flex-wrap mb-4 text-xs">
        {Object.entries(colors).map(([key, color]) => (
          <div key={key} className="flex items-center mr-4 mb-1">
            <div
              className="w-3 h-3 mr-1 rounded"
              style={{ backgroundColor: color }}
            ></div>
            <span>
              {key === 'streetlights' && 'Lampadaires'}
              {key === 'metters' && 'Compteurs'}
              {key === 'cabinets' && 'Armoires'}
              {key === 'substations' && 'Postes'}
            </span>
          </div>
        ))}
      </div>

      <div className="h-64 dark:bg-gray-900 bg-gray-100 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              width={80}
              tick={{ fontSize: 12 }}
            />
           <Tooltip 
              formatter={(value: number, name: EquipmentKey) => [
                `${value} plaquettes`, 
                {
                  streetlights: 'Lampadaires',
                  metters: 'Compteurs',
                  cabinets: 'Armoires',
                  substations: 'Postes'
                }[name]
              ]}
            />
            <Legend 
              formatter={(value: EquipmentKey) => (
                {
                  streetlights: 'Lampadaires',
                  metters: 'Compteurs',
                  cabinets: 'Armoires',
                  substations: 'Postes'
                }[value]
              )}
            />
            <Bar dataKey="streetlights" fill={colors.streetlights} name="streetlights" />
            <Bar dataKey="metters" fill={colors.metters} name="metters" />
            <Bar dataKey="cabinets" fill={colors.cabinets} name="cabinets" />
            <Bar dataKey="substations" fill={colors.substations} name="substations" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistiques totales */}
      <div className="mt-4 text-sm">
        <div className="font-medium">Total plaquettes utilisées:</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 rounded" style={{ backgroundColor: colors.streetlights }}></div>
            Lampadaires: {streetlights.length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 rounded" style={{ backgroundColor: colors.metters }}></div>
            Compteurs: {metters.length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 rounded" style={{ backgroundColor: colors.cabinets }}></div>
            Armoires: {cabinets.length}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 mr-2 rounded" style={{ backgroundColor: colors.substations }}></div>
            Postes: {substations.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickerUsageChart;