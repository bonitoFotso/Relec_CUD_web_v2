import { Button } from "@/components/ui/button";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Mission } from "@/services/missions.service";
import { Pencil1Icon, PersonIcon } from "@radix-ui/react-icons";
import {
  Table,
  Filter,
  ChevronDown,
  MoreHorizontal,
  TrashIcon,
} from "lucide-react";
import { getMissionStatusStyles } from "../dashboard/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Props {
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  showFilters: boolean;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  interventionFilter: string;
  setInterventionFilter: React.Dispatch<React.SetStateAction<string>>;
  filtered: Mission[];
  handleDetailsClick: (mission: Mission) => void;
  formatDate: (dateString?: string) => string;
  handleEditClick: (mission: Mission, event: React.MouseEvent) => void;
  handleDeleteClick: (mission: Mission, event: React.MouseEvent) => void;
  handleAssignClick: (mission: Mission, event: React.MouseEvent) => void;
  getInterventionTypeName: (id: number) => string;
}
export default function MissionTableStat({
  setShowFilters,
  showFilters,
  statusFilter,
  setStatusFilter,
  interventionFilter,
  setInterventionFilter,
  filtered,
  handleDetailsClick,
  formatDate,
  handleEditClick,
  handleDeleteClick,
  handleAssignClick,
  getInterventionTypeName,
}: Props) {
  return (
    <Table>
      <TableCaption>Liste des missions</TableCaption>
      <TableHeader>
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center text-sm  hover:text-blue-600 focus:outline-none p-2 bg-blue-800 text-white rounded-md"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filtres
            <ChevronDown
              className={`h-3 w-3 ml-1 transition-transform ${
                showFilters ? "transform rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Filtres additionnels (affichés conditionnellement) */}
        {showFilters && (
          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 ">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-xs font-medium  block mb-1">
                  Statut
                </label>
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
                  className="bg-white dark:bg-gray-800 text-sm border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les types</option>
                  <option value="Déploiement">Déploiement</option>
                  Déploiement
                  <option value="Dépannage">Dépannage</option>
                  <option value="Identification">Identification</option>
                  <option value="Installation">Installation</option>
                  <option value="Inventaire">Inventaire</option>
                  <option value="Inventaire">Maintenance</option>
                  <option value="Rapport">Rapport</option>
                  <option value="Visite">Visite</option>
                </select>
              </div>
            </div>
          </div>
        )}
        <TableRow>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Titre
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Type d'intervention
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Communes
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Entreprise
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Crée le
          </TableHead>
          <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Status
          </TableHead>
          <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              Aucune mission trouvée.
            </TableCell>
          </TableRow>
        ) : (
          filtered.map((m: Mission) => (
            <TableRow
              key={m.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleDetailsClick(m)}
            >
              <TableCell>{m.title}</TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getInterventionTypeName(m.intervention_type_id)}
                </Badge>
              </TableCell>
              <TableCell>DOUALA 1</TableCell>
              <TableCell>CUD</TableCell>
              <TableCell>{formatDate(m.created_at)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getMissionStatusStyles(
                    m.status
                  )}`}
                >
                  {m.status ? m.status : "En attente"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => handleEditClick(m, e)}>
                      <Pencil1Icon className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleAssignClick(m, e)}>
                      <PersonIcon className="mr-2 h-4 w-4" />
                      Assigner
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(m, e);
                      }}
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
