import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import des composants Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Correction du problème d'icônes dans React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

// Types pour les équipements
interface EquipmentPosition {
  lat: number;
  lng: number;
}

type EquipmentType = 'informatique' | 'medical' | 'industriel';
type EquipmentStatus = 'fonctionnel' | 'maintenance' | 'dysfonctionnement';

interface Equipment {
  id: number;
  name: string;
  type: EquipmentType;
  position: [number, number]; // [latitude, longitude]
  status: EquipmentStatus;
  lastMaintenance: string;
}

interface NewEquipment {
  name: string;
  type: EquipmentType;
  status: EquipmentStatus;
  lastMaintenance: string;
}

// Définir les icônes par défaut
const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Créer différentes icônes pour les types d'équipements
const equipmentIcons: Record<EquipmentType, L.Icon> = {
  informatique: L.icon({
    iconUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
  }),
  medical: DefaultIcon, // Remplacez avec votre propre icône
  industriel: DefaultIcon // Remplacez avec votre propre icône
};

// Données d'exemple pour les équipements
const initialEquipments: Equipment[] = [
  { id: 1, name: 'Serveur principal', type: 'informatique', position: [48.856614, 2.3522219], status: 'fonctionnel', lastMaintenance: '2023-09-15' },
  { id: 2, name: 'Scanner médical', type: 'medical', position: [48.85, 2.34], status: 'maintenance', lastMaintenance: '2023-10-20' },
  { id: 3, name: 'Machine industrielle', type: 'industriel', position: [48.86, 2.37], status: 'dysfonctionnement', lastMaintenance: '2023-08-05' },
  { id: 4, name: 'Router réseau', type: 'informatique', position: [48.87, 2.33], status: 'fonctionnel', lastMaintenance: '2023-11-01' }
];

// Propriétés pour le composant d'ajout de marqueur
interface AddEquipmentMarkerProps {
  onAddEquipment: (position: EquipmentPosition) => void;
}

// Composant pour ajouter de nouveaux équipements
const AddEquipmentMarker: React.FC<AddEquipmentMarkerProps> = ({ onAddEquipment }) => {
  const [position, setPosition] = useState<EquipmentPosition | null>(null);
  
  // const map = useMapEvents({
  //   click: (e) => {
  //     setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
  //   }
  // });

  useEffect(() => {
    if (position) {
      onAddEquipment(position);
      setPosition(null);
    }
  }, [position, onAddEquipment]);

  return null;
};

