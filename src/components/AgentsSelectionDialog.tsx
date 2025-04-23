import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Assurez-vous que ce composant existe

export interface User {
    id: number;
    name: string;
    role: string;
    company_id: number;
  }
  
  interface AgentSelectionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    users: User[];
    selectedUserIds: number[];
    onConfirm: (selected: number[]) => void;
  }
  

const AgentsSelectionDialog: React.FC<AgentSelectionDialogProps> = ({
  open,
  onOpenChange,
  users,
  selectedUserIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelection, setLocalSelection] =
    useState<number[]>(selectedUserIds);

  useEffect(() => {
    setLocalSelection(selectedUserIds);
  }, [selectedUserIds]);

  const filteredAgents = useMemo(() => {
    return users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const toggleSelection = (id: number) => {
    setLocalSelection((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner des agents</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Input
            placeholder="Rechercher un agent..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="flex items-center space-x-2">
              <Checkbox
                checked={localSelection.includes(agent.id)}
                onCheckedChange={() => toggleSelection(agent.id)}
              />
              <span>{agent.name}</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onConfirm(localSelection);
              onOpenChange(false);
            }}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentsSelectionDialog;
