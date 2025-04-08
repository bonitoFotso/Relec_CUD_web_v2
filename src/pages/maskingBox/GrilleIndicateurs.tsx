import { PieChart, Battery } from "lucide-react";
import { ReactNode } from "react";
import {
  ResponsiveContainer,
  Pie,
  Cell,
  Tooltip,
  RadialBarChart,
  RadialBar,
} from "recharts";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function GrilleIndicateurs({
  indicateursFiltres,
  donnees,
  COLORS,
  loading,
  couleurToClass,
}: {
  indicateursFiltres: any[];
  COLORS: string[];
  donnees: any;
  couleurToClass: (couleur: string, type?: string) => string;
  loading: boolean;
}) {
  const donneesLampadaires = !loading
    ? [
        { name: "LED", value: donnees.lampadairesLED },
        { name: "Traditionnel", value: 100 - donnees.lampadairesLED },
      ]
    : [];
  const donneesPuissance = !loading
    ? [
        {
          name: "Facteur",
          value: donnees.facteurPuissance * 100,
          fill:
            donnees.facteurPuissance >= 0.9
              ? "#10b981"
              : donnees.facteurPuissance >= 0.8
              ? "#eab308"
              : "#ef4444",
        },
      ]
    : [];
  return (
    <>
      {/* Grille d'indicateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {indicateursFiltres.map(
          (indicateur: {
            nom: ReactNode;
            valeur: ReactNode;
            unite: ReactNode;
            id: React.Key | null | undefined;
            couleur: any;
            render: string;
            icone: string | ReactNode;
          }) => (
            <div
              key={indicateur.id}
              className={`${couleurToClass(
                indicateur.couleur
              )} p-4 rounded-lg shadow`}
            >
              {indicateur.render === "valeur" ? (
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-2">
                    <div
                      className={`${couleurToClass(
                        indicateur.couleur,
                        "text"
                      )} mr-2`}
                    >
                      {indicateur.icone}
                    </div>
                    <h3 className="font-semibold">{indicateur.nom}</h3>
                  </div>
                  <p className="text-3xl font-bold mt-auto">
                    {indicateur.valeur}
                    {indicateur.unite}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {indicateur.id === "dureeEclairage" &&
                      "Moyenne quotidienne"}
                    {indicateur.id === "efficaciteEnergetique" &&
                      "vs éclairage traditionnel"}
                    {indicateur.id === "intensiteLumineuse" && "Lumens moyens"}
                    {indicateur.id === "reductionCarbone" && "Économie CO₂"}
                  </p>
                </div>
              ) : indicateur.render === "jauge" ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div
                    className={`${couleurToClass(
                      indicateur.couleur,
                      "text"
                    )} mb-2`}
                  >
                    {indicateur.icone}
                  </div>
                  <h3 className="font-semibold text-center">
                    {indicateur.nom}
                  </h3>
                  <p className="text-3xl font-bold mt-2">
                    {indicateur.valeur}
                    {indicateur.unite}
                  </p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                    <div
                      className={`${couleurToClass(indicateur.couleur, "bg")
                        .replace("50", "500")
                        .replace("900", "600")} h-2 rounded-full`}
                      style={{
                        width: `${
                          indicateur.id === "pollutionLumineuse"
                            ? 100 - indicateur.valeur
                            : indicateur.valeur
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : indicateur.render === "pie" ? (
                <div className="flex flex-col h-full">
                  <h3 className="font-semibold mb-2 text-center">
                    {indicateur.nom}
                  </h3>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={donneesLampadaires}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {donneesLampadaires.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-center font-semibold mt-2">
                    {indicateur.valeur}% convertis
                  </p>
                </div>
              ) : indicateur.render === "radial" ? (
                <div className="flex flex-col h-full">
                  <h3 className="font-semibold mb-2 text-center">
                    {indicateur.nom}
                  </h3>
                  <div className="h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="100%"
                        barSize={10}
                        data={donneesPuissance}
                        startAngle={180}
                        endAngle={0}
                      >
                        <RadialBar
                          background
                          clockWise
                          dataKey="value"
                          cornerRadius={30}
                          fill="#82ca9d"
                        />
                        <Tooltip
                          formatter={(value) => [
                            (value / 100).toFixed(2),
                            "Facteur de puissance",
                          ]}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex items-center justify-center">
                    <Battery
                      className={`${couleurToClass(
                        indicateur.couleur,
                        "text"
                      )} mr-2`}
                      size={20}
                    />
                    <p className="font-semibold">
                      {indicateur.valeur.toFixed(2)}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )
        )}
      </div>
    </>
  );
}
