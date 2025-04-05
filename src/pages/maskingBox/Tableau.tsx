/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { PanneauStats } from "./types";
import StatistiquesCard from "./Statistiques";
import ConsommationEnergie from "./ConsommationEnergie";
import Alertes from "./Alertes";
import Optimisation from "./Optimisation";

export default function Tableau() {
  const [lampStatus, setLampStatus] = useState<PanneauStats>({
    total: 0,
    on: 0,
    off: 0,
    malfunctioning: 0,
  });

  return (
    <div className=" space-y-8">
      {/* En tete */}
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold">
            PANNEAU DE CONTROLE MASKING BOX
          </h2>
        </div>
      </div>
      {/* Cartes stastitiques */}
      <StatistiquesCard stats={lampStatus} />
      <Optimisation />
      {/* consommation energetiques  */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-1">
          <ConsommationEnergie />
        </div>
        <div>
          <Alertes />{" "}
        </div>
      </div>
      <div>
        {/*  Graphique d'inventaire des lampadaires */}
        <div className="h-[100%] bg-white dark:bg-gray-950 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Inventaires</h2>

          <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
            {/* Graphique d'évolution  */}
            <p className="text-gray-500 ml-2">Graphique d'inventaire</p>
          </div>
        </div>
      </div>
    </div>
  );
}
