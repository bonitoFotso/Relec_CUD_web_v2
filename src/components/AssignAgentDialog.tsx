// components/AssignAgentDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { TrashIcon } from "@radix-ui/react-icons";
import { Mission } from '@/services/missions.service';
import { User, UserService } from '@/services/UsersService';
import { toast } from 'sonner';

interface AssignAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mission: Mission | null;
  onAssign: (userId: number) => Promise<void>;
}

const AssignAgentDialog: React.FC<AssignAgentDialogProps> = ({
  open,
  onOpenChange,
  mission,
  onAssign,
}) => {
  const [agents, setAgents] = useState<Array<{ id: number; name: string }>>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Récupération des agents dès que le dialog s'ouvre
  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        // Récupérer tous les utilisateurs et filtrer ceux ayant le rôle "agent"
        const users = await UserService.getAll();
        const agentUsers = users.filter((user: User) => user.role === 'agent');
        setAgents(agentUsers.map((user: User) => ({ id: user.id!, name: user.name })));
      } catch (error) {
        console.error('Erreur lors de la récupération des agents:', error);
        toast.error("Impossible de charger la liste des agents.");
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchAgents();
    }
  }, [open]);

  // Filtrer les agents disponibles (ceux qui ne sont pas déjà assignés)
  const availableAgents = agents.filter(
    (agent) => !mission?.agents?.some(a => a.id === agent.id)
  );

  // Filtrer avec la barre de recherche
  const filteredAgents = availableAgents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Gestion de la sélection/déselection d'un agent
  const toggleAgentSelection = (agentId: number) => {
    setSelectedAgentIds((prevSelected) => {
      if (prevSelected.includes(agentId)) {
        return prevSelected.filter(id => id !== agentId);
      } else {
        return [...prevSelected, agentId];
      }
    });
  };

  // Boucle pour assigner les agents un par un
  const handleAssign = async () => {
    if (selectedAgentIds.length === 0 || !mission?.id) return;
    setLoading(true);
    try {
      for (const agentId of selectedAgentIds) {
        await onAssign(agentId);
      }
      toast.success("Agents assignés", {
        description: "Les agents ont été assignés à la mission avec succès.",
      });
      setSelectedAgentIds([]);
      setSearchQuery('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'assignation des agents:', error);
      toast.error("Impossible d'assigner les agents à la mission.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assigner des agents à la mission</DialogTitle>
          <DialogDescription>
            Sélectionnez les agents à assigner à la mission : {mission?.title}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner className="h-8 w-8" />
          </div>
        ) : (
          <>
            {/* Liste des agents déjà assignés */}
            {mission?.agents && mission.agents.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Agents déjà assignés</h3>
                <div className="space-y-2">
                  {mission.agents.map(agent => (
                    <div key={agent.id} className="flex items-center justify-between bg-slate-100 p-2 rounded">
                      <span>{agent.name}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast.info("Fonctionnalité à venir", {
                            description: "La suppression d'agents assignés sera disponible prochainement.",
                          });
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barre de recherche */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Rechercher un agent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Liste des agents disponibles dans une div scrollable */}
            <div className="py-4">
              {filteredAgents.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun agent disponible</p>
              ) : (
                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                  {filteredAgents.map(agent => {
                    const isSelected = selectedAgentIds.includes(agent.id);
                    return (
                      <div
                        key={agent.id}
                        className={`flex items-center p-2 rounded cursor-pointer ${isSelected ? 'bg-blue-200' : 'bg-slate-100'}`}
                        onClick={() => toggleAgentSelection(agent.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleAgentSelection(agent.id)}
                          className="mr-2"
                        />
                        <span>{agent.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button 
                type="button" 
                onClick={handleAssign}
                disabled={selectedAgentIds.length === 0}
              >
                Assigner
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignAgentDialog;
