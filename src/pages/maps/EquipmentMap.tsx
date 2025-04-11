"use client";

import type React from "react";
import { Fragment, useEffect, useMemo, useState } from "react";
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
import { SkeletonCardUser } from "@/components/card/SkeletonCardUser";
import { SkeletonCard } from "@/components/card/SkeletonCard";
import { useAuth } from "@/contexts/AuthContext";
import { EquipementStreetlights } from "@/services/EquipementService";
import { Check, Filter, X } from "lucide-react";
import { FilterState } from "../maskingBox/types";
import {
  calculateTotalDistance,
  DefaultIcon,
  equipmentIcons,
  parseLocation,
} from "./functions";

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
    updateCabinetPosition,
    updateSubstationPosition,
  } = useEquipements();
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
  const [popupInfo, setPopupInfo] = useState<{
    position: [number, number];
    distance: number;
    cabinetId: string;
  } | null>(null);

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
      } else if (pendingMarkerUpdate.type === "Amoires") {
        updateCabinetPosition(
          pendingMarkerUpdate.id,
          pendingMarkerUpdate.position
        );
        toast.success(
          "La position de l'armoire a été mise à jour avec succès."
        );
      } else if (pendingMarkerUpdate.type === "Substations") {
        updateSubstationPosition(
          pendingMarkerUpdate.id,
          pendingMarkerUpdate.position
        );
        toast.success("La position du poste a été mise à jour avec succès.");
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

  const renderPopup = (category: string, eq: any) => {
    switch (category) {
      case "Lampadaires":
        return (
          <div className="z-50">
            <div className="w-full flex justify-center items-center">
              <img
                src="https://static.thenounproject.com/png/3237447-200.png"
                alt="lampadaire"
              />
            </div>
            <p>
              <strong>Presence de le lampe : </strong>
              {eq.has_lamp === 1 ? "Oui" : "Non"}
            </p>
            <p>
              <strong>Puissance : </strong>
              {eq.power} W
            </p>

            <p>
              <strong>Type de lampadaire:</strong> {eq.streetlight_type}
            </p>
            <p>
              <strong>Type de commande : </strong>
              {eq.command_type}
            </p>
            <p>
              <strong>Type de lampe : </strong>
              {eq.lamps.map((l: { lamp_type: any }) => l.lamp_type)}
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
          </div>
        );
      case "Compteurs":
        return (
          <div className="z-50">
            <div className="w-full flex justify-center items-center">
              <img
                src="https://static.thenounproject.com/png/3237447-200.png"
                alt="compteur"
              />
            </div>
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
          </div>
        );
      case "Amoires":
        return (
          <div className="z-50">
            <div className="w-full flex justify-center items-center">
              <img
                src="https://static.thenounproject.com/png/3237447-200.png"
                alt="armoire"
              />
            </div>
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
          </div>
        );
      case "Substations":
        return (
          <div className="z-50">
            <div className="w-full flex justify-center items-center">
              <img
                src="https://static.thenounproject.com/png/3237447-200.png"
                alt="poste"
              />
            </div>
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
          </div>
        );
      default:
        return null;
    }
  };
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

  const groupedByCabinet = streetlights.reduce((acc, streetlight) => {
    if (!streetlight.cabinet_id) return acc;

    if (!acc[streetlight.cabinet_id]) {
      acc[streetlight.cabinet_id] = [];
    }

    acc[streetlight.cabinet_id].push(streetlight);
    return acc;
  }, {} as Record<number, EquipementStreetlights[]>);

  // Résultat du calcul par groupe :
  const distanceParCabinet = Object.entries(groupedByCabinet).map(
    ([cabinetId, group]) => {
      const positions: [number, number][] = group
        .map((l) => {
          const parts = l.location.split(",").map(Number);
          return parts.length === 2
            ? ([parts[0], parts[1]] as [number, number])
            : null;
        })
        .filter((pos): pos is [number, number] => pos !== null);

      return {
        cabinetId,
        distance: calculateTotalDistance(positions),
      };
    }
  );

  return (
    <div className="container mx-auto py-1 space-y-4">
      {/* Carte des équipements */}
      <div className="h-[85vh] w-full overflow-hidden rounded-lg relative z-10">
        {/* Filtrage des équipements */}
        <div className="absolute bottom-4 right-4 z-20">
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

        <MapContainer
          center={[4.0911652, 9.7358404]}
          zoom={80}
          style={{ height: "100%", width: "100%" }}
          className="leaflet-container rounded-lg z-10"
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
          {Object.entries(groupedByCabinet).map(([cabinetId, lampGroup]) => {
            const positions: [number, number][] = lampGroup
              .map((l) => {
                const parts = l.location.split(",").map(Number);
                if (parts.length === 2)
                  return [parts[0], parts[1]] as [number, number];
                return null;
              })
              .filter((pos): pos is [number, number] => pos !== null);

            const cabinet = cabinets.find((c) => c.id === Number(cabinetId));
            const [cabLat, cabLng] =
              cabinet?.location.split(",").map(Number) || [];

            const totalDistance = calculateTotalDistance(positions);

            return (
              <Fragment key={cabinetId}>
                {/* Polyline entre lampadaires */}
                <Polyline
                  positions={positions}
                  color="blue"
                  eventHandlers={{
                    click: () => {
                      const midIndex = Math.floor(positions.length / 2);
                      const centerPos = positions[midIndex];
                      setPopupInfo({
                        position: centerPos,
                        distance: totalDistance,
                        cabinetId,
                      });
                    },
                  }}
                />

                {/* Lignes entre chaque lampadaire et l’armoire */}
                {positions.map((lampPos, idx) => (
                  <Polyline
                    key={idx}
                    positions={[lampPos, [cabLat, cabLng]]}
                    color="gray"
                    dashArray="4"
                  />
                ))}
              </Fragment>
            );
          })}
          {cabinets.map((cabinet) => {
            if (!cabinet.location || !cabinet.meter_id) return null;

            const cabinetPos = parseLocation(cabinet.location);
            const meter = metters.find((m) => m.id === cabinet.meter_id);
            if (!meter || !meter.location) return null;

            const meterPos = parseLocation(meter.location);

            return (
              <Polyline
                key={`cabinet-meter-${cabinet.id}`}
                positions={[cabinetPos, meterPos]}
                color="gray"
                weight={2}
                dashArray="6"
              />
            );
          })}
        </MapContainer>
      </div>
      <div className="my-8">
        <h1 className="text-xl md:text-3xl font-bold text-center">
          Tableau recapitulatif du nombre de supports par commune
        </h1>
      </div>
      <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="px-4 py-2 text-left">Commune</th>
            {types.map((type) => (
              <th key={type} className="px-4 py-2 text-left">
                {type}
              </th>
            ))}
            <th className="px-4 py-2 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          {municipalities.map((municipality) => {
            const counts = groupedByMunicipality[municipality];
            const total = Object.values(counts).reduce(
              (sum, val) => sum + val,
              0
            );
            return (
              <tr key={municipality} className="border-t">
                <td className="px-4 py-2">{municipality}</td>
                {types.map((type) => (
                  <td key={type} className="px-4 py-2">
                    {counts[type]}
                  </td>
                ))}
                <td className="px-4 py-2 font-bold">{total}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-gray-100 dark:bg-gray-800 font-semibold">
            <td className="px-4 py-2">Total</td>
            {types.map((type) => (
              <td key={type} className="px-4 py-2">
                {totalByType[type]}
              </td>
            ))}
            <td className="px-4 py-2">
              {Object.values(totalByType).reduce((sum, val) => sum + val, 0)}
            </td>
          </tr>
        </tfoot>
      </table>

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
      {popupInfo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              onClick={() => setPopupInfo(null)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Détails du Réseau</h2>
            <p className="text-sm">
              <span className="font-semibold">Cabinet ID :</span>{" "}
              {popupInfo.cabinetId}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Distance du réseau :</span>{" "}
              {popupInfo.distance.toFixed(2)} km
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default EquipmentMap;
