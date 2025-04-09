/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Skeleton } from "@/components/ui/skeleton";

// Contexte des équipements
import { useEquipements } from "@/contexts/EquipementContext";

// Correction du problème d'icônes dans React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { SkeletonCardUser } from "@/components/card/SkeletonCardUser";
import { SkeletonCard } from "@/components/card/SkeletonCard";
import { Check, Filter, X } from "lucide-react";
import { FilterState } from "./types";

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
// definir les icones specifiques

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
  Substations: L.icon({
    iconUrl: "/substation-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
};

const EquipmentMap: React.FC = () => {
  const { streetlights, metters, cabinets, substations, loading } =
    useEquipements();
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [resetMap, setResetMap] = useState(false);

  // États pour les filtres dynamiques
  const [filterOpen, setFilterOpen] = useState(false);
  const [availableMunicipalities, setAvailableMunicipalities] = useState<
    string[]
  >([]);
  const [availableNetworks, setAvailableNetworks] = useState<string[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    municipalities: [],
    networks: [],
    equipmentTypes: {
      streetlights: true,
      metters: true,
      cabinets: true,
      substations: true,
    },
  });

  // Déclaration unique de la position utilisateur
  const [userPosition, setUserPosition] = useState<[number, number]>([
    4.0429389, 9.7062018,
  ]);

  const initialPosition: [number, number] = userPosition;

  // Fonction pour extraire et dédupliquer les municipalités et réseaux
  useEffect(() => {
    if (!loading) {
      // Extraire toutes les municipalités
      const allMunicipalities = new Set<string>();
      const allNetworks = new Set<string>();

      // Fonction d'aide pour extraire le nom de la municipalité
      const extractMunicipalityName = (item: any) => {
        if (!item.municipality) return "Non défini";
        return typeof item.municipality === "string"
          ? item.municipality
          : item.municipality?.name || "Non défini";
      };

      // Extraire les municipalités et réseaux des lampadaires
      streetlights.forEach((item: any) => {
        allMunicipalities.add(extractMunicipalityName(item));
        if (item.network) allNetworks.add(item.network);
      });

      // Faire de même pour les autres équipements
      metters.forEach((item: any) => {
        allMunicipalities.add(extractMunicipalityName(item));
        if (item.network) allNetworks.add(item.network);
      });

      cabinets.forEach((item: any) => {
        allMunicipalities.add(extractMunicipalityName(item));
        if (item.network) allNetworks.add(item.network);
      });

      substations.forEach((item: any) => {
        allMunicipalities.add(extractMunicipalityName(item));
        if (item.network) allNetworks.add(item.network);
      });

      // Convertir les Sets en arrays et mettre à jour l'état
      setAvailableMunicipalities(Array.from(allMunicipalities).sort());
      setAvailableNetworks(Array.from(allNetworks).sort());
    }
  }, [streetlights, metters, cabinets, substations, loading]);

  const parseLocation = (location: string) => {
    try {
      const [lat, lng] = location.split(",").map(parseFloat);
      if (isNaN(lat) || isNaN(lng)) {
        console.error(`Invalid location format: ${location}`);
        return { lat: 4.0429389, lng: 9.7062018 }; // Position par défaut
      }
      return { lat, lng };
    } catch (error) {
      console.error(`Error parsing location: ${location}`, error);
      return { lat: 4.0429389, lng: 9.7062018 }; // Position par défaut
    }
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

  // Fonctions de gestion des filtres
  const toggleMunicipality = (municipality: string) => {
    setActiveFilters((prev) => {
      const newMunicipalities = [...prev.municipalities];
      const index = newMunicipalities.indexOf(municipality);

      if (index === -1) {
        newMunicipalities.push(municipality);
      } else {
        newMunicipalities.splice(index, 1);
      }

      return {
        ...prev,
        municipalities: newMunicipalities,
      };
    });
  };

  const toggleNetwork = (network: string) => {
    setActiveFilters((prev) => {
      const newNetworks = [...prev.networks];
      const index = newNetworks.indexOf(network);

      if (index === -1) {
        newNetworks.push(network);
      } else {
        newNetworks.splice(index, 1);
      }

      return {
        ...prev,
        networks: newNetworks,
      };
    });
  };

  const toggleEquipmentType = (
    type: keyof typeof activeFilters.equipmentTypes
  ) => {
    setActiveFilters((prev) => ({
      ...prev,
      equipmentTypes: {
        ...prev.equipmentTypes,
        [type]: !prev.equipmentTypes[type],
      },
    }));
  };

  // Pour sélectionner/désélectionner toutes les municipalités
  const toggleAllMunicipalities = () => {
    setActiveFilters((prev) => ({
      ...prev,
      municipalities:
        prev.municipalities.length === availableMunicipalities.length
          ? []
          : [...availableMunicipalities],
    }));
  };

  // Pour sélectionner/désélectionner tous les réseaux
  const toggleAllNetworks = () => {
    setActiveFilters((prev) => ({
      ...prev,
      networks:
        prev.networks.length === availableNetworks.length
          ? []
          : [...availableNetworks],
    }));
  };

  // Pour sélectionner/désélectionner tous les types d'équipements
  const toggleAllEquipmentTypes = () => {
    const allSelected = Object.values(activeFilters.equipmentTypes).every(
      (v) => v
    );

    setActiveFilters((prev) => ({
      ...prev,
      equipmentTypes: {
        streetlights: !allSelected,
        metters: !allSelected,
        cabinets: !allSelected,
        substations: !allSelected,
      },
    }));
  };

  // Fonction pour vérifier si un équipement doit être affiché selon les filtres
  const shouldShowEquipment = (equipment: any, type: string) => {
    // Si aucun filtre de municipalité n'est actif, montrer tous les équipements
    // Sinon, vérifier si la municipalité de l'équipement est dans les filtres actifs
    const municipalityCheck =
      activeFilters.municipalities.length === 0 ||
      activeFilters.municipalities.includes(
        typeof equipment.municipality === "string"
          ? equipment.municipality
          : equipment.municipality?.name || "Non défini"
      );

    // Même logique pour les réseaux
    const networkCheck =
      activeFilters.networks.length === 0 ||
      (equipment.network && activeFilters.networks.includes(equipment.network));

    // Vérifier le type d'équipement
    let equipmentTypeCheck = false;
    switch (type) {
      case "Lampadaires":
        equipmentTypeCheck = activeFilters.equipmentTypes.streetlights;
        break;
      case "Compteurs":
        equipmentTypeCheck = activeFilters.equipmentTypes.metters;
        break;
      case "Amoires":
        equipmentTypeCheck = activeFilters.equipmentTypes.cabinets;
        break;
      case "Substations":
        equipmentTypeCheck = activeFilters.equipmentTypes.substations;
        break;
      default:
        equipmentTypeCheck = true;
    }

    return municipalityCheck && networkCheck && equipmentTypeCheck;
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

  // Filtrer les équipements
  const filteredEquipments = {
    Lampadaires: streetlights.filter((eq) =>
      shouldShowEquipment(eq, "Lampadaires")
    ),
    Compteurs: metters.filter((eq) => shouldShowEquipment(eq, "Compteurs")),
    Amoires: cabinets.filter((eq) => shouldShowEquipment(eq, "Amoires")),
    Substations: substations.filter((eq) =>
      shouldShowEquipment(eq, "Substations")
    ),
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
      default:
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
    }
  };

  const lampadairePositions: [number, number][] = streetlights
    .map((eq) => {
      const [lat, lng] = eq.location.split(",").map(Number.parseFloat);
      return [lat, lng] as [number, number];
    })
    .filter((pos) => !isNaN(pos[0]) && !isNaN(pos[1]));
  return (
    <div className=" dark:bg-gray-950">
      <div className="h-[80vh] w-full overflow-hidden rounded-lg relative z-10">
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="bg-blue-600 flex gap-2 items-center text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300"
          >
            <p>Filtrer</p>
            {filterOpen ? <X size={24} /> : <Filter size={24} />}
          </button>

          {filterOpen && (
            <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-72 max-h-96 overflow-y-auto">
              <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-white flex justify-between items-center">
                Filtres
                <button
                  onClick={() => {
                    toggleAllMunicipalities();
                    toggleAllNetworks();
                    toggleAllEquipmentTypes();
                  }}
                  className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {Object.values(activeFilters.equipmentTypes).every(
                    (v) => v
                  ) &&
                  activeFilters.municipalities.length ===
                    availableMunicipalities.length &&
                  activeFilters.networks.length === availableNetworks.length
                    ? "Désélectionner tout"
                    : "Sélectionner tout"}
                </button>
              </h3>

              {/* Municipalités */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex justify-between items-center">
                  Municipalités
                  <button
                    onClick={toggleAllMunicipalities}
                    className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {activeFilters.municipalities.length ===
                    availableMunicipalities.length
                      ? "Désélectionner"
                      : "Sélectionner"}
                  </button>
                </h4>
                <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                  {availableMunicipalities.map((municipality) => (
                    <label
                      key={municipality}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          activeFilters.municipalities.length === 0 ||
                          activeFilters.municipalities.includes(municipality)
                        }
                        onChange={() => toggleMunicipality(municipality)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {municipality}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Réseaux */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex justify-between items-center">
                  Réseaux
                  <button
                    onClick={toggleAllNetworks}
                    className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {activeFilters.networks.length === availableNetworks.length
                      ? "Désélectionner"
                      : "Sélectionner"}
                  </button>
                </h4>
                <div className="space-y-2 max-h-24 overflow-y-auto pr-2">
                  {availableNetworks.map((network) => (
                    <label
                      key={network}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          activeFilters.networks.length === 0 ||
                          activeFilters.networks.includes(network)
                        }
                        onChange={() => toggleNetwork(network)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {network}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Types d'équipements */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-200 flex justify-between items-center">
                  Équipements
                  <button
                    onClick={toggleAllEquipmentTypes}
                    className="text-xs bg-gray-200 dark:bg-gray-700 p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {Object.values(activeFilters.equipmentTypes).every((v) => v)
                      ? "Désélectionner"
                      : "Sélectionner"}
                  </button>
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.equipmentTypes.streetlights}
                      onChange={() => toggleEquipmentType("streetlights")}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Lampadaires
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.equipmentTypes.metters}
                      onChange={() => toggleEquipmentType("metters")}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Compteurs
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.equipmentTypes.cabinets}
                      onChange={() => toggleEquipmentType("cabinets")}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Amoires
                    </span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.equipmentTypes.substations}
                      onChange={() => toggleEquipmentType("substations")}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Postes
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setFilterOpen(false)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Check size={16} />
                <span>Appliquer et fermer</span>
              </button>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-2 absolute bottom-4 left-4 z-20">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            <p className="flex gap-1">
              Lampadaires: {filteredEquipments.Lampadaires.length}
            </p>
            <p className="flex gap-1">
              Compteurs: {filteredEquipments.Compteurs.length}
            </p>
            <p className="flex gap-1">
              Amoires: {filteredEquipments.Amoires.length}
            </p>
            <p className="flex gap-1">
              Postes: {filteredEquipments.Substations.length}
            </p>
          </div>
        </div>

        <MapContainer
          center={[4.0911652, 9.7358404]}
          zoom={80}
          style={{ height: "100%", width: "100%" }}
          className="leaflet-container rounded-lg z-10"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapUpdater />
          {Object.entries(filteredEquipments).map(([category, equipments]) =>
            equipments.map((eq: any) => {
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
  );
};

export default EquipmentMap;
