// src/components/Dashboard/StickerUsageChart.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartProps, BarChartData } from './types';

const StickerUsageChart: React.FC<ChartProps> = ({ data }) => {
  // Définir un gradient de couleurs pour représenter l'intensité d'utilisation
  const lowColor = '#8dd1e1';    // Bleu clair pour faible utilisation
  const mediumColor = '#82ca9d'; // Vert pour utilisation moyenne
  const highColor = '#a4de6c';   // Vert clair pour utilisation élevée
  const criticalColor = '#d0ed57'; // Jaune-vert pour utilisation très élevée

  // Définir des seuils pour déterminer les couleurs
  const getBarColor = (value: number) => {
    if (value < 40) return lowColor;
    if (value < 60) return mediumColor;
    if (value < 80) return highColor;
    return criticalColor;
  };

  // Calculer la valeur maximum pour l'affichage contextuel
  const maxValue = Math.max(...(data as BarChartData[]).map(item => item.stickers));
  
  // Calculer la valeur moyenne
  const avgValue = ((data as BarChartData[]).reduce((sum, item) => sum + item.stickers, 0) / data.length);

  return (
    <div className="bg-white dark:bg-gray-950 p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Utilisation des stickers par mois</h2>
      
      {/* Légende personnalisée */}
      <div className="flex flex-wrap mb-2 text-xs">
        <div className="flex items-center mr-4 mb-1">
          <div className="w-3 h-3 mr-1 rounded" style={{ backgroundColor: lowColor }}></div>
          <span>Faible (&lt;40)</span>
        </div>
        <div className="flex items-center mr-4 mb-1">
          <div className="w-3 h-3 mr-1 rounded" style={{ backgroundColor: mediumColor }}></div>
          <span>Moyen (40-59)</span>
        </div>
        <div className="flex items-center mr-4 mb-1">
          <div className="w-3 h-3 mr-1 rounded" style={{ backgroundColor: highColor }}></div>
          <span>Élevé (60-79)</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-3 h-3 mr-1 rounded" style={{ backgroundColor: criticalColor }}></div>
          <span>Très élevé (80+)</span>
        </div>
      </div>
      
      {/* Statistiques sommaires */}
      <div className="flex flex-wrap mb-4 text-xs ">
        <div className="mr-4">Maximum: <span className="font-semibold">{maxValue} stickers</span></div>
        <div>Moyenne: <span className="font-semibold">{avgValue.toFixed(1)} stickers</span></div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#666' }} 
              axisLine={{ stroke: '#ccc' }}
            />
            <YAxis 
              tick={{ fill: '#666' }} 
              axisLine={{ stroke: '#ccc' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`${value} stickers`, 'Quantité']}
              labelFormatter={(name: string) => `Mois: ${name}`}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #ddd',
                borderRadius: '4px'
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
      <div className="mt-2 text-xs ">
        <span className="font-medium">Tendance: </span>
        {((data as BarChartData[]).length >= 2 && 
          (data as BarChartData[])[data.length - 1].stickers > (data as BarChartData[])[data.length - 2].stickers) 
          ? <span className="text-green-600">En hausse ↗</span> 
          : <span className="text-red-600">En baisse ↘</span>}
      </div>
    </div>
  );
};

export default StickerUsageChart;