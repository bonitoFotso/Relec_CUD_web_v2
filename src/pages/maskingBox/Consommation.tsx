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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
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

// Données fictives pour les démonstrations
const generateData = (period: string) => {
  if (period === "Journaliere") {
    return Array.from({ length: 24 }, (_, i) => {
      const consommationLED = Math.round(Math.random() * 15 + 5);
      const consommationDecharges = Math.round(Math.random() * 30 + 10);
      return {
        temps: `${i}h`,
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  } else if (period === "Hebdomadaire") {
    return [
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
      "Dimanche",
    ].map((jour) => {
      const consommationLED = Math.round(Math.random() * 50 + 20);
      const consommationDecharges = Math.round(Math.random() * 100 + 50);
      return {
        temps: jour.substring(0, 3),
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  } else if (period === "Mensuelle") {
    return Array.from({ length: 30 }, (_, i) => {
      const consommationLED = Math.round(Math.random() * 100 + 50);
      const consommationDecharges = Math.round(Math.random() * 200 + 100);
      return {
        temps: `${i + 1}`,
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  } else if (period === "Annuelle") {
    const mois = [
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
    return mois.map((mois) => {
      const consommationLED = Math.round(Math.random() * 800 + 400);
      const consommationDecharges = Math.round(Math.random() * 1500 + 800);
      return {
        temps: mois,
        consommationLED: consommationLED,
        consommationDecharges: consommationDecharges,
        coutLED: Math.round(consommationLED * 65.85),
        coutDecharges: Math.round(consommationDecharges * 65.85),
      };
    });
  }
};
export default function Consommations() {
  const [periode, setPeriode] = useState("Hebdomadaire");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const data = generateData(periode);

  // calcul des totaux
  const totalConsommationLED = (data ?? []).reduce(
    (sum, item) => sum + item.consommationLED,
    0
  );
  const totalConsommationDecharges = (data ?? []).reduce(
    (sum, item) => sum + item.consommationDecharges,
    0
  );

  // calculer le nombre de lampadaires led a avoir consommer
  // const totalLED =

  // combien de lampadaires decharges on consommer

  const totalCoutLED = (data ?? []).reduce(
    (sum, item) => sum + item.coutLED,
    0
  );
  const totalCoutDecharges = (data ?? []).reduce(
    (sum, item) => sum + item.coutDecharges,
    0
  );

  const formatXAF = (value: ValueType) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " XAF";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {/* Consommation d'énergie */}
      <div>
        <div className="h-full bg-white dark:bg-gray-950 px-3 py-3 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Consommationrr Énergétique</h2>
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
                <Line
                  type="monotone"
                  dataKey="consommationLED"
                  name="LED"
                  stroke="#10B722"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="consommationDecharges"
                  name="Décharges"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Lampadaires LED</p>
                  <p className="font-medium text-lg text-green-500 mt-1">
                    {totalConsommationLED} kWh
                  </p>
                </div>
                <div className="flex justify-center flex-col  items-center">
                  <p className="text-2xl font-bold  text-green-500">2</p>
                  <Button
                    variant="outline"
                    size={"sm"}
                    className="text-gray-400 mt-1"
                    onClick={() => setModalOpen(true)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
              <div className="flex  justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Lampadaires décharges</p>
                  <p className="font-medium text-lg text-amber-500 mt-1">
                    {totalConsommationDecharges} kWh
                  </p>
                </div>
                <div className="flex justify-center flex-col  items-center">
                  <p className="text-2xl font-bold  text-amber-500">5</p>
                  <Button
                    variant="outline"
                    size={"sm"}
                    className="text-start text-gray-400 mt-1"
                    onClick={() => setModalOpen(true)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coût énergétique */}
      <div className="h-full bg-white dark:bg-gray-950 px-3 py-3  rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Estimation Coût Énergétique</h2>
          <div className=" border dark:bg-gray-900 rounded-lg p-2  text-sm text-gray-500">
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
              <Bar
                dataKey="coutLED"
                name="Coût LED"
                fill="#10B722"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="coutDecharges"
                name="Coût Décharges"
                fill="#F59E0B"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg">
            <p className="text-xs text-gray-500">
              Coût énergétique lampadaires LED
            </p>

            <p className="font-medium text-lg text-green-500 mt-1">
              {formatXAF(totalCoutLED)}
            </p>
          </div>
          <div
            className="bg-gray-100 dark:bg-gray-900 p-3
           rounded-lg"
          >
            <p className="text-xs text-gray-500">
              Coût énergétique lampadaires décharges
            </p>{" "}
            <p className="font-medium text-lg text-amber-500 mt-1">
              {formatXAF(totalCoutDecharges)}
            </p>
          </div>
        </div>
      </div>

      {/* dialog content for the table list showing the details of energetic consumptions of all types of streelights
      showing their type and power consumption rate */}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg text-gray-900 dark:text-gray-300">
              Details des Consommation Énergétique Moyenne
            </DialogTitle>
          </DialogHeader>

          <div className="p-2 mt-3 space-y-6">
            <h3 className="mb-3">
              Demonstration des consommations en puissance des Lampadaires
            </h3>

            {/* {table} */}
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type de lampadaires</TableHead>
                  <TableHead>Puissance lumineuse</TableHead>
                  <TableHead>Puissance consomme</TableHead>
                  <TableHead>Rendement</TableHead>
                  <TableHead>Consommation par nuit (moyen)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableHead>LED</TableHead>
                  <TableHead>130 lumens</TableHead>
                  <TableHead>258 Kwh</TableHead>
                  <TableHead>
                    {/* rapport entre les puissances lumineuse et consommes exple: ce lampadaire a 40lumens consomme 230kwh */}
                  </TableHead>
                  <TableHead>120kwh</TableHead>
                </TableRow>

                <TableRow>
                  <TableHead>Decharges avec ballaste</TableHead>
                  <TableHead>130 lumens</TableHead>
                  <TableHead>258 Kwh</TableHead>
                  <TableHead>
                    {/* rapport entre les puissances lumineuse et consommes exple: ce lampadaire a 40lumens consomme 230kwh */}
                  </TableHead>
                  <TableHead>120kwh</TableHead>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
