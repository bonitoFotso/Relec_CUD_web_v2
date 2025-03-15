// pages/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { useUsers } from '@/contexts/UserContext';
import { User } from '@/services/UsersService';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

// Importer nos composants
import UserFormDialog from '@/components/UserFormDialog';
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
import { toast } from 'sonner';

// Définition du schéma de validation pour le formulaire
const userFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Adresse email invalide." }),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide." }),
  sex: z.enum(["M", "F"], { 
    required_error: "Veuillez sélectionner un sexe."
  }),
  role: z.enum(["admin", "agent", "admin-kes"], { 
    required_error: "Veuillez sélectionner un rôle."
  }),
  password: z.string().optional(),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

const UserManagement: React.FC = () => {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Réinitialiser le formulaire et ouvrir la modale pour ajouter un nouvel utilisateur
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

  // Préparer le formulaire pour l'édition et ouvrir la modale
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    form.reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      sex: user.sex as "M" | "F",
      role: user.role as "admin" | "agent" | "admin-kes",
      // Ne pas définir le mot de passe pour l'édition
    });
    setIsDialogOpen(true);
  };

  // Gérer la soumission du formulaire (création ou mise à jour)
  const onSubmit = async (values: UserFormValues) => {
    try {
      if (editingUser) {
        // Mise à jour de l'utilisateur existant
        await updateUser({
          ...values, id: editingUser.id,
          status: 'active'
        });
        toast.success("Utilisateur mis à jour"  );
      } else {
        // Création d'un nouvel utilisateur
        await createUser(values as User);
        toast.success("Utilisateur créé");
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Opération échouée :", err);
        toast.error("Opération échouée");
    }
  };

  // Gérer la fermeture de la boîte de dialogue
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Gérer la confirmation de suppression
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

  // Préparation pour la suppression
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsAlertDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner className="h-10 w-10" />
        </div>
      ) : (
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.sex === 'M' ? 'Masculin' : 'Féminin'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(user)}>
                      <Pencil1Icon className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(user)}>
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Utilisation du composant UserFormDialog */}
      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        onSubmit={onSubmit}
        onCancel={handleDialogClose}
        editingUser={editingUser}
      />

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement
              l'utilisateur {userToDelete?.name} et toutes ses données associées.
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
    </div>
  );
};

export default UserManagement;