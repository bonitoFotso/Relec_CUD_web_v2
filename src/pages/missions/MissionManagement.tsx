/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from "react";
import { useMissions } from "@/contexts/MissionContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusIcon,
  CalendarIcon,
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
import { MoreHorizontal } from "lucide-react";
import { SkeletonCard } from "@/components/card/SkeletonCard";

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

  const { users, fetchUsers } = useUsers();

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
    return interventionType?.name || "Type inconnu";
  };

  // Obtenir le nom de l'utilisateur
  const getUserName = (id: number) => {
    const user = users?.find((u) => u.id === id);
    return user?.name || "Utilisateur inconnu";
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Missions</h1>
        <Button onClick={handleAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter une mission
        </Button>
      </div>

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
          <Table>
            <TableCaption>Liste des missions</TableCaption>
            <TableHeader>
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
                  Rue(s)
                </TableHead>
                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Crée le
                </TableHead>
                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {missions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    Aucune mission trouvée. Cliquez sur "Ajouter une mission"
                    pour commencer.
                  </TableCell>
                </TableRow>
              ) : (
                missions.map((mission) => (
                  <TableRow
                    key={mission.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => handleDetailsClick(mission)}
                  >
                    <TableCell className="font-medium">
                      {mission.title.length > 20
                        ? mission.title.substring(0, 20).concat("...")
                        : mission.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getInterventionTypeName(mission.intervention_type_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* Utilisation de la nouvelle fonction pour les rues multiples */}
                      {mission.streets
                        ?.map((s) => s.name)
                        .join(", ")
                        .substring(0, 35)}
                    </TableCell>
                    <TableCell>
                      {mission.user_id && getUserName(mission.user_id)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3 text-gray-500" />
                        <span className="text-sm">
                          {formatDate(mission.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e: React.MouseEvent) =>
                              handleEditClick(mission, e)
                            }
                          >
                            <Pencil1Icon className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e: React.MouseEvent) =>
                              handleAssignClick(mission, e)
                            }
                          >
                            <PersonIcon className="mr-2 h-4 w-4" />
                            Assigner un agent
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={(e: React.MouseEvent) =>
                              handleDeleteClick(mission, e)
                            }
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
