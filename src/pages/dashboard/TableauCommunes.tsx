/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from "react";
import {
  computeStatsByMunicipality,
  LampCountByNetworkTable,
  LampStatsTableByMunicipality,
} from "../maps/functions";
import { useEquipements } from "@/contexts/EquipementContext";
import { EquipementStreetlights } from "@/services/EquipementService";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TableauCommunes() {
  const { streetlights, cabinets } = useEquipements();
  const municipalities = [
    "DOUALA 1",
    "DOUALA 2",
    "DOUALA 3",
    "DOUALA 4",
    "DOUALA 5",
  ];
  const types = ["1 Bras", "2 Bras", "3 Bras", "Mât d'éclairage"];
  const groupedByMunicipality = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};

    // Initialiser chaque commune avec tous les types à 0
    municipalities.forEach((commune) => {
      result[commune] = {};
      types.forEach((type) => {
        result[commune][type] = 0;
      });
    });

    streetlights.forEach((lamp) => {
      const municipality = lamp.municipality;
      const type = lamp.streetlight_type;

      if (!result[municipality]) {
        result[municipality] = {};
        types.forEach((t) => (result[municipality][t] = 0));
      }

      if (result[municipality][type] !== undefined) {
        result[municipality][type]++;
      } else {
        result[municipality][type] = 1;
      }
    });

    return result;
  }, [streetlights]);

  const totalByType = useMemo(() => {
    const result: Record<string, number> = {};
    types.forEach((type) => {
      result[type] = 0;
    });

    municipalities.forEach((commune) => {
      types.forEach((type) => {
        result[type] += groupedByMunicipality[commune][type];
      });
    });

    return result;
  }, [groupedByMunicipality]);

  const groupedByCabinet = streetlights.reduce((acc, streetlight) => {
    if (!streetlight.cabinet_id) return acc;

    if (!acc[streetlight.cabinet_id]) {
      acc[streetlight.cabinet_id] = [];
    }

    acc[streetlight.cabinet_id].push(streetlight);
    return acc;
  }, {} as Record<number, EquipementStreetlights[]>);

  const { perMunicipality, total } = computeStatsByMunicipality(
    groupedByCabinet,
    cabinets,
    streetlights
    //municipalities
  );

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-950 p-4 rounded-xl">
          <h4 className="font-bold text-lg mb-2">
            Nombre de lampe par commune et par type
          </h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-4 py-2 text-left">Commune</TableHead>
                {types.map((type) => (
                  <TableHead key={type} className="px-4 py-2 text-left">
                    {type}
                  </TableHead>
                ))}
                <TableHead className="px-4 py-2 text-left">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {municipalities.map((municipality) => {
                const counts = groupedByMunicipality[municipality];
                const total = Object.values(counts).reduce(
                  (sum, val) => sum + val,
                  0
                );
                return (
                  <TableRow key={municipality} className="border-t">
                    <TableCell className="px-4 py-2">{municipality}</TableCell>
                    {types.map((type) => (
                      <TableCell key={type} className="px-4 py-2">
                        {counts[type]}
                      </TableCell>
                    ))}
                    <TableCell className="px-4 py-2 font-bold">
                      {total}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow className="border-t">
                <TableCell className="px-4 py-2">Total</TableCell>
                {types.map((type) => (
                  <TableCell key={type} className="px-4 py-2">
                    {totalByType[type]}
                  </TableCell>
                ))}
                <TableCell className="px-4 py-2">
                  {Object.values(totalByType).reduce(
                    (sum, val) => sum + val,
                    0
                  )}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <div className=" bg-white dark:bg-gray-950 p-4 rounded-xl">
          <h4 className="font-bold text-lg mb-2">
            Nombre de lampadaires par réseau
          </h4>
          <LampCountByNetworkTable groupedByCabinet={groupedByCabinet} />
        </div>
      </div>

      <div className="my-4 bg-white dark:bg-gray-950 p-4 rounded-xl">
        <LampStatsTableByMunicipality
          perMunicipality={perMunicipality}
          total={total}
          municipalities={municipalities}
        />
      </div>
    </div>
  );
}
