import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserService } from "@/services/UsersService";
import { usePermissions } from "@/contexts/PermissionContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const PermissionsManagement: React.FC = () => {
  const { assignRolesData, loading, error, fetchAssignRoles } =
    usePermissions();

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [assigning, setAssigning] = useState<boolean>(false);

  useEffect(() => {
    if (!assignRolesData) {
      fetchAssignRoles();
    }
  }, [assignRolesData, fetchAssignRoles]);

  useEffect(() => {
    if (assignRolesData && selectedRoleId !== null) {
      const assigned = assignRolesData.role_permissions
        .filter((rp) => rp.role_id === selectedRoleId)
        .map((rp) => rp.permission_id);
      setSelectedPermissions(assigned);
    } else {
      setSelectedPermissions([]);
    }
  }, [selectedRoleId, assignRolesData]);

  const filteredPermissions =
    assignRolesData?.permissions.filter((perm) =>
      perm.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleRoleClick = (roleId: number) => {
    setSelectedRoleId(roleId);
    setModalOpen(true);
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleAssignPermissions = async () => {
    if (selectedRoleId === null) {
      toast.error("Veuillez sélectionner un rôle.");
      return;
    }
    try {
      setAssigning(true);
      await UserService.assignPermissions(selectedRoleId, selectedPermissions);
      toast.success("Permissions assignées avec succès.");
      fetchAssignRoles();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'assignation des permissions.");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Skeleton className="h-[30vh] w-[95%]" />
      </div>
    );
  }
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  if (!assignRolesData) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Info :</AlertTitle>
        <AlertDescription>Aucune donnée trouvée.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-5 space-y-2">
      <h1 className="text-3xl font-bold ">Gestion des Permissions</h1>
      <h4>Rôles et permissions assignées</h4>

      <div className="p-3 mt-5">
        <Table>
          <TableCaption>
            Chaque ligne affiche un rôle et le nombre de permissions assignées
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Rôle</TableHead>
              <TableHead>Permissions assignées</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignRolesData.roles.map((role) => {
              const assignedCount = assignRolesData.role_permissions.filter(
                (rp) => rp.role_id === role.id
              ).length;
              return (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>
                    {assignedCount} / {assignRolesData.permissions.length}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleRoleClick(role.id)}
                    >
                      Assigner permissions
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier les permissions</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto space-y-2">
              {filteredPermissions.map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-center gap-2 p-2 border rounded cursor-pointer"
                  onClick={() => handlePermissionToggle(perm.id)}
                >
                  <Checkbox checked={selectedPermissions.includes(perm.id)} />
                  <span>{perm.name}</span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAssignPermissions} disabled={assigning}>
              {assigning ? (
                <>
                  <Spinner className="h-4 w-4" /> Enregistrement...
                </>
              ) : (
                "Enregistrer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PermissionsManagement;
