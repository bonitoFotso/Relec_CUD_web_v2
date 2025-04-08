import { useState } from "react";
import { Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";

type Props = {
  eq: any;
  icon: L.Icon;
  renderPopup: (category: string, eq: any) => React.ReactNode;
  category: string;
};

export default function DraggableLampadaire({
  eq,
  icon,
  renderPopup,
  category,
}: Props) {
  const parseLocation = (location: string) => {
    const [lat, lng] = location.split(",").map(parseFloat);
    return { lat, lng };
  };
  const { lat, lng } = parseLocation(eq.location);
  const [position, setPosition] = useState<[number, number]>([lat, lng]);

  const handleDrag = (e: L.LeafletEvent) => {
    const marker = e.target;
    const newPos = marker.getLatLng();
    setPosition([newPos.lat, newPos.lng]);
  };

  const handleDragEnd = (e: L.LeafletEvent) => {
    const marker = e.target;
    const newPos = marker.getLatLng();
    console.log(`Nouveau point pour ${eq.id} : `, newPos);
    // Tu peux mettre à jour ici un state global
  };

  // Exemple de point de départ de la ligne (à adapter si nécessaire)
  const lineStart: [number, number] = [lat + 0.001, lng + 0.001];

  return (
    <>
      <Marker
        position={position}
        icon={icon}
        draggable={true}
        eventHandlers={{
          drag: handleDrag,
          dragend: handleDragEnd,
        }}
      >
        <Popup>{renderPopup(category, eq)}</Popup>
      </Marker>
      <Polyline
        positions={[lineStart, position]}
        pathOptions={{ color: "green", weight: 3 }}
      />
    </>
  );
}
