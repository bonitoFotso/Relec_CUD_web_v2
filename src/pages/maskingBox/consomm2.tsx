/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
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

// Définition du type de lampadaire
interface StreetlightType {
  id: number;
  name: string;
  puissanceLumineuse: number; // en lumens
  puissanceConsommee: number; // en Watts
  dureeUtilisation: number; // en heures par nuit
  quantite: number; // nombre de lampadaires de ce type
  couleur: string; // couleur pour les graphiques
}

// Données des types de lampadaires
const streetlightTypes: StreetlightType[] = [
  {
    id: 1,
    name: "LED",
    puissanceLumineuse: 130,
    puissanceConsommee: 45,
    dureeUtilisation: 12,
    quantite: 2,
    couleur: "#10B722",
  },
  {
    id: 2,
    name: "Décharges avec ballast",
    puissanceLumineuse: 120,
    puissanceConsommee: 120,
    dureeUtilisation: 12,
    quantite: 3,
    couleur: "#F59E0B",
  },
  {
    id: 3,
    name: "Décharges sans ballast",
    puissanceLumineuse: 110,
    puissanceConsommee: 150,
    dureeUtilisation: 12,
    quantite: 2,
    couleur: "#EF4444",
  },
];

// Génération de données réalistes en fonction des types de lampadaires
const generateData = (period: string) => {
  // Définir la longueur et les étiquettes de temps en fonction de la période
  let timeLabels: any[] = [];
  let fluctuationFactor = 0.2; // Facteur de fluctuation pour rendre les données plus réalistes

  if (period === "Journaliere") {
    timeLabels = Array.from({ length: 24 }, (_, i) => `${i}h`);
    fluctuationFactor = 0.4; // Plus de variation pour les données horaires
  } else if (period === "Hebdomadaire") {
    timeLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    fluctuationFactor = 0.3;
  } else if (period === "Mensuelle") {
    timeLabels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    fluctuationFactor = 0.25;
  } else if (period === "Annuelle") {
    timeLabels = [
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Août",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ];
    fluctuationFactor = 0.15;
  }

  // Calculer le tarif par kWh
  const tarifKWh = 65.85;

  // Générer les données pour chaque point temporel
  return timeLabels.map((label) => {
    // Créer un objet pour stocker les données de ce point temporel
    const dataPoint: any = { temps: label };

    // Calculer la consommation pour chaque type de lampadaire
    streetlightTypes.forEach((type) => {
      // Calculer la consommation de base en kWh
      let baseConsommation = 0; // Default value to avoid undefined

      if (period === "Journaliere") {
        // Pour les données journalières, on répartit la consommation sur les heures
        // avec plus de consommation la nuit
        const hour = parseInt(label);
        if (hour >= 18 || hour <= 6) {
          baseConsommation = (type.puissanceConsommee * type.quantite) / 1000; // kWh pour une heure
        } else {
          baseConsommation = 0; // Pas de consommation pendant la journée
        }
      } else if (period === "Hebdomadaire") {
        baseConsommation =
          (type.puissanceConsommee *
            type.dureeUtilisation *
            type.quantite *
            1) /
          1000; // kWh pour un jour
      } else if (period === "Mensuelle") {
        baseConsommation =
          (type.puissanceConsommee *
            type.dureeUtilisation *
            type.quantite *
            1) /
          1000; // kWh pour un jour
      } else if (period === "Annuelle") {
        // La consommation varie selon les saisons (plus élevée en hiver)
        const monthIndex = [
          "Jan",
          "Fév",
          "Mar",
          "Avr",
          "Mai",
          "Juin",
          "Juil",
          "Août",
          "Sep",
          "Oct",
          "Nov",
          "Déc",
        ].indexOf(label);
        const seasonalFactor = monthIndex >= 9 || monthIndex <= 2 ? 1.2 : 1.0;
        baseConsommation =
          (type.puissanceConsommee *
            type.dureeUtilisation *
            type.quantite *
            30 *
            seasonalFactor) /
          1000; // kWh pour un mois
      }

      // Ajouter une fluctuation aléatoire pour rendre les données plus réalistes
      const randomFactor = 1 + (Math.random() * 2 - 1) * fluctuationFactor;
      const consommation = Math.round(baseConsommation * randomFactor);

      // Calculer le coût correspondant
      const cout = Math.round(consommation * tarifKWh);

      // Ajouter au point de données
      dataPoint[`consommation${type.name.replace(/\s+/g, "")}`] = consommation;
      dataPoint[`cout${type.name.replace(/\s+/g, "")}`] = cout;
    });

    return dataPoint;
  });
};

export default function Consommations2() {
  const [periode, setPeriode] = useState("Hebdomadaire");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalWidth, setModalWidth] = useState<string>("max-w-4xl");
  const [data, setData] = useState<any[]>([]);

  // Mettre à jour les données lorsque la période change
  useEffect(() => {
    setData(generateData(periode));
  }, [periode]);

  // Calculer les totaux pour chaque type de lampadaire
  const totals = streetlightTypes.reduce((acc, type) => {
    const typeName = type.name.replace(/\s+/g, "");
    acc[`totalConsommation${typeName}`] = data.reduce(
      (sum, item) => sum + (item[`consommation${typeName}`] || 0),
      0
    );
    acc[`totalCout${typeName}`] = data.reduce(
      (sum, item) => sum + (item[`cout${typeName}`] || 0),
      0
    );
    return acc;
  }, {} as Record<string, number>);

  // Formatter les montants en XAF
  const formatXAF = (value: ValueType) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " XAF";
  };

  // Calculer la consommation moyenne par nuit pour chaque type de lampadaire
  const calculerConsommationMoyenne = (type: StreetlightType) => {
    return (type.puissanceConsommee * type.dureeUtilisation) / 1000; // kWh par nuit
  };

  // Calculer le rendement (lumens par watt)
  const calculerRendement = (type: StreetlightType) => {
    return (type.puissanceLumineuse / type.puissanceConsommee).toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {/* Consommation d'énergie */}
      <div>
        <div className="h-full bg-white dark:bg-gray-950 px-3 py-3 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Consommation Énergétique</h2>
            <select
              className="border bg-white dark:bg-gray-900 rounded-lg p-2 text-sm"
              value={periode}
              onChange={(e) => setPeriode(e.target.value)}
            >
              <option>Journaliere</option>
              <option>Hebdomadaire</option>
              <option>Mensuelle</option>
              <option>Annuelle</option>
            </select>
          </div>
          <div className="h-64 dark:bg-gray-900 bg-gray-100 rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="temps" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} unit=" kWh" />
                <Tooltip
                  formatter={(value) => [`${value} kWh`]}
                  labelFormatter={(label) => `Temps: ${label}`}
                />
                <Legend verticalAlign="top" height={36} />
                {streetlightTypes.map((type) => (
                  <Line
                    key={type.id}
                    type="monotone"
                    dataKey={`consommation${type.name.replace(/\s+/g, "")}`}
                    name={type.name}
                    stroke={type.couleur}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5, strokeWidth: 1 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {streetlightTypes.map((type) => (
              <div
                key={type.id}
                className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">
                      Lampadaires {type.name}
                    </p>
                    <p
                      className="font-medium text-lg"
                      style={{ color: type.couleur }}
                    >
                      {totals[
                        `totalConsommation${type.name.replace(/\s+/g, "")}`
                      ] || 0}{" "}
                      kWh
                    </p>
                  </div>
                  <div className="flex justify-center flex-col items-center">
                    <p
                      className="text-2xl font-bold"
                      style={{ color: type.couleur }}
                    >
                      {type.quantite}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-400 mt-1"
                      onClick={() => setModalOpen(true)}
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Coût énergétique */}
      <div className="h-full bg-white dark:bg-gray-950 px-3 py-3 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Estimation Coût Énergétique</h2>
          <div className="border dark:bg-gray-900 rounded-lg p-2 text-sm text-gray-500">
            {periode}
          </div>
        </div>
        <div className="h-64 dark:bg-gray-900 bg-gray-100 rounded-lg">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="temps" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => [`${formatXAF(value)}`]}
                labelFormatter={(label) => `Temps: ${label}`}
              />
              <Legend verticalAlign="top" height={36} />
              {streetlightTypes.map((type) => (
                <Bar
                  key={type.id}
                  dataKey={`cout${type.name.replace(/\s+/g, "")}`}
                  name={`Coût ${type.name}`}
                  fill={type.couleur}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {streetlightTypes.map((type) => (
            <div
              key={type.id}
              className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg"
            >
              <p className="text-xs text-gray-500">
                Coût énergétique lampadaires {type.name}
              </p>
              <p
                className="font-medium text-lg mt-1"
                style={{ color: type.couleur }}
              >
                {formatXAF(
                  totals[`totalCout${type.name.replace(/\s+/g, "")}`] || 0
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog pour les détails de consommation */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className={modalWidth}>
          <DialogHeader>
            <DialogTitle className="text-lg text-gray-900 dark:text-gray-300 flex justify-between items-center">
              <span>Détails des Consommations Énergétiques Moyennes</span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalWidth("max-w-md")}
                  className={
                    modalWidth === "max-w-md" ? "bg-primary text-white" : ""
                  }
                >
                  S
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalWidth("max-w-2xl")}
                  className={
                    modalWidth === "max-w-2xl" ? "bg-primary text-white" : ""
                  }
                >
                  M
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalWidth("max-w-4xl")}
                  className={
                    modalWidth === "max-w-4xl" ? "bg-primary text-white" : ""
                  }
                >
                  L
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="p-2 mt-3 space-y-6">
            <h3 className="mb-3">
              Démonstration des consommations en puissance des Lampadaires
            </h3>

            <Table>
              <TableCaption>
                Données techniques et consommation des différents types de
                lampadaires
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/5">Type de lampadaires</TableHead>
                  <TableHead className="w-1/5">
                    Puissance lumineuse (lumens)
                  </TableHead>
                  <TableHead className="w-1/5">
                    Puissance consommée (W)
                  </TableHead>
                  <TableHead className="w-1/5">Rendement (lm/W)</TableHead>
                  <TableHead className="w-1/5">
                    Consommation par nuit (kWh)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {streetlightTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.puissanceLumineuse}</TableCell>
                    <TableCell>{type.puissanceConsommee}</TableCell>
                    <TableCell>{calculerRendement(type)}</TableCell>
                    <TableCell>
                      {calculerConsommationMoyenne(type).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">
                Analyse comparative
              </h4>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Les lampadaires LED montrent un rendement supérieur aux
                lampadaires à décharge, consommant jusqu'à{" "}
                {Math.round(
                  (streetlightTypes[2].puissanceConsommee /
                    streetlightTypes[0].puissanceConsommee) *
                    100 -
                    100
                )}
                % moins d'énergie pour une luminosité comparable. Cette
                efficacité se traduit par des économies significatives sur les
                coûts énergétiques à long terme.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
