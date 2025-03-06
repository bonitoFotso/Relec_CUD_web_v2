// UserManagement.tsx
import React, { useState, useEffect } from 'react';
import { useUsers } from '@/contexts/UserContext';
import { User } from '@/services/UsersService';

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlusIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'sonner';

// Définition du schéma de validation Zod pour le formulaire
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

const UserManagement: React.FC = () => {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof userFormSchema>>({
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
      toast("Erreur",{
        description: error,
      });
    }
  }, [error]);

  // Réinitialiser le formulaire et ouvrir la modal pour ajouter un nouvel utilisateur
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

  // Préparer le formulaire pour l'édition et ouvrir la modal
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
  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    try {
      if (editingUser) {
        // Mise à jour de l'utilisateur existant
        await updateUser({ ...values, id: editingUser.id });
        toast("Utilisateur mis à jour",{
          description: "L'utilisateur a été mis à jour avec succès.",
        });
      } else {
        // Création d'un nouvel utilisateur
        await createUser(values as User);
        toast("Utilisateur créé",{
          description: "L'utilisateur a été créé avec succès.",
        });
      }
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Opération échouée :", err);
      toast("Opération échouée",{
        description: "Une erreur est survenue lors de l'opération.",
      });
    }
  };

  // Gérer la confirmation de suppression
  const handleDeleteConfirm = async () => {
    if (userToDelete?.id) {
      try {
        await deleteUser(userToDelete.id);
        toast("Utilisateur supprimé",{
          description: "L'utilisateur a été supprimé avec succès.",
        });
        setIsAlertDialogOpen(false);
      } catch (err) {
        console.error("Suppression échouée :", err);
        toast("Suppression échouée",{
          description: "Une erreur est survenue lors de la suppression.",
        });
      }
    }
  };

  // Préparation pour la suppression
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsAlertDialogOpen(true);
  };

  // Fermeture de la boîte de dialogue
  const handleDialogClose = () => {
    setIsDialogOpen(false);
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

      {/* Modal de création/édition d'utilisateur */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'utilisateur ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom complet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sexe</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner le sexe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="M">Masculin</SelectItem>
                        <SelectItem value="F">Féminin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rôle</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrateur</SelectItem>
                        <SelectItem value="agent">Agent</SelectItem>
                        <SelectItem value="admin-kes">Admin KES</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!editingUser && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Mot de passe" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleDialogClose}
                >
                  Annuler
                </Button>
                <Button type="submit">
                  {editingUser ? "Mettre à jour" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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