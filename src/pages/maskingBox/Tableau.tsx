/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { PanneauStats } from "./types";
import StatistiquesCard from "./Statistiques";
import Alertes from "./Alertes";
import Recommandations from "./Recommandations";
import DynamicHeader from "@/components/common/DynamicHeader";
import ConsommationsPrimaires from "./Consommation/ConsommationPrimaire";

export default function Tableau() {
  const [lampStatus, setLampStatus] = useState<PanneauStats>({
    total: 0,
    allumés: 0,
    éteints: 0,
    défectueux: 0,
  });

  return (
    <div className=" space-y-8">
      <DynamicHeader>
        <select className="ml-5 border bg-white dark:bg-gray-900 rounded-lg px-3 py-2 text-sm ml:3">
          <option value="">Toutes les communes</option>
          <option value="option1">Douala 1er</option>
          <option value="option2">Douala 2eme</option>
          <option value="option3">Douala 3eme</option>
          <option value="option4">Douala 4eme</option>
          <option value="option5">Douala 5eme</option>
        </select>
      </DynamicHeader>
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold">PANNEAU DE CONTROLE MASSKING BOX</h2>
      </div>
      <StatistiquesCard stats={lampStatus} />
      <ConsommationsPrimaires />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Alertes />
        <Recommandations />
      </div>
    </div>
  );
}
