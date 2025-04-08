/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-duplicate-case */
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
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
import DynamicHeader from "@/components/common/DynamicHeader";

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

const EquipmentMap: React.FC = () => {
  const { streetlights, metters, cabinets, substations, loading } =
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
      <DynamicHeader>
        <h1 className=" ml-5 text-3xl font-bold">Cartographie</h1>
      </DynamicHeader>

      {/* Carte des équipements */}
      <div className="p-2 dark:bg-gray-950">
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
                  <Marker key={`${category}-${eq.id}`} position={[lat, lng]}>
                    <Popup>{renderPopup(category, eq)}</Popup>
                  </Marker>
                );
              })
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default EquipmentMap;
