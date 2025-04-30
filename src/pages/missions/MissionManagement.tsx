import React, { useState, useEffect, useMemo } from "react";
import { useMissions } from "@/contexts/MissionContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Importer nos composants
import MissionFormDialog from "@/components/MissionFormDialog";
import AssignAgentDialog from "@/components/AssignAgentDialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mission } from "@/services/missions.service";
import { toast } from "react-toastify";
import { useUsers } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react";
import { SkeletonCard } from "@/components/card/SkeletonCard";
import { getMissionStatusStyles } from "../dashboard/utils";
import StatistiquesMissions from "./StatistiquesMissions";

// Mise à jour du schéma de validation pour le formulaire
export const missionFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Le titre doit contenir au moins 3 caractères." }),

  description: z.string().optional(),

  municipality_id: z
    .number()
    .min(1, { message: "Veuillez sélectionner une commune." }),

  streets: z
    .array(z.number())
    .min(1, { message: "Veuillez sélectionner au moins une rue." }),

  intervention_type_id: z
    .number()
    .min(1, { message: "Veuillez sélectionner un type d'intervention." }),

  company_id: z
    .number()
    .min(1, { message: "Veuillez sélectionner une compagnie." }),

  agents: z
    .array(z.number())
    .min(1, { message: "Veuillez sélectionner au moins un agent." }),
  network_type: z.string().min(3, { message: "Choisi le type de reseau" }),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;

