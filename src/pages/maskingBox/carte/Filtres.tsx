import { X, Filter, Check } from "lucide-react";
import { FilterState } from "../types";

interface FiltresProps {
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  activeFilters: FilterState;
  toggleAllMunicipalities: () => void;
  toggleAllNetworks: () => void;
  toggleAllEquipmentTypes: () => void;
  availableMunicipalities: string[];
  availableNetworks: string[];
  toggleMunicipality: (municipality: string) => void;
  toggleNetwork: (network: string) => void;
  toggleEquipmentType: (
    equipmentType: "streetlights" | "metters" | "cabinets" | "substations"
  ) => void;
}
export default function Filtres({
  availableNetworks,
  filterOpen,
  setFilterOpen,
  activeFilters,
  toggleAllMunicipalities,
  toggleAllNetworks,
  toggleAllEquipmentTypes,
  availableMunicipalities,
  toggleMunicipality,
  toggleNetwork,
  toggleEquipmentType,
}: FiltresProps) {
  return (
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
              {Object.values(activeFilters.equipmentTypes).every((v) => v) &&
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
  );
}
