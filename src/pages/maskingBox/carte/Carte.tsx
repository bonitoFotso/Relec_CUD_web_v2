/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
export default function Carte({
  MapUpdater,
  filteredEquipments,
  equipmentIcons,
  lampadairePositions,
  parseLocation,
  renderPopup,
  DefaultIcon,
}: {
  renderPopup: any;
  MapUpdater: any;
  filteredEquipments: any;
  equipmentIcons: any;
  lampadairePositions: any;
  parseLocation: any;
  DefaultIcon: any;
}) {
  return (
    <div>
      <MapContainer
        center={[4.0911652, 9.7358404]}
        zoom={80}
        style={{ height: "100%", width: "100%" }}
        className="leaflet-container rounded-lg z-10"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapUpdater />
        {Object.entries(filteredEquipments).map(([category, equipments]) =>
          (equipments as any[]).map((eq: any) => {
            const { lat, lng } = parseLocation(eq.location);
            return (
              <Marker
                key={`${category}-${eq.id}`}
                position={[lat, lng]}
                icon={equipmentIcons[category] || DefaultIcon}
              >
                <Popup>{renderPopup(category, eq)}</Popup>
              </Marker>
            );
          })
        )}

        {lampadairePositions.length > 1 && (
          <>
            <Polyline
              positions={lampadairePositions}
              pathOptions={{ color: "blue", weight: 3 }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
