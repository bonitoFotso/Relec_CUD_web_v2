// pages/UserManagement.tsx
import React, { useState, useEffect } from "react";
import { useUsers } from "@/contexts/UserContext";
import { User } from "@/services/UsersService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  PlusIcon,
  Pencil1Icon,
  TrashIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

// Importer nos composants
import UserFormDialog from "@/components/UserFormDialog";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboard } from "@/contexts/DashboardContext";

// Schéma de validation pour le formulaire
const userFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide." }),
  sex: z.enum(["M", "F"], { required_error: "Veuillez sélectionner un sexe." }),
  role: z.string().min(2, { message: "Veuillez sélectionner un rôle." }),
  password: z.string().optional(),
});
export type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    users,
    loading,
    error,
    fetchUsers,
    fetchAssignRoles,
    createUser,
    updateUser,
    deleteUser,
  } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  // Boîte de dialogue pour les utilisateurs non-agents
  const [isNotAgentDialogOpen, setIsNotAgentDialogOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      sex: undefined,
      role: undefined,
      password: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchAssignRoles();
  }, [fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Ouverture du formulaire pour créer un nouvel utilisateur
  const handleAddClick = () => {
    setEditingUser(null);
    form.reset({
      name: "",
      email: "",
      phone: "",
      sex: undefined,
      role: undefined,
      password: "",
    });
    setIsDialogOpen(true);
  };

  // Préparation du formulaire pour l'édition
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      sex: user.sex as "M" | "F",
      role: user.role,
    });
    setIsDialogOpen(true);
  };

  // Gérer la soumission du formulaire
  const onSubmit = async (values: UserFormValues) => {
    try {
      if (editingUser) {
        await updateUser({ ...values, id: editingUser.id, status: "active" });
        toast.success("Utilisateur mis à jour");
      } else {
        await createUser(values as User);
        toast.success("Utilisateur créé");
      }
      await fetchUsers();

      setIsDialogOpen(false);
    } catch (err) {
      console.error("Opération échouée :", err);
      toast.error("Opération échouée");
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Confirmation de suppression
  const handleDeleteConfirm = async () => {
    if (userToDelete?.id) {
      try {
        await deleteUser(userToDelete.id);
        toast.success("Utilisateur supprimé");

        setIsAlertDialogOpen(false);
      } catch (err) {
        console.error("Suppression échouée :", err);
        toast.error("Suppression échouée");
      }
    }
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsAlertDialogOpen(true);
  };

  // Gestion de la visualisation des détails d'un utilisateur
  const handleViewDetails = (user: User) => {
    if (user.role !== "agent") {
      setIsNotAgentDialogOpen(true);
    } else {
      navigate(`/users/${user.id}`);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex  flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
        <Button onClick={handleAddClick}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white dark:bg-gray-950 p-4 rounded-xl">
        <Table>
          <TableCaption>Liste des utilisateurs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Sexe</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((user) => user)
              .map((user) => (
                <TableRow key={user!.id}>
                  <TableCell className="font-medium">{user!.name}</TableCell>
                  <TableCell>{user!.email}</TableCell>
                  <TableCell>{user!.phone}</TableCell>
                  <TableCell>
                    {user!.sex === "M" ? "Masculin" : "Féminin"}
                  </TableCell>
                  <TableCell>{user!.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(user!)}
                        >
                          <EyeOpenIcon className="h-4 w-4" />
                        </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(user!)}
                      >
                        <Pencil1Icon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(user!)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Formulaire de création/édition */}
      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        onCancel={handleDialogClose}
        editingUser={editingUser}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera
              définitivement l'utilisateur {userToDelete?.name} et toutes ses
              données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog pour les utilisateurs non-agents */}
      <AlertDialog
        open={isNotAgentDialogOpen}
        onOpenChange={setIsNotAgentDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accès refusé</AlertDialogTitle>
            <AlertDialogDescription>
              Cet utilisateur n'est pas un agent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsNotAgentDialogOpen(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserManagement;
