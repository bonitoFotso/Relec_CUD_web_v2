import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, QrCode, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Sticker } from '@/services/stickers.service';

interface StickerProps {
    sticker: Sticker;
  equipment_type: string;
}

const StickerCard = ({ sticker, equipment_type }: StickerProps) => {
  // Handle download button click
  const handleDownload = () => {
    window.open(sticker.url, '_blank');
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (e) {
      console.error(e);
      return 'Date invalide';
    }
  };

  // Format time for display
  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'HH:mm', { locale: fr });
    } catch (e) {
      console.error(e);
      return 'Heure invalide';
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">Etiquette #{sticker.id}</CardTitle>
          <Badge variant={sticker.used ? "secondary" : "default"} className="ml-2">
            {sticker.used ? "Used" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center p-4 border rounded-md bg-gray-50">
          <QrCode size={100} className="text-gray-700" />
          <span className="sr-only">QR Code for sticker #{sticker.qrcode_id}</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">QR Code ID:</span>
            <span className="font-medium">{sticker.qrcode_id}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Mission ID:</span>
            <span className="font-medium">{sticker.mission_id}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Equipment Type:</span>
            <span className="font-medium">
              {equipment_type}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="flex items-center">
              {sticker.used ? 
                <><X size={16} className="text-red-500 mr-1" /> Used</> : 
                <><Check size={16} className="text-green-500 mr-1" /> Available</>
              }
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500">Created:</span>
            <span className="font-medium">
              {formatDate(sticker.created_at)} {formatTime(sticker.created_at)}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleDownload} 
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
        >
          <Download size={16} />
          Telecharger l'etiquette
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StickerCard;