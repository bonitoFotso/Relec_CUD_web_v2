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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [agents, setAgents] = useState<Array<{id: number; name: string}>>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgents = async () => {
      setLoading(true);
      try {
        // Récupérer les agents (utilisateurs avec le rôle "agent")
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

  const handleAssign = async () => {
    if (!selectedAgentId || !mission?.id) return;
    
    try {
      await onAssign(parseInt(selectedAgentId));
      toast.success("Agent assigné", {
        description: "L'agent a été assigné à la mission avec succès.",
      });
      setSelectedAgentId('');
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'assignation de l\'agent:', error);
      toast.error("Impossible d'assigner l'agent à la mission.");
    }
  };

  // Filtrer les agents qui ne sont pas déjà assignés à cette mission
  const availableAgents = agents.filter(
    agent => !mission?.agents?.some(a => a.id === agent.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Assigner un agent à la mission
          </DialogTitle>
          <DialogDescription>
            Sélectionnez un agent à assigner à la mission : {mission?.title}
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
            
            {/* Sélection d'un nouvel agent */}
            <div className="py-4">
              <Select 
                value={selectedAgentId} 
                onValueChange={setSelectedAgentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un agent" />
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.length === 0 ? (
                    <SelectItem value="no-agents" disabled>
                      Aucun agent disponible
                    </SelectItem>
                  ) : (
                    availableAgents.map(agent => (
                      <SelectItem key={agent.id} value={agent.id.toString()}>
                        {agent.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button 
                type="button" 
                onClick={handleAssign}
                disabled={!selectedAgentId || availableAgents.length === 0}
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