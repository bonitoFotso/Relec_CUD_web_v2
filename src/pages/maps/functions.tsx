/* eslint-disable react-refresh/only-export-components */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Correction du problème d'icônes dans React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const parseLocation = (location: string) => {
  const [lat, lng] = location.split(",").map(Number.parseFloat);
  return { lat, lng };
};

// Définir les icônes par défaut
export const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Définir les icônes spécifiques
export const equipmentIcons: Record<string, L.Icon> = {
  Lampadaires: L.icon({
    iconUrl: "/enorme-point-vert-fond-blanc-vecteur-point-vert_302321-1287-removebg-preview.png",
    iconSize: [20, 20],
  }),
  Compteurs: L.icon({
    iconUrl: "/compteur-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Amoires: L.icon({
    iconUrl: "/istockphoto-1708045772-612x612-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Substations: L.icon({
    iconUrl: "/8012518-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
};

// Fonction pour calculer la distance
export function calculateTotalDistance(positions: [number, number][]): number {
  let total = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    const [lat1, lon1] = positions[i];
    const [lat2, lon2] = positions[i + 1];
    const R = 6371; // rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return parseFloat(total.toFixed(4)); // arrondi à 4 décimales
}

type Lampadaire = {
  id: number;
  location: string;
  meter_id?: number | null;
  municipality: string;
};

type Cabinet = {
  id: number;
  location: string;
  meter_id?: number | null;
  municipality: {
    name: string;
  };
};

type StatDetail = {
  count: number;
  distance: number;
};

type Stats = {
  connectedToCabinetAndMeter: StatDetail;
  connectedToCabinetOnly: StatDetail;
  connectedToMeterOnly: StatDetail;
  notConnected: StatDetail;
};

type PerMunicipalityStats = Record<string, Stats>;

export function computeStatsByMunicipality(
  groupedByCabinet: Record<string, Lampadaire[]>,
  cabinets: Cabinet[],
  allLamps: Lampadaire[]
): { perMunicipality: PerMunicipalityStats; total: Stats } {
  const initialStats = (): Stats => ({
    connectedToCabinetAndMeter: { count: 0, distance: 0 },
    connectedToCabinetOnly: { count: 0, distance: 0 },
    connectedToMeterOnly: { count: 0, distance: 0 },
    notConnected: { count: 0, distance: 0 },
  });

  const result: PerMunicipalityStats = {};
  const total: Stats = initialStats();

  const cabinetMap = new Map<number, Cabinet>();
  cabinets.forEach((cab) => cabinetMap.set(cab.id, cab));

  const lampIdsInGroup = new Set<number>();

  const addStats = (target: Stats, key: keyof Stats, distance: number) => {
    target[key].count += 1;
    target[key].distance += distance;
  };

  // Réseaux avec armoires
  Object.entries(groupedByCabinet).forEach(([cabinetId, lamps]) => {
    const cabinet = cabinetMap.get(Number(cabinetId));
    const municipality = cabinet?.municipality?.name ?? "AUTRE";

    if (!result[municipality]) {
      result[municipality] = initialStats();
    }

    lamps.forEach((lamp) => lampIdsInGroup.add(lamp.id));
    const distance = calculateTotalDistance(
      lamps.map((lamp) => {
        const [lat, lng] = lamp.location.split(",").map(Number);
        return [lat, lng] as [number, number];
      })
    );

    if (cabinet?.meter_id) {
      addStats(result[municipality], "connectedToCabinetAndMeter", distance);
      addStats(total, "connectedToCabinetAndMeter", distance);
    } else {
      addStats(result[municipality], "connectedToCabinetOnly", distance);
      addStats(total, "connectedToCabinetOnly", distance);
    }
  });

  // Lampadaires isolés (pas liés à une armoire)
  const unlinkedLamps = allLamps.filter((lamp) => !lampIdsInGroup.has(lamp.id));
  unlinkedLamps.forEach((lamp) => {
    const municipality = lamp.municipality ?? "AUTRE";
    if (!result[municipality]) {
      result[municipality] = initialStats();
    }

    const distance = 0; // Pas de réseau => distance nulle

    if (lamp.meter_id) {
      addStats(result[municipality], "connectedToMeterOnly", distance);
      addStats(total, "connectedToMeterOnly", distance);
    } else {
      addStats(result[municipality], "notConnected", distance);
      addStats(total, "notConnected", distance);
    }
  });

  return { perMunicipality: result, total };
}
export const LampStatsTableByMunicipality = ({
  perMunicipality,
  total,
  municipalities,
}: {
  perMunicipality: Record<string, Stats>;
  total: Stats;
  municipalities: string[];
}) => {
  const categories = [
    {
      key: "connectedToCabinetAndMeter",
      label: "Avec Armoire et Compteur",
    },
    {
      key: "connectedToCabinetOnly",
      label: "Avec Armoire sans Compteur",
    },
    {
      key: "connectedToMeterOnly",
      label: "Sans Armoire avec Compteur",
    },
    {
      key: "notConnected",
      label: "Sans Armoire ni Compteur",
    },
  ] as const;

  return (
    <Table>
      <TableCaption>
        Tableau recapitulatif du lineaire de chaque type de reseau par commune
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableCell className=" px-4 py-2">Commune</TableCell>
          {categories.map((cat) => (
            <TableCell key={cat.key} className=" px-4 py-2">
              {cat.label}
              <br />
              <span className="text-xs font-normal text-gray-500">
                [Nbr - Dist km]
              </span>
            </TableCell>
          ))}
          <TableCell className="px-4 py-2 font-bold">Total</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {municipalities.map((mun) => {
          const stats = perMunicipality[mun] ?? {
            connectedToCabinetAndMeter: { count: 0, distance: 0 },
            connectedToCabinetOnly: { count: 0, distance: 0 },
            connectedToMeterOnly: { count: 0, distance: 0 },
            notConnected: { count: 0, distance: 0 },
          };

          const totalCount = Object.values(stats).reduce(
            (sum, s) => sum + s.count,
            0
          );
          const totalDist = Object.values(stats).reduce(
            (sum, s) => sum + s.distance,
            0
          );

          return (
            <TableRow key={mun}>
              <TableCell className="px-4 py-2 font-semibold">
                {mun}
              </TableCell>
              {categories.map((cat) => (
                <TableCell key={cat.key} className="px-4 py-2">
                  {stats[cat.key].count} - {stats[cat.key].distance.toFixed(2)}{" "}
                  km
                </TableCell>
              ))}
              <TableCell className="px-4 py-2 font-bold">
                {totalCount} - {totalDist.toFixed(2)} km
              </TableCell>
            </TableRow>
          );
        })}
        {/* Ligne Total */}
        <TableRow className="border-t font-bold">
          <TableCell className=" px-4 py-2">Total</TableCell>
          {categories.map((cat) => (
            <TableCell key={cat.key} className=" px-4 py-2">
              {total[cat.key].count} - {total[cat.key].distance.toFixed(2)} km
            </TableCell>
          ))}
          <TableCell className=" px-4 py-2">
            {Object.values(total).reduce((s, v) => s + v.count, 0)} -{" "}
            {Object.values(total)
              .reduce((s, v) => s + v.distance, 0)
              .toFixed(2)}{" "}
            km
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

type LampNetwork = {
  networkId: string; // identifiant ou nom du réseau
  distance: number;//distance du réseau en kilomètre
  lampCount: number; // nombre de lampadaires dans ce réseau
  networkMunicipalitie: string;//communes
};

export const LampCountByNetworkTable = ({
  groupedByCabinet,
}: {
  groupedByCabinet: Record<string, Lampadaire[]>; // <- On passe directement groupedByCabinet
}) => {
  // On transforme groupedByCabinet en un tableau de LampNetwork
  const networks: LampNetwork[] = Object.entries(groupedByCabinet).map(
    ([cabinetId, lampGroup]) => {
      // 1. Récupère les positions numériques [lat, lng]
      const positions: [number, number][] = lampGroup
        .map((l) => {
          const parts = l.location.split(",").map(Number);
          return parts.length === 2 ? ([parts[0], parts[1]] as [number, number]) : null;
        })
        .filter((p): p is [number, number] => p !== null);

      // 2. Calcule la distance totale du réseau (en km)
      const distance = calculateTotalDistance(positions);

      // 3. Construit l’objet LampNetwork
      return {
        networkId: `Réseau ${cabinetId}`,
        distance: distance,
        lampCount: lampGroup.length,
        networkMunicipalitie: Array.from(
          new Set(lampGroup.map((lamp) => lamp.municipality))
        ).join(", "),
      };
    }
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell className="px-4 py-2 font-semibold">Réseau</TableCell>
          <TableCell className="px-4 py-2 font-semibold">Distance</TableCell>
          <TableCell className="px-4 py-2 font-semibold">Commune(s)</TableCell>
          <TableCell className="px-4 py-2 font-semibold">Nombre de Lampadaires</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {networks.map((network) => (
          <TableRow key={network.networkId}>
            <TableCell className="px-4 py-2">{network.networkId}</TableCell>
            <TableCell className="px-4 py-2">{network.distance} km</TableCell>
            <TableCell className="px-4 py-2">{network.networkMunicipalitie}</TableCell>
            <TableCell className="px-4 py-2">{network.lampCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};


export function customLabelIcon(label: string) {
  return L.divIcon({
    className: "lamp-label text-white",
    html: `<div style="background: black; border-radius: 4px; border: 1px solid gray; font-size: 12px;">${label}</div>`,
    iconSize: [30, 15],
    iconAnchor: [25, 30],
  });
}
