// pages/MissionManagement.tsx
import React, { useState, useEffect } from 'react';
import { useMissions } from '@/contexts/MissionContext';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  PlusIcon, 
  CalendarIcon,
  Pencil1Icon,
  TrashIcon,
  PersonIcon
} from "@radix-ui/react-icons";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Importer nos composants
import MissionFormDialog from '@/components/MissionFormDialog';
import AssignAgentDialog from '@/components/AssignAgentDialog';
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
import { Mission } from '@/services/missions.service';
import { toast } from 'sonner';
import { useUsers } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

// Définition du schéma de validation pour le formulaire
const missionFormSchema = z.object({
  title: z.string().min(3, { message: "Le titre doit contenir au moins 3 caractères." }),
  description: z.string().optional(),
  user_id: z.number({
    required_error: "Veuillez sélectionner un responsable."
  }),
  street_id: z.number({
    required_error: "Veuillez sélectionner une rue."
  }),
  intervention_type_id: z.number({
    required_error: "Veuillez sélectionner un type d'intervention."
  }),
});

export type MissionFormValues = z.infer<typeof missionFormSchema>;

const MissionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { 
    missions, 
    formData, 
    loading, 
    error, 
    fetchMissions, 
    fetchFormData, 
    createMission, 
    updateMission, 
    deleteMission, 
    assignAgent 
  } = useMissions();
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missionToDelete, setMissionToDelete] = useState<Mission | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const { users, fetchUsers } = useUsers();

  const form = useForm<MissionFormValues>({
    resolver: zodResolver(missionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      user_id: undefined,
      street_id: undefined,
      intervention_type_id: undefined,
    },
  });

  useEffect(() => {
    fetchMissions();
    fetchFormData();
    fetchUsers();
  }, [fetchMissions, fetchFormData, fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Populate form when editing a mission
    if (editingMission) {
      form.reset({
        title: editingMission.title,
        description: editingMission.description || "",
        user_id: editingMission.user_id,
        street_id: editingMission.street_id,
        intervention_type_id: editingMission.intervention_type_id,
      });
    }
  }, [editingMission, form]);

  // Formatter la date pour l'affichage
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: fr });
    } catch (e) {
      console.error(e);
      return 'Date invalide';
    }
  };

  // Réinitialiser le formulaire et ouvrir la modale pour ajouter une nouvelle mission
  const handleAddClick = () => {
    setEditingMission(null);
    form.reset({
      title: "",
      description: "",
      user_id: undefined,
      street_id: undefined,
      intervention_type_id: undefined,
    });
    setIsFormDialogOpen(true);
  };

  // Gérer le clic sur Edit
  const handleEditClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setEditingMission(mission);
    setIsFormDialogOpen(true);
  };

  // Gérer le clic pour assigner un agent
  const handleAssignClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedMission(mission);
    setIsAssignDialogOpen(true);
  };

  // Gérer le clic pour supprimer
  const handleDeleteClick = (mission: Mission, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setMissionToDelete(mission);
    setIsAlertDialogOpen(true);
  };

  // Gérer la soumission du formulaire (création ou mise à jour)
  const onSubmit = async (values: MissionFormValues) => {
    try {
      if (editingMission) {
        // Mise à jour de la mission existante
        await updateMission({ ...values, id: editingMission.id });
        toast.success("Mission mise à jour", {
          description: "La mission a été mise à jour avec succès.",
        });
      } else {
        // Création d'une nouvelle mission
        await createMission(values as Mission);
        toast.success("Mission créée", {
          description: "La mission a été créée avec succès.",
        });
      }
      setIsFormDialogOpen(false);
      fetchMissions(); // Refresh missions after create/update
    } catch (err) {
      console.error("Opération échouée :", err);
      toast.error("Opération échouée", {
        description: "Une erreur est survenue lors de l'opération.",
      });
    }
  };

  // Gérer l'assignation d'un agent
  const handleAssignAgent = async (userId: number) => {
    if (!selectedMission?.id) return;
    try {
      await assignAgent(selectedMission.id, userId);
      toast.success("Agent assigné", {
        description: "L'agent a été assigné à la mission avec succès.",
      });
      setIsAssignDialogOpen(false);
      fetchMissions(); // Refresh missions after assignment
    } catch (err) {
      console.error("Assignation échouée :", err);
      toast.error("Assignation échouée", {
        description: "Une erreur est survenue lors de l'assignation de l'agent.",
      });
    }
  };

  // Gérer la fermeture de la boîte de dialogue
  const handleFormDialogClose = () => {
    setIsFormDialogOpen(false);
  };

  // Gérer la confirmation de suppression
  const handleDeleteConfirm = async () => {
    if (missionToDelete?.id) {
      try {
        await deleteMission(missionToDelete.id);
        toast.success("Mission supprimée", {
          description: "La mission a été supprimée avec succès.",
        });
        setIsAlertDialogOpen(false);
        fetchMissions(); // Refresh missions after delete
      } catch (err) {
        console.error("Suppression échouée :", err);
        toast.error("Suppression échouée", {
          description: "Une erreur est survenue lors de la suppression.",
        });
      }
    }
  };

  const handleDetailsClick = (mission: Mission) => {
    navigate(`/missions/${mission.id}`);
  };

  // Obtenir le libellé du type d'intervention
  const getInterventionTypeName = (id: number) => {
    const interventionType = formData?.interventions?.find(type => type.id === id);
    return interventionType?.name || 'Type inconnu';
  };

  // Obtenir le nom de la rue
  const getStreetName = (id: number) => {
    const street = formData?.streets?.find(s => s.id === id);
    return street?.name || 'Rue inconnue';
  };

  // Obtenir le nom de l'utilisateur
  const getUserName = (id: number) => {
    const user = users?.find(u => u.id === id);
    return user?.name || 'Utilisateur inconnu';
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
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
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
        <Table>
          <TableCaption>Liste des missions</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Titre</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type d'intervention</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rue</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Responsable</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agents</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Créée le</TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {missions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucune mission trouvée. Cliquez sur "Ajouter une mission" pour commencer.
                </TableCell>
              </TableRow>
            ) : (
              missions.map((mission) => (
                <TableRow 
                  key={mission.id} 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => handleDetailsClick(mission)}
                >
                  <TableCell className="font-medium">{mission.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getInterventionTypeName(mission.intervention_type_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStreetName(mission.street_id)}</TableCell>
                  <TableCell>{getUserName(mission.user_id)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {mission.agents && mission.agents.length > 0 ? (
                        mission.agents.map((agent) => (
                          <Badge key={agent.id} variant="secondary" className="w-fit">
                            {agent.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">Aucun agent assigné</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{formatDate(mission.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e: React.MouseEvent) => handleEditClick(mission, e)}>
                          <Pencil1Icon className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e: React.MouseEvent) => handleAssignClick(mission, e)}>
                          <PersonIcon className="mr-2 h-4 w-4" />
                          Assigner un agent
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600" 
                          onClick={(e: React.MouseEvent) => handleDeleteClick(mission, e)}
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
              Cette action ne peut pas être annulée. Cela supprimera définitivement 
              la mission "{missionToDelete?.title}" et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MissionManagement;