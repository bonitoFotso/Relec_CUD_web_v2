import React, { useState } from "react";
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
import { Clock, Zap, Sun, Leaf } from "lucide-react";

export default function IndicateurPerformance() {
  // Données d'exemple pour la démonstration
  const [donnees, setDonnees] = useState({
    dureeEclairage: 8.5, // heures
    efficaciteEnergetique: 75, // pourcentage
    intensiteLumineuse: 1200, // lumens
    reductionCarbone: 35, // pourcentage
  });

  // Fonction pour simuler un changement de données
  const actualiserDonnees = () => {
    setDonnees({
      dureeEclairage: Math.round((7 + Math.random() * 4) * 10) / 10,
      efficaciteEnergetique: Math.round(65 + Math.random() * 25),
      intensiteLumineuse: Math.round(1000 + Math.random() * 600),
      reductionCarbone: Math.round(25 + Math.random() * 30),
    });
  };

  // Données pour le graphique comparatif LED vs traditionnel
  const donneesComparaison = [
    { name: "Consommation (W)", LED: 12, Traditionnel: 60 },
    { name: "Durée de vie (h×1000)", LED: 25, Traditionnel: 2 },
    { name: "Coût annuel (€)", LED: 15, Traditionnel: 40 },
  ];

  return (
    <div className="h-full bg-white dark:bg-gray-950 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Indicateurs de Performance</h2>
        <button
          onClick={actualiserDonnees}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Actualiser les données
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Carte 1: Durée moyenne d'éclairage */}
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Clock
              className="text-blue-600 dark:text-blue-300 mr-2"
              size={24}
            />
            <h3 className="font-semibold">Durée d'éclairage</h3>
          </div>
          <p className="text-3xl font-bold">{donnees.dureeEclairage} h</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Moyenne quotidienne
          </p>
        </div>

        {/* Carte 2: Taux d'efficacité énergétique */}
        <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Zap
              className="text-green-600 dark:text-green-300 mr-2"
              size={24}
            />
            <h3 className="font-semibold">Efficacité énergétique</h3>
          </div>
          <p className="text-3xl font-bold">{donnees.efficaciteEnergetique}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            vs éclairage traditionnel
          </p>
        </div>

        {/* Carte 3: Intensité lumineuse */}
        <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Sun
              className="text-yellow-600 dark:text-yellow-300 mr-2"
              size={24}
            />
            <h3 className="font-semibold">Intensité lumineuse</h3>
          </div>
          <p className="text-3xl font-bold">{donnees.intensiteLumineuse}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Lumens moyens
          </p>
        </div>

        {/* Carte 4: Réduction d'empreinte carbone */}
        <div className="bg-emerald-50 dark:bg-emerald-900 p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Leaf
              className="text-emerald-600 dark:text-emerald-300 mr-2"
              size={24}
            />
            <h3 className="font-semibold">Réduction carbone</h3>
          </div>
          <p className="text-3xl font-bold">{donnees.reductionCarbone}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Économie CO₂
          </p>
        </div>
      </div>

      {/* Graphique comparatif */}
      <div className="mt-6 h-64">
        <h3 className="text-lg font-semibold mb-2">
          Comparaison LED vs Éclairage Traditionnel
        </h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={donneesComparaison}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="LED" fill="#4ade80" />
            <Bar dataKey="Traditionnel" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Dernière mise à jour: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
