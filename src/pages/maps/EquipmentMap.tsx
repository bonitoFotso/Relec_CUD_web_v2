import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Composants UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Contexte des équipements
import { useEquipements } from "@/contexts/EquipementContext";

// Correction du problème d'icônes dans React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { RefreshCw } from "lucide-react";
import { SkeletonCardUser } from "@/components/card/SkeletonCardUser";
import { SkeletonCard } from "@/components/card/SkeletonCard";

// Définir les icônes par défaut
const DefaultIcon = L.icon({
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
const equipmentIcons: Record<string, L.Icon> = {
  Lampadaires: L.icon({
    iconUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Compteurs: L.icon({
    iconUrl: "/téléchargement.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Amoires: L.icon({
    iconUrl: "/images1.png",
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Posts: L.icon({
    iconUrl: "/kkk.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
};

const EquipmentMap: React.FC = () => {
  const { streetlights, metters, cabinets, substations, loading, error } =
    useEquipements();
  const [filter, setFilter] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [resetMap, setResetMap] = useState(false);

  // Déclaration unique de la position utilisateur
  const [userPosition, setUserPosition] = useState<[number, number]>([
    4.0429389, 9.7062018,
  ]);

  const initialPosition: [number, number] = userPosition;

  const parseLocation = (location: string) => {
    const [lat, lng] = location.split(",").map(parseFloat);
    return { lat, lng };
  };

  const MapUpdater = () => {
    const map = useMap();
    if (resetMap) {
      map.setView(initialPosition, 80);
      setResetMap(false);
    } else if (selectedPosition) {
      map.setView(selectedPosition, 80);
    }
    return null;
  };

  const resetMapView = () => {
    // setSelectedPosition(null);
    // setResetMap(true);
    setUserPosition([4.0429389, 9.7062018]);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(position.coords);
          setUserPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Erreur géolocalisation : ", err);
        }
      );
    } else {
      console.warn("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto flex flex-col space-y-4 mt-5">
        <SkeletonCardUser />
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 gap-4 mx-auto">
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] sm:w-[280px] rounded-xl" />
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] sm:w-[280px] rounded-xl" />
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] sm:w-[280px] rounded-xl" />
          <Skeleton className="h-[125px] lg:w-[200px] md:w-[200px] sm:w-[280px] rounded-xl" />
        </div>
        <div className="grid grid-cols-1 p-2 md:p-4">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const filteredEquipments = {
    Lampadaires:
      filter === "all" || filter === "streetlights" ? streetlights : [],
    Compteurs: filter === "all" || filter === "metters" ? metters : [],
    Amoires: filter === "all" || filter === "cabinets" ? cabinets : [],
    Posts: filter === "all" || filter === "substations" ? substations : [],
  };

  const renderTable = (category: string, data: any[]) => {
    switch (category) {
      case "Lampadaires":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commune</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Orientation</TableHead>
                <TableHead>Etat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((eq) => (
                <TableRow
                  key={eq.id}
                  onClick={() => {
                    const { lat, lng } = parseLocation(eq.location);
                    setSelectedPosition([lat, lng]);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <TableCell>{eq.municipality}</TableCell>
                  <TableCell>{eq.location}</TableCell>
                  <TableCell>{eq.lamp_type}</TableCell>
                  <TableCell>{eq.orientation}</TableCell>
                  <TableCell>{eq.support_condition}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "Compteurs":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commune</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Modèle</TableHead>
                <TableHead>Marque</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((eq) => (
                <TableRow
                  key={eq.id}
                  onClick={() => {
                    const { lat, lng } = parseLocation(eq.location);
                    setSelectedPosition([lat, lng]);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <TableCell>{eq.municipality.name}</TableCell>
                  <TableCell>{eq.location}</TableCell>
                  <TableCell>{eq.meter_type.name}</TableCell>
                  <TableCell>{eq.model}</TableCell>
                  <TableCell>{eq.brand}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "Amoires":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commune</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Est Fonctionnel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((eq) => (
                <TableRow
                  key={eq.id}
                  onClick={() => {
                    const { lat, lng } = parseLocation(eq.location);
                    setSelectedPosition([lat, lng]);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <TableCell>{eq.municipality.name}</TableCell>
                  <TableCell>{eq.location}</TableCell>
                  <TableCell>{eq.is_functional ? "Oui" : "Non"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      case "Posts":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commune</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Point de repère</TableHead>
                <TableHead>Block_route_number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((eq) => (
                <TableRow
                  key={eq.id}
                  onClick={() => {
                    const { lat, lng } = parseLocation(eq.location);
                    setSelectedPosition([lat, lng]);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                >
                  <TableCell>{eq.municipality.name}</TableCell>
                  <TableCell>{eq.location}</TableCell>
                  <TableCell>{eq.name}</TableCell>
                  <TableCell>{eq.popular_landmark}</TableCell>
                  <TableCell>{eq.block_route_number}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      default:
        return null;
    }
  };
  const renderPopup = (category: string, eq: any) => {
    switch (category) {
      case "Lampadaires":
        return (
          <div className="z-50">
            <p>
              <strong>Presence de le lampe : </strong>
              {eq.has_lamp === 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Puissance : </strong>
              {eq.power} W
            </p>
            <p>
              <strong>Type de commande : </strong>
              {eq.command_type}
            </p>
            <p>
              <strong>Type de lampe : </strong>
              {eq.lamp_type}
            </p>
            <p>
              <strong>Allumer jour : </strong>
              {eq.is_on_day == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Allumer nuit : </strong>
              {eq.is_on_night == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Support : </strong>
              {eq.support_type}
            </p>
            <p>
              <strong>Etat du support : </strong>
              {eq.support_condition}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
            </p>
            <p>
              <strong>Reseau :</strong> {eq.network}
            </p>
            <p>
              <strong>Localisation :</strong> {eq.location}
            </p>
          </div>
        );
      case "Lampadaires":
        return (
          <div className="z-50">
            <p>
              <strong>Presence de le lampe : </strong>
              {eq.has_lamp === 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Puissance : </strong>
              {eq.power} W
            </p>
            <p>
              <strong>Type de commande : </strong>
              {eq.command_type}
            </p>
            <p>
              <strong>Type de lampe : </strong>
              {eq.lamp_type}
            </p>
            <p>
              <strong>Allumer jour : </strong>
              {eq.is_on_day == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Allumer nuit : </strong>
              {eq.is_on_night == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Support : </strong>
              {eq.support_type}
            </p>
            <p>
              <strong>Etat du support : </strong>
              {eq.support_condition}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
            </p>
            <p>
              <strong>Reseau :</strong> {eq.network}
            </p>
            <p>
              <strong>Localisation :</strong> {eq.location}
            </p>
          </div>
        );
      case "Lampadaires":
        return (
          <div className="z-50">
            <p>
              <strong>Presence de le lampe : </strong>
              {eq.has_lamp === 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Puissance : </strong>
              {eq.power} W
            </p>
            <p>
              <strong>Type de commande : </strong>
              {eq.command_type}
            </p>
            <p>
              <strong>Type de lampe : </strong>
              {eq.lamp_type}
            </p>
            <p>
              <strong>Allumer jour : </strong>
              {eq.is_on_day == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Allumer nuit : </strong>
              {eq.is_on_night == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Support : </strong>
              {eq.support_type}
            </p>
            <p>
              <strong>Etat du support : </strong>
              {eq.support_condition}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
            </p>
            <p>
              <strong>Reseau :</strong> {eq.network}
            </p>
            <p>
              <strong>Localisation :</strong> {eq.location}
            </p>
          </div>
        );
      case "Lampadaires":
        return (
          <div className="z-50">
            <p>
              <strong>Presence de le lampe : </strong>
              {eq.has_lamp === 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Puissance : </strong>
              {eq.power} W
            </p>
            <p>
              <strong>Type de commande : </strong>
              {eq.command_type}
            </p>
            <p>
              <strong>Type de lampe : </strong>
              {eq.lamp_type}
            </p>
            <p>
              <strong>Allumer jour : </strong>
              {eq.is_on_day == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Allumer nuit : </strong>
              {eq.is_on_night == 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Support : </strong>
              {eq.support_type}
            </p>
            <p>
              <strong>Etat du support : </strong>
              {eq.support_condition}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
            </p>
            <p>
              <strong>Reseau :</strong> {eq.network}
            </p>
            <p>
              <strong>Localisation :</strong> {eq.location}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <h1 className="text-3xl font-bold">Carte des équipements</h1>
        <div
          onClick={resetMapView}
          className="transition-all duration-200 hover:px-3 cursor-pointer bg-blue-500 text-white p-2 rounded-md flex items-center gap-2"
        >
          <p>Actualiser la carte</p>
          <RefreshCw />
        </div>
      </div>

      {/* Filtrage des équipements */}
      <div className="flex flex-row gap-4 items-center">
        <p className="font-semibold">Filtrer</p>
        <div className="bg-white dark:bg-gray-950">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="streetlights">Lampadaires</SelectItem>
              <SelectItem value="metters">Compteurs</SelectItem>
              <SelectItem value="cabinets">Armoires</SelectItem>
              <SelectItem value="substations">Postes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Carte des équipements */}
      <div className="p-8 bg-white dark:bg-gray-950 rounded-md">
        <div className="h-[600px] w-full overflow-hidden rounded-lg relative z-10">
          <MapContainer
            //center={userPosition}
            center={[4.0911652, 9.7358404]}
            zoom={80}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater />
            {Object.entries(filteredEquipments).map(([category, equipments]) =>
              equipments.map((eq) => {
                const { lat, lng } = parseLocation(eq.location);
                return (
                  <Marker
                    key={`${category}-${eq.id}`}
                    position={[lat, lng]}
                    icon={equipmentIcons[category] || DefaultIcon}
                  >
                    <Popup>{renderPopup(category, eq)}</Popup>
                  </Marker>
                );
              })
            )}
          </MapContainer>
        </div>
      </div>
      {/* Tableaux d'équipements */}
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(filteredEquipments).map(([category, data]) =>
          data.length > 0 ? (
            <Card key={category}>
              <CardHeader>
                <CardTitle>
                  {category} ({data.length})
                </CardTitle>
              </CardHeader>
              <CardContent>{renderTable(category, data)}</CardContent>
            </Card>
          ) : null
        )}
      </div>
    </div>
  );
};

export default EquipmentMap;
