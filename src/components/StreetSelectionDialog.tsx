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

export interface Street {
  id: number;
  name: string;
}

interface StreetSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  streets: Street[];
  selectedStreetIds: number[];
  onConfirm: (selected: number[]) => void;
}

const StreetSelectionDialog: React.FC<StreetSelectionDialogProps> = ({
  open,
  onOpenChange,
  streets,
  selectedStreetIds,
  onConfirm,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [localSelection, setLocalSelection] =
    useState<number[]>(selectedStreetIds);

  useEffect(() => {
    setLocalSelection(selectedStreetIds);
  }, [selectedStreetIds]);

  const filteredStreets = useMemo(() => {
    return streets.filter((street) =>
      street.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [streets, searchQuery]);

  const toggleSelection = (id: number) => {
    setLocalSelection((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sélectionner des rues</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Input
            placeholder="Rechercher une rue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="max-h-60 overflow-y-auto space-y-2">
          {filteredStreets.map((street) => (
            <div key={street.id} className="flex items-center space-x-2">
              <Checkbox
                checked={localSelection.includes(street.id)}
                onCheckedChange={() => toggleSelection(street.id)}
              />
              <span>{street.name}</span>
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

export default StreetSelectionDialog;