// Composant principal
const EquipmentMap: React.FC = () => {
  const [equipments, setEquipments] = useState<Equipment[]>(initialEquipments);
  const [newEquipment, setNewEquipment] = useState<NewEquipment>({
    name: '',
    type: 'informatique',
    status: 'fonctionnel',
    lastMaintenance: new Date().toISOString().split('T')[0]
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [tempPosition, setTempPosition] = useState<[number, number] | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  
  // Filtrer les équipements
  const filteredEquipments = equipments.filter(eq => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || eq.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || eq.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Gérer le clic sur la carte pour ajouter un équipement
  const handleAddEquipmentPosition = (latlng: EquipmentPosition) => {
    if (!isAdding) return;
    setTempPosition([latlng.lat, latlng.lng]);
    setDialogOpen(true);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (name: string, value: string) => {
    setNewEquipment(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  // Soumettre le formulaire pour ajouter un équipement
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPosition || !newEquipment.name) return;
    
    const newId = equipments.length > 0 ? Math.max(...equipments.map(e => e.id)) + 1 : 1;
    
    const equipment: Equipment = {
      id: newId,
      name: newEquipment.name,
      type: newEquipment.type,
      position: tempPosition,
      status: newEquipment.status,
      lastMaintenance: newEquipment.lastMaintenance
    };
    
    setEquipments(prev => [...prev, equipment]);
    setNewEquipment({
      name: '',
      type: 'informatique',
      status: 'fonctionnel',
      lastMaintenance: new Date().toISOString().split('T')[0]
    });
    setTempPosition(null);
    setIsAdding(false);
    setDialogOpen(false);
  };

  // Gérer la suppression d'un équipement
  const handleDeleteEquipment = (id: number) => {
    setEquipments(prev => prev.filter(eq => eq.id !== id));
  };

  // Obtenir l'icône en fonction du type d'équipement
  const getEquipmentIcon = (type: EquipmentType) => {
    return equipmentIcons[type] || DefaultIcon;
  };

  // Obtenir la variant de statut pour le badge
  const getStatusVariant = (status: EquipmentStatus): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'fonctionnel': return "default";
      case 'maintenance': return "secondary";
      case 'dysfonctionnement': return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Carte de localisation des équipements</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto">
          <Input
            placeholder="Rechercher un équipement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="informatique">Informatique</SelectItem>
              <SelectItem value="medical">Médical</SelectItem>
              <SelectItem value="industriel">Industriel</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="fonctionnel">Fonctionnel</SelectItem>
              <SelectItem value="maintenance">En maintenance</SelectItem>
              <SelectItem value="dysfonctionnement">En dysfonctionnement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          onClick={() => setIsAdding(!isAdding)}
          variant={isAdding ? "destructive" : "default"}
        >
          {isAdding ? 'Annuler' : 'Ajouter un équipement'}
        </Button>
      </div>
      
      {isAdding && (
        <Alert>
          <AlertDescription>
            Cliquez sur la carte pour placer le nouvel équipement
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <MapContainer 
              center={[48.856614, 2.3522219]} 
              zoom={13} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              
              {filteredEquipments.map(equipment => (
                <Marker 
                  key={equipment.id} 
                  position={equipment.position}
                  icon={getEquipmentIcon(equipment.type)}
                >
                  <Popup>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg">{equipment.name}</h3>
                      <p>Type: {equipment.type}</p>
                      <p>
                        Statut: <Badge variant={getStatusVariant(equipment.status)}>{equipment.status}</Badge>
                      </p>
                      <p>Dernière maintenance: {equipment.lastMaintenance}</p>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEquipment(equipment.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {tempPosition && (
                <Marker position={tempPosition}>
                  <Popup>Nouvel équipement</Popup>
                </Marker>
              )}
              
              {isAdding && <AddEquipmentMarker onAddEquipment={handleAddEquipmentPosition} />}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel équipement</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom:</Label>
              <Input
                id="name"
                value={newEquipment.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type:</Label>
              <Select 
                value={newEquipment.type} 
                onValueChange={(value) => handleInputChange('type', value as EquipmentType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Type d'équipement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="informatique">Informatique</SelectItem>
                  <SelectItem value="medical">Médical</SelectItem>
                  <SelectItem value="industriel">Industriel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Statut:</Label>
              <Select 
                value={newEquipment.status} 
                onValueChange={(value) => handleInputChange('status', value as EquipmentStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fonctionnel">Fonctionnel</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="dysfonctionnement">En dysfonctionnement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="lastMaintenance">Dernière maintenance:</Label>
              <Input
                id="lastMaintenance"
                type="date"
                value={newEquipment.lastMaintenance}
                onChange={(e) => handleInputChange('lastMaintenance', e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Position:</Label>
              <Input
                value={tempPosition ? `Lat: ${tempPosition[0].toFixed(6)}, Lng: ${tempPosition[1].toFixed(6)}` : ''}
                readOnly
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Ajouter l'équipement</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des équipements ({filteredEquipments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière maintenance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipments.map(equipment => (
                <TableRow key={equipment.id}>
                  <TableCell>{equipment.id}</TableCell>
                  <TableCell>{equipment.name}</TableCell>
                  <TableCell>{equipment.type}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(equipment.status)}>
                      {equipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{equipment.lastMaintenance}</TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEquipment(equipment.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentMap;