// src/components/Dashboard/MissionsTable.tsx
import React, { useState } from "react";
import {
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Search,
  Filter,
  ChevronDown,
  Wrench,
} from "lucide-react";
import { MissionsTableProps } from "./types";
import {
  getMissionStatusStyles,
  getInterventionTypeName,
} from "./utils";
import { Mission } from "@/services/missions.service";

const MissionsTable: React.FC<MissionsTableProps> = ({
  missions,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [interventionFilter, setInterventionFilter] = useState<string>("all");

  const [showFilters, setShowFilters] = useState<boolean>(false);

  // État pour suivre la ligne survolée
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="h-full bg-white dark:bg-gray-950 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="animate-pulse h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Filtrer les missions selon la recherche et le filtre de statut
  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || mission.status === statusFilter;

    const matchesIntervention =
    interventionFilter === "all" ||
    String(mission.intervention_type_id) === interventionFilter;

    return matchesSearch && matchesStatus && matchesIntervention;
  });

  // Fonction pour formater une date (simulation)
  const formatDate = (mission: Mission) => {
    // Simulation de date basée sur l'ID pour la démo
    const day = ((mission.id * 3) % 28) + 1;
    const month = (mission.id % 12) + 1;
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/2025`;
  };

  return (
    <div className="h-full bg-white dark:bg-gray-950 rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold ">Missions récentes</h2>
          <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {filteredMissions.length} missions
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <button
            className="flex items-center text-sm  hover:text-blue-600 focus:outline-none"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
            <ChevronDown
              className={`h-3 w-3 ml-1 transition-transform ${showFilters ? "transform rotate-180" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Filtres additionnels (affichés conditionnellement) */}
      {showFilters && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-xs font-medium  block mb-1">Statut</label>
              <select
                className="bg-white dark:bg-gray-800  text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Terminée">Terminée</option>
                <option value="En attente">En attente</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium  block mb-1">
                Type d'intervention
              </label>
              <select 
              value={interventionFilter}
              onChange={(e) => setInterventionFilter(e.target.value)}
              className="bg-white dark:bg-gray-800 text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option value="all">Tous les types</option>
                <option value="1">Déploiement</option>
                <option value="2">Dépannage</option>
                <option value="3">Identification</option>
                <option value="4">Installation</option>
                <option value="5">Inventaire</option>
                <option value="6">Maintenance</option>
                <option value="7">Rapport</option>
                <option value="8">Visite</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-950">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                Titre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                <div className="flex items-center">
                  <Wrench className="h-3 w-3 mr-1" />
                  Type
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  Commune
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Crée le
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Status
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium  uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200">
            {filteredMissions.length > 0 ? (
              filteredMissions.slice(0, 5).map((mission) => (
                <tr
                  key={mission.id}
                  className={`${hoveredRow === mission.id
                      ? "bg-blue-50 dark:bg-gray-700"
                      : "hover:bg-gray-50"
                    } transition-colors duration-150`}
                  onMouseEnter={() => setHoveredRow(mission.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium ">
                      {mission.title.length > 15
                        ? mission.title.substring(0, 15).concat("...")
                        : mission.title}
                    </div>
                    {mission.description && (
                      <div className="text-xs  truncate max-w-xs">
                        {mission.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm  font-medium">
                      {getInterventionTypeName(mission.intervention_type_id) ||
                        "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm ">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {mission.streets
                        ?.map((s) => s.name)
                        .join(", ")
                        .substring(0, 35)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm ">{formatDate(mission)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMissionStatusStyles(
                        mission.status
                      )}`}
                    >
                      {mission.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={`/missions/${mission.id}`}
                      className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors duration-150"
                    >
                      Détails
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm ">
                  {searchTerm || statusFilter !== "all"
                    ? "Aucune mission ne correspond aux critères de recherche"
                    : "Aucune mission trouvée"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredMissions.length > 5 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center text-xs ">
          Affichage de 5 missions sur {filteredMissions.length}
        </div>
      )}

      <div className=" px-4 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="text-xs ">
          Mis à jour {new Date().toLocaleTimeString()}
        </div>
        <a
          href="/missions"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
        >
          Voir toutes les missions <ChevronRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default MissionsTable;
