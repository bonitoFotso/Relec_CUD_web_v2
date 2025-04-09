/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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
import {
  EquipementStreetlights,
  EquipementMetters,
  EquipementCabinets,
  EquipementSubstations,
} from "@/services/EquipementService";

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

// Créer des icônes pour les différents types de lampadaires
const createLampIcon = (color: string) => {
  // Utiliser l'icône par défaut mais changer la couleur avec un filtre CSS
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    className: "",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Icônes pour les différents types de lampadaires
const LampIcons = {
  LED: createLampIcon("#4CAF50"),
  Decharge_avec_ballast: createLampIcon("#FFC107"),
  Decharge_sans_ballast: createLampIcon("#F44336"),
};

L.Marker.prototype.options.icon = DefaultIcon;

const EquipmentMap: React.FC = () => {
  const { streetlights, metters, cabinets, substations, loading } =
    useEquipements();
  const [filter, setFilter] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [resetMap, setResetMap] = useState(false);

  // État pour la configuration des lampadaires
  const [selectedLamp, setSelectedLamp] = useState(null);
  const [onTime, setOnTime] = useState("18:00");
  const [offTime, setOffTime] = useState("06:00");
  const [brightness, setBrightness] = useState(100);

  // Position utilisateur
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
    setUserPosition([4.0429389, 9.7062018]);
    setResetMap(true);
  };

  // Détermine quel icône utiliser pour un lampadaire
  const getLampIcon = (
    lamp:
      | EquipementStreetlights
      | EquipementMetters
      | EquipementCabinets
      | EquipementSubstations
  ) => {
    if (!lamp || !lamp.lamp_type) return DefaultIcon;

    const lampType = lamp.lamp_type.toLowerCase();

    if (lampType.includes("led")) {
      return LampIcons.LED;
    } else if (lampType.includes("décharge") || lampType.includes("decharge")) {
      return lampType.includes("ballast")
        ? LampIcons.Decharge_avec_ballast
        : LampIcons.Decharge_sans_ballast;
    }

    return DefaultIcon;
  };

  // Mettre à jour les paramètres d'un lampadaire
  const updateLampSettings = () => {
    if (!selectedLamp) return;

    try {
      // Simuler la mise à jour (à remplacer par votre API réelle)
      console.log("Mise à jour du lampadaire:", {
        id: selectedLamp.id,
        on_time: onTime,
        off_time: offTime,
        brightness_level: brightness,
      });

      // Fermer le modal
      setSelectedLamp(null);

      alert("Lampadaire mis à jour avec succès");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  // Géolocalisation de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
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

  const filteredEquipments = {
    Lampadaires:
      filter === "all" || filter === "streetlights" ? streetlights : [],
    LED: filter === "all" || filter === "LED" ? metters : [],
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
            <button
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedLamp(eq)}
            >
              Configurer
            </button>
          </div>
        );
      default:
        return (
          <div className="z-50">
            <p>
              <strong>Type:</strong> {category}
            </p>
            <p>
              <strong>ID:</strong> {eq.id}
            </p>
            <p>
              <strong>Localisation:</strong> {eq.location}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <DynamicHeader>
        <h1 className="ml-5 text-3xl font-bold">Cartographie</h1>
      </DynamicHeader>

      {/* Légende des types de lampadaires */}
      <div className="grid grid-cols-3 gap-2 p-2">
        <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>LED</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span>Décharge avec ballast</span>
        </div>
        <div className="flex items-center space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span>Décharge sans ballast</span>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 p-2">
        <select
          className="p-2 border rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tous les équipements</option>
          <option value="LED">LED</option>
          <option value="decharge_sans_ballast">Decharges sans ballast</option>
          <option value="decharge_avec_ballast">Decharges avec ballast</option>
        </select>
        <Button variant="outline" onClick={resetMapView}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Réinitialiser
        </Button>
      </div>

      {/* Carte */}
      <div className="p-2 dark:bg-gray-950">
        <div className="h-[600px] w-full overflow-hidden rounded-lg relative z-10">
          <MapContainer
            center={[4.0429389, 9.7062018]}
            zoom={80}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater />

            {/* Marqueur utilisateur */}
            <Marker position={userPosition}>
              <Popup>Votre position</Popup>
            </Marker>

            {/* Marqueurs des équipements */}
            {Object.entries(filteredEquipments).map(([category, equipments]) =>
              equipments.map((eq) => {
                const { lat, lng } = parseLocation(eq.location);
                const markerIcon =
                  category === "Lampadaires" ? getLampIcon(eq) : DefaultIcon;

                return (
                  <Marker
                    key={`${category}-${eq.id}`}
                    position={[lat, lng]}
                    icon={markerIcon}
                  >
                    <Popup>{renderPopup(category, eq)}</Popup>
                  </Marker>
                );
              })
            )}
          </MapContainer>
        </div>
      </div>

      {/* Modal pour configurer un lampadaire */}
      {selectedLamp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              Configuration du lampadaire #{selectedLamp.id}
            </h2>

            <div>
              <label className="block mb-2">Heure d'allumage:</label>
              <input
                type="time"
                value={onTime}
                onChange={(e) => setOnTime(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Heure d'extinction:</label>
              <input
                type="time"
                value={offTime}
                onChange={(e) => setOffTime(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
            </div>

            <div>
              <label className="block mb-2">Luminosité: {brightness}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full mb-4"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setSelectedLamp(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={updateLampSettings}
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentMap;
