import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Type des données
interface Anomaly {
  id: number;
  title: string;
  equipmentName: string;
  timeAgo: string;
  description: string;
}

// Données des anomalies
const anomalies: Anomaly[] = [
  {
    id: 1,
    title: "First anomaly",
    equipmentName: "Streetlights",
    timeAgo: "10 minutes",
    description:
      '"Remaining Reason" became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition, making it one of Dio Lupa’s most iconic tracks.',
  },
  {
    id: 2,
    title: "Second anomaly",
    equipmentName: "Cabinets",
    timeAgo: "20 minutes",
    description:
      '"Bears of a Fever" captivated audiences with its intense energy and mysterious lyrics. Its popularity skyrocketed after fans shared it widely online, earning Ellie critical acclaim.',
  },
  {
    id: 3,
    title: "Third anomaly",
    equipmentName: "Substations",
    timeAgo: "30 minutes",
    description:
      '"Cappuccino" quickly gained attention for its smooth melody and relatable themes. The song’s success propelled Sabrino into the spotlight, solidifying their status as a rising star.',
  },
];

// Composant pour une anomalie individuelle
const AnomalyItem: React.FC<Anomaly> = ({
  title,
  equipmentName,
  timeAgo,
  description,
}) => {
  return (
    <li className="flex items-start gap-4 p-4 border rounded-lg m-2 bg-white dark:bg-gray-950 shadow">
      {/* Avatar avec initiale du titre */}
      <div className="h-10 w-10 rounded-full bg-slate-500/15 flex justify-center items-center font-bold text-md md:text-lg">
        <div>{title.charAt(0)}</div>
      </div>

      {/* Contenu de l’anomalie */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="font-semibold text-md">{title}</div>
        <p className="font-bold">
          <strong>Equipment:</strong> {equipmentName}
        </p>
        <p className="text-muted-foreground">{description}</p>
        <p className="text-muted-foreground mt-1">Il y'a {timeAgo}</p>
      </div>
    </li>
  );
};

// Composant principal
const Anomalies = () => {
  return (
    <div className="p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Anomalies</h1>
      <ul>
        {anomalies.map((anomaly) => (
          <AnomalyItem key={anomaly.id} {...anomaly} />
        ))}
      </ul>
    </div>
  );
};

export default Anomalies;