const MissionManagement: React.FC = () => {
  const navigate = useNavigate();
  // Utilisation du contexte global MissionContext
  const {
    missions,
    formData,
    loading,
    error,
    createMission,
    updateMission,
    deleteMission,
    assignAgent,
    fetchMissions,
    fetchFormData,
  } = useMissions();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [interventionFilter, setInterventionFilter] = useState<string>("all");
  const [companieFilter, setCompanieFilter] = useState<string>("all");
  const [communeFilter, setCommuneFilter] = useState<string>("all");

  const [showFilters, setShowFilters] = useState<boolean>(false);

  const { fetchUsers } = useUsers();

  // États de filtres et recherche
  const [searchText, setSearchText] = useState<string>("");

  // Filtrage
  const filtered = useMemo(
    () =>
      missions.filter((m) => {
        //recherche
        if (
          searchText &&
          !m.title.toLowerCase().includes(searchText.toLowerCase())
        )
          return false;

        // Filtre par statut
        if (
          statusFilter !== "all" &&
          m.status.toLowerCase() !== statusFilter.toLowerCase()
        ) {
          return false;
        }

        // Filtre par type d'intervention
        if (
          interventionFilter !== "all" &&
          String(m.intervention_type) !== interventionFilter
        ) {
          return false;
        }
        // Filtre par entreprice
        if (
          companieFilter !== "all" &&
          String(Array.from(new Set(m.agents.map((a)=>(
            a.company_id
          ))))) !== companieFilter
        ) {
          return false;
        }
         // Filtre par commune
         if (
          communeFilter !== "all" &&
          String(Array.from(new Set(m.streets.map((s)=>(
            s.municipality_id
          ))))) !== communeFilter
        ) {
          return false;
        }
        return true;
      }),
    [missions, searchText, statusFilter, interventionFilter,companieFilter,communeFilter]
  );

  // Mise à jour des valeurs par défaut pour le formulaire
  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      streets: [], // Par défaut, tableau vide
      intervention_type_id: undefined,
    },
  });

  useEffect(() => {
    fetchUsers();
    fetchFormData();
    fetchMissions();
  }, [fetchUsers, fetchFormData, fetchMissions]);

  // Remplir le formulaire lors de l'édition d'une mission
  useEffect(() => {
    if (editingMission) {
      form.reset({
        title: editingMission.title,
        description: editingMission.description || "",
        // Adaptation ici pour prendre en compte plusieurs rues
        streets: editingMission.streets?.map((street) => street.id) || [],
        intervention_type_id: editingMission.intervention_type_id,
      });
    }
  }, [editingMission, form]);

  // Formatter la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: fr });
    } catch (e) {
      console.error(e);
      return "Date invalide";
    }
  };

  // Réinitialiser le formulaire et ouvrir la modale pour ajouter une nouvelle mission
  const handleAddClick = () => {
    setEditingMission(null);
    form.reset({
      title: "",
      description: "",
      streets: [], // Réinitialisation du tableau de rues
      intervention_type_id: undefined,
    });
    setIsFormDialogOpen(true);
  };

  // Gérer le clic sur Edit
  const handleEditClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMission(mission);
    setIsFormDialogOpen(true);
  };

  // Gérer le clic pour assigner un agent
  const handleAssignClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedMission(mission);
    setIsAssignDialogOpen(true);
  };

  // Gérer le clic pour supprimer
  const handleDeleteClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation();
    setMissionToDelete(mission);
    setIsAlertDialogOpen(true);
  };

  // Gérer la soumission du formulaire (création ou mise à jour)
  const onSubmit = async (values: Mission) => {
    try {
      if (editingMission) {
        await updateMission({
          ...values,
          id: editingMission.id,
          agents: values.agents,
          status: "",
        });
        toast.success("Mission mise à jour");
      } else {
        // Notez que createMission attend désormais un objet de type Mission
        await createMission({
          ...values,
          id: 0, // Provide a default value for 'id'
          agents: values.agents,
          status: "",
        });
        toast.success("Mission créée");
      }
      await fetchMissions();
      setIsFormDialogOpen(false);
    } catch (err) {
      console.error("Opération échouée :", err);
      toast.error("Opération échouée");
    }
  };

  // Gérer l'assignation d'un agent
  const handleAssignAgent = async (userId: number) => {
    if (!selectedMission?.id) return;
    try {
      await assignAgent(selectedMission.id, userId);
      toast.success("Agent assigné");
      setIsAssignDialogOpen(false);
    } catch (err) {
      console.error("Assignation échouée :", err);
      toast.error("Assignation échouée");
    }
  };

  // Fermer la boîte de dialogue de formulaire
  const handleFormDialogClose = () => {
    setIsFormDialogOpen(false);
  };

  // Gérer la confirmation de suppression
  const handleDeleteConfirm = async () => {
    if (missionToDelete?.id) {
      setIsDeleting(true);
      try {
        await deleteMission(missionToDelete.id);
        toast.success("Mission supprimée");
        setIsAlertDialogOpen(false);
      } catch (err) {
        console.error("Suppression échouée :", err);
        toast.error("Suppression échouée");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleDetailsClick = (mission: Mission) => {
    navigate(`/missions/${mission.id}`);
  };

  // Obtenir le libellé du type d'intervention
  const getInterventionTypeName = (id: number) => {
    const interventionType = formData?.interventions?.find(
      (type) => type.id === id
    );
    return interventionType?.name || "chargement...";
  };
    // Obtenir le libellé de la commune
    const getMunicipalityName = (id: number[]) => {
      const municipalityId: number = Array.from(new Set(id))[0];
      const municipality = formData?.municipalities?.find(
        (m) => m.id === municipalityId
      );
      return municipality?.name || "chargement...";
    };
    // Obtenir le libellé de l'entreprise'
        const getCompanyName = (id: number[]) => {
          const companyId: number = Array.from(new Set(id))[0];
          const company = formData?.companies?.find(
            (c) => c.id === companyId
          );
          return company?.name || "chargement...";
        };

  // Computed stats
  // plus sûr : on transforme d'abord status en chaîne vide si elle n'existe pas
  const safeStatus = (m: Mission) => (m.status || "").toLowerCase();

  const totalMissions = missions.length;
  const pendingCount = missions.filter(
    (m) => safeStatus(m) === "en attente"
  ).length;
  const inProgressCount = missions.filter(
    (m) => safeStatus(m) === "en cours"
  ).length;
  const completedCount = missions.filter(
    (m) => safeStatus(m) === "terminé"
  ).length;

  // et ta fonction percent reste la même
  const percent = (count: number) =>
    totalMissions ? ((count / totalMissions) * 100).toFixed(0) : "0";

  // Obtenir le nom de l'utilisateur
  // const getUserName = (id: number) => {
  //   const user = users?.find((u) => u.id === id);
  //   return user?.name || "Utilisateur inconnu";
  // };

  return (
    <div className="bg-white rounded-lg container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Missions</h1>
        <div className="flex gap-3 flex-col md:flex-row">
          <Button onClick={handleAddClick}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Ajouter une mission
          </Button>
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher une mission par titre..."
              className="w-[250px] h-10 pl-8 pr-4 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <StatistiquesMissions
        totalMissions={totalMissions}
        pendingCount={pendingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
        percent={percent}
      />

      {/* Recherche */}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 p-2 md:p-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-950 p-4 rounded-xl">
          {showFilters && (

                <div className="w-auto px-4 py-4 mt-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                    {/* Filtre de statut */}
                    <div className="w-full md:w-auto">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                        Statut
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-white dark:bg-gray-800 text-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                        >
                          <option value="all">Tous les statuts</option>
                          <option value="En attente">En attente</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                      </div>
                    </div>

                    {/* Filtre de type d'intervention */}
                    <div className="w-full md:w-auto">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                        Type d'intervention
                      </label>
                      <div className="relative">
                        <select
                          value={interventionFilter}
                          onChange={(e) =>
                            setInterventionFilter(e.target.value)
                          }
                          className="w-full bg-white dark:bg-gray-800 text-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                        >
                          <option value="all">Tous les types</option>
                          <option value="Déploiement">Déploiement</option>
                          <option value="Dépannage">Dépannage</option>
                          <option value="Identification">Identification</option>
                          <option value="Installation">Installation</option>
                          <option value="Inventaire">Inventaire</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Rapport">Rapport</option>
                          <option value="Visite">Visite</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                      </div>
                    </div>
                    {/* Filtre per Entreprise */}
                    <div className="w-full md:w-auto">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                        Entreprise
                      </label>
                      <div className="relative">
                        <select
                          value={companieFilter}
                          onChange={(e) =>
                            setCompanieFilter(e.target.value)
                          }
                          className="w-full bg-white dark:bg-gray-800 text-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                        >
                          <option value="all">Tous les types</option>
                          {formData?.companies?.map((company) => (
                            <option key={company.id} value={company.id}>
                              {company.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                      </div>
                    </div>
                     {/* Filtre per Commune */}
                     <div className="w-full md:w-auto">
                      <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">
                        Commune
                      </label>
                      <div className="relative">
                        <select
                          value={communeFilter}
                          onChange={(e) =>
                            setCommuneFilter(e.target.value)
                          }
                          className="w-full bg-white dark:bg-gray-800 text-sm border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                        >
                          <option value="all">Tous les types</option>
                          {formData?.municipalities?.map((mucipality) => (
                            <option key={mucipality.id} value={mucipality.id}>
                              {mucipality.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-500" />
                      </div>
                    </div>

                    {/* Bouton pour réinitialiser les filtres */}
                    <div className="md:ml-auto mt-2 md:mt-0">
                      <button
                        onClick={() => {
                          setStatusFilter("all");
                          setInterventionFilter("all");
                          setCompanieFilter("all");
                          setCommuneFilter("all");
                        }}
                        className="text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200 flex items-center"
                      >
                        <span>Réinitialiser</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5 ml-1.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
          
          <Table>
            <TableCaption>Liste des missions</TableCaption>
            <TableHeader>
              <div className="flex items-center space-x-2">
                <button
                  className="w-[100px] flex items-center text-sm  focus:outline-none p-2 bg-blue-800 text-white rounded-md"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filtres
                  <ChevronDown
                    className={`h-3 w-3 ml-2 transition-transform ${
                      showFilters ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              

              {/* Filtres additionnels (affichés conditionnellement) */}
              
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
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
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
                    <TableCell>
                      {getMunicipalityName(m.streets.map((s)=>(s.municipality_id)))}
                    </TableCell>
                    <TableCell>
                    {getCompanyName(m.agents.map((a)=>(a.company_id)))}
                      
                    </TableCell>
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
                          <DropdownMenuItem
                            onClick={(e) => handleEditClick(m, e)}
                          >
                            <Pencil1Icon className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleAssignClick(m, e)}
                          >
                            <PersonIcon className="mr-2 h-4 w-4" />
                            Assigner
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => handleDeleteClick(m, e)}
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
        </div>
      )}

      {/* Formulaire de mission */}
      <MissionFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        form={form}
        onSubmit={onSubmit}
        onCancel={handleFormDialogClose}
        editingMission={editingMission}
        formData={formData}
      />

      {/* Dialogue d'assignation d'agent */}
      <AssignAgentDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        mission={selectedMission}
        onAssign={handleAssignAgent}
      />

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement la mission "{missionToDelete?.title}" et toutes ses
              données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> Suppression...
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MissionManagement;
