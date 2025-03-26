// src/components/Dashboard/MissionTypeChart.tsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartData, ChartProps } from './types';

// Palette de couleurs plus harmonieuse et contrastée
const COLORS = [
  '#4264D0', // Bleu royal
  '#48A9A6', // Turquoise
  '#E4B363', // Or/ocre
  '#D56062', // Corail
  '#8B5FBF', // Violet
  '#567568', // Vert forêt
  '#D58936', // Orange rouille
  '#2E86AB'  // Bleu marine
];
// Fonction de rendu personnalisé pour les labels
const renderCustomizedLabel = (props: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const {
    cx, cy, midAngle, innerRadius, outerRadius, percent
  } = props;

  // Ne pas afficher les labels pour les petites portions
  if (percent < 0.08) return null;

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  
  // Calculer position x,y
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#fff" 
      fontWeight="bold"
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


// Rendu du composant CustomLegend
const CustomLegend: React.FC<{ data: PieChartData[] }> = ({ data }) => {
  // Calculer le total pour les pourcentages
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  
  return (
    <div className="flex flex-wrap justify-center mt-4 gap-2">
      {data.map((entry, index) => (
        <div 
          key={`legend-${index}`} 
          className="flex items-center px-2 py-1 rounded-md bg-gray-50 border border-gray-100"
        >
          <div 
            className="w-3 h-3 rounded-sm mr-2" 
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          ></div>
          <span className="text-xs font-medium">
            {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
};

// Composant principal
const MissionTypeChart: React.FC<ChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [totalMissions, setTotalMissions] = useState<number>(0);

  // Calculer le total des missions lors du chargement ou de la mise à jour des données
  useEffect(() => {
    if (data && data.length > 0) {
      const total = data.reduce((sum, entry) => {
        if ('value' in entry) {
          return sum + entry.value;
        }
        return sum;
      }, 0);
      setTotalMissions(total);
    }
  }, [data]);

  // S'assurer que data est toujours défini avant le rendu
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return [{
        name: 'Aucune donnée',
        value: 1
      }];
    }
    return data;
  }, [data]);

    // Gestionnaires d'événements
    const onPieEnter = (_: MouseEvent, index: number) => {
        setActiveIndex(index);
      };
  
  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  return (
    <div className=" p-4 rounded-lg bg-white dark:bg-gray-950">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold ">Répartition des missions par type</h2>
        <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
          Total: {totalMissions} missions
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              innerRadius={30}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              paddingAngle={2}
              animationBegin={200}
              animationDuration={1000}
            >
              {chartData.map((_entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#fff"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value} missions`, 'Quantité']}
              labelFormatter={(name: string) => `Type: ${name}`}
              contentStyle={{
                borderRadius: '4px',
                borderColor: '#ddd',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {chartData.length > 1 && <CustomLegend data={chartData as PieChartData[]} />}
      
      <div className="mt-2 text-xs text-center">
        {chartData.length > 1 
          ? "Passez sur un segment pour voir plus de détails" 
          : "Aucune donnée disponible pour le moment"}
      </div>
    </div>
  );
};

export default MissionTypeChart;