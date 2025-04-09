"use client";

import type React from "react";
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
// Contexte des équipements
import { useEquipements } from "@/contexts/EquipementContext";
// Correction du problème d'icônes dans React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { SkeletonCardUser } from "@/components/card/SkeletonCardUser";
import { SkeletonCard } from "@/components/card/SkeletonCard";
import { useAuth } from "@/contexts/AuthContext";

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
    iconUrl: "/clipart-blue-circle-f058.svg",
    iconSize: [15, 15],
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
  const { currentUser } = useAuth();
  const {
    streetlights,
    metters,
    cabinets,
    substations,
    loading,
    error,
    updateStreetlightPosition,
    updateMeterPosition,
  } = useEquipements();
  const [filter, setFilter] = useState<string>("all");
  const [selectedCommune, setSelectedCommune] = useState<string>("TOUTES");
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [resetMap, setResetMap] = useState(false);
  // Déclaration unique de la position utilisateur
  const [userPosition, setUserPosition] = useState<[number, number]>([
    4.0429389, 9.7062018,
  ]);
  const initialPosition: [number, number] = userPosition;

  // États pour le modal d'authentification
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [pendingMarkerUpdate, setPendingMarkerUpdate] = useState<{
    id: number;
    position: string;
    type: string;
  } | null>(null);

  const parseLocation = (location: string) => {
    const [lat, lng] = location.split(",").map(Number.parseFloat);
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

  //un type pour les positions
  type LatLngPosition = [number, number]; // Un tuple [latitude, longitude]

  // Puis typer correctement la fonction
  const calculateTotalDistance = (positions: LatLngPosition[]): string => {
    let totalDistance = 0;

    // Parcourir les positions et calculer la distance entre chaque paire de points consécutifs
    for (let i = 0; i < positions.length - 1; i++) {
      const point1 = L.latLng(positions[i][0], positions[i][1]);
      const point2 = L.latLng(positions[i + 1][0], positions[i + 1][1]);

      // Calculer la distance en mètres et l'ajouter au total
      const segmentDistance = point1.distanceTo(point2);
      totalDistance += segmentDistance;
    }

    // Convertir la distance totale en kilomètres
    return (totalDistance / 1000).toFixed(4);
  };

  // Fonction pour vérifier l'authentification avant de mettre à jour la position
  const verifyAndUpdatePosition = (
    id: number,
    newPosition: string,
    type: string
  ) => {
    // Stocker les informations de mise à jour en attente
    setPendingMarkerUpdate({
      id,
      position: newPosition,
      type,
    });

    // Ouvrir le modal d'authentification
    setIsAuthModalOpen(true);
  };

  // Fonction pour confirmer l'authentification et mettre à jour la position
  const confirmAuthentication = () => {
    if (!pendingMarkerUpdate) return;

    // Vérifier si l'email saisi correspond à l'email de l'utilisateur connecté
    if (emailInput === currentUser?.email) {
      // Effectuer la mise à jour de la position
      if (pendingMarkerUpdate.type === "Lampadaires") {
        updateStreetlightPosition(
          pendingMarkerUpdate.id,
          pendingMarkerUpdate.position
        );
        toast.success(
          "La position du lampadaire a été mise à jour avec succès."
        );
      } else if (pendingMarkerUpdate.type === "Compteurs") {
        updateMeterPosition(
          pendingMarkerUpdate.id,
          pendingMarkerUpdate.position
        );
        toast.success("La position du compteur a été mise à jour avec succès.");
      }

      // Fermer le modal et réinitialiser les états
      setIsAuthModalOpen(false);
      setEmailInput("");
      setPendingMarkerUpdate(null);
    } else {
      // Afficher un message d'erreur si l'email ne correspond pas
      toast.error("L'email saisi ne correspond pas à l'utilisateur connecté.");
    }
  };

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
    Lampadaires: (filter === "all" || filter === "streetlights"
      ? streetlights
      : []
    )?.filter((eq) =>
      selectedCommune === "TOUTES"
        ? true
        : (typeof eq.municipality === "string"
            ? eq.municipality
            : eq.municipality) === selectedCommune
    ),
    Compteurs: (filter === "all" || filter === "metters"
      ? metters
      : []
    )?.filter((eq) =>
      selectedCommune === "TOUTES"
        ? true
        : (typeof eq.municipality === "string"
            ? eq.municipality
            : eq.municipality?.name) === selectedCommune
    ),
    Amoires: (filter === "all" || filter === "cabinets"
      ? cabinets
      : []
    )?.filter((eq) =>
      selectedCommune === "TOUTES"
        ? true
        : (typeof eq.municipality === "string"
            ? eq.municipality
            : eq.municipality?.name) === selectedCommune
    ),
    Posts: (filter === "all" || filter === "substations"
      ? substations
      : []
    )?.filter((eq) =>
      selectedCommune === "TOUTES"
        ? true
        : (typeof eq.municipality === "string"
            ? eq.municipality
            : eq.municipality?.name) === selectedCommune
    ),
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
      case "Compteurs":
        return (
          <div className="z-50">
            <p>
              <strong>Presence : </strong>
              {eq.is_present === 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Numero : </strong>
              {eq.number}
            </p>
            <p>
              <strong>Marque : </strong>
              {eq.brand}
            </p>
            <p>
              <strong>Modele : </strong>
              {eq.model}
            </p>
            <p>
              <strong>Monte : </strong>
              {eq.is_mounted == 1 ? "Oui" : "Non"}
            </p>
            {eq.substation && (
              <p>
                <strong>Post : </strong>
                {eq.substation}
              </p>
            )}
            <p>
              <strong>Type : </strong>
              {eq.meter_type.name}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
            </p>
            <p>
              <strong>Localisation :</strong> {eq.location}
            </p>
          </div>
        );
      case "Amoires":
        return (
          <div className="z-50">
            <p>
              <strong>Est Fonctionnel : </strong>
              {eq.is_functional ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
            </p>
            <p>
              <strong>Localisation :</strong> {eq.location}
            </p>
          </div>
        );
      case "Posts":
        return (
          <div className="z-50">
            <p>
              <strong>Nom : </strong>
              {eq.name}
            </p>
            <p>
              <strong>Point de repère : </strong>
              {eq.popular_landmark}
            </p>
            <p>
              <strong>Block route number : </strong>
              {eq.block_route_number}
            </p>
            <p>
              <strong>Commune :</strong>{" "}
              {typeof eq.municipality === "string"
                ? eq.municipality
                : eq.municipality?.name}
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

  const lampadairePositions: [number, number][] = streetlights
    .map((eq) => {
      const [lat, lng] = eq.location.split(",").map(Number.parseFloat);
      return [lat, lng] as [number, number];
    })
    .filter((pos) => !isNaN(pos[0]) && !isNaN(pos[1]));

  return (
    <div className="container mx-auto py-1 space-y-4">
      {/* Filtrage des équipements */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <p className="font-semibold">Filtrer</p>
        <div className="bg-white dark:bg-gray-950">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Tous les equipements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les equipements</SelectItem>
              <SelectItem value="streetlights">Lampadaires</SelectItem>
              <SelectItem value="metters">Compteurs</SelectItem>
              <SelectItem value="cabinets">Armoires</SelectItem>
              <SelectItem value="substations">Postes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="bg-white dark:bg-gray-950">
          <Select value={selectedCommune} onValueChange={setSelectedCommune}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Toutes les communes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TOUTES">Toutes les communes</SelectItem>
              <SelectItem value="DOUALA 1">douala 1</SelectItem>
              <SelectItem value="DOUALA 2">douala 2</SelectItem>
              <SelectItem value="DOUALA 3">douala 3</SelectItem>
              <SelectItem value="DOUALA 4">douala 4</SelectItem>
              <SelectItem value="DOUALA 5">douala 5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Carte des équipements */}
      <div className="p-4 bg-white dark:bg-gray-950 rounded-md">
        {lampadairePositions.length > 1 && (
          <div className="bg-white dark:bg-gray-950 p-3 rounded-md mb-2">
            <p className="font-semibold">
              Distance totale du réseau de lampadaires:{" "}
              {calculateTotalDistance(lampadairePositions)} km
            </p>
          </div>
        )}
        <div className="h-[600px] w-full overflow-hidden rounded-lg relative z-10">
          <MapContainer
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
                const handleDragEnd = (e: L.LeafletEvent) => {
                  const marker = e.target;
                  const position = marker.getLatLng();
                  const newposition = `${position.lat},${position.lng}`;

                  // Au lieu de mettre à jour directement, ouvrir le modal d'authentification
                  verifyAndUpdatePosition(eq.id, newposition, category);
                };
                return (
                  <Marker
                    key={`${category}-${eq.id}`}
                    position={[lat, lng]}
                    icon={equipmentIcons[category] || DefaultIcon}
                    draggable={true}
                    eventHandlers={{
                      dragend: handleDragEnd,
                    }}
                  >
                    <Popup>{renderPopup(category, eq)}</Popup>
                  </Marker>
                );
              })
            )}
            {lampadairePositions.length > 1 && (
              <>
                <Polyline
                  positions={lampadairePositions}
                  pathOptions={{ color: "blue", weight: 3 }}
                />
              </>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Modal d'authentification */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Vérification d'identité</DialogTitle>
            <DialogDescription>
              Pour des raisons de sécurité, veuillez confirmer votre identité
              avant de modifier la position de l'équipement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Entrez votre email"
                className="col-span-3"
              />
            </div>
            {currentUser && (
              <p className="text-sm text-muted-foreground">
                Veuillez entrer l'email associé à votre compte:{" "}
                {currentUser.email?.substring(0, 3)}...
                {currentUser.email?.substring(currentUser.email.indexOf("@"))}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAuthModalOpen(false);
                setEmailInput("");
                setPendingMarkerUpdate(null);
              }}
            >
              Annuler
            </Button>
            <Button type="submit" onClick={confirmAuthentication}>
              Vérifier et modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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