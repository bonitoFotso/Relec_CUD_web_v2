import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Correction du problème d'icônes dans React-Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

export const parseLocation = (location: string) => {
  const [lat, lng] = location.split(",").map(Number.parseFloat);
  return { lat, lng };
};

// Définir les icônes par défaut
export const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Définir les icônes spécifiques
export const equipmentIcons: Record<string, L.Icon> = {
  Lampadaires: L.icon({
    iconUrl: "/clipart-blue-circle-f058.svg",
    iconSize: [15, 15],
  }),
  Compteurs: L.icon({
    iconUrl: "/compteur-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Amoires: L.icon({
    iconUrl: "/istockphoto-1708045772-612x612-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
  Substations: L.icon({
    iconUrl: "/8012518-removebg-preview.png",
    iconSize: [50, 50],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    shadowUrl:
      "https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  }),
};

// Fonction pour calculer la distance
export function calculateTotalDistance(positions: [number, number][]): number {
  let total = 0;
  for (let i = 0; i < positions.length - 1; i++) {
    const [lat1, lon1] = positions[i];
    const [lat2, lon2] = positions[i + 1];
    const R = 6371; // rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    total += R * c;
  }
  return parseFloat(total.toFixed(2)); // arrondi à 2 décimales
}
