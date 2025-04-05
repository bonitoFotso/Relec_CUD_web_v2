import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import React from "react";

// Données des notifications
const notifications = [
  {
    id: 1,
    title: "First notification",
    timeAgo: "10 minutes",
    description:
      '"Remaining Reason" became an instant hit, praised for its haunting sound and emotional depth. A viral performance brought it widespread recognition, making it one of Dio Lupa’s most iconic tracks.',
  },
  {
    id: 2,
    title: "Second notification",
    timeAgo: "10 minutes",
    description:
      '"Bears of a Fever" captivated audiences with its intense energy and mysterious lyrics. Its popularity skyrocketed after fans shared it widely online, earning Ellie critical acclaim.',
  },
  {
    id: 3,
    title: "Third notification",
    timeAgo: "10 minutes",
    description:
      '"Cappuccino" quickly gained attention for its smooth melody and relatable themes. The song’s success propelled Sabrino into the spotlight, solidifying their status as a rising star.',
  },
];

// Composant NotificationItem

interface NotificationItemProps {
  title: string;
  timeAgo: string;
  description: string;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  timeAgo,
  description,
}) => {
  return (
    <li className="flex items-start gap-4 p-4 border rounded-lg m-2 bg-white dark:bg-gray-950 shadow">
      {/* Avatar avec fallback (première lettre du titre) */}
      <div className="h-10 w-10 rounded-full bg-slate-500/15 flex justify-center items-center font-bold text-md md:text-lg">
        <div>{title.charAt(0)}</div>
      </div>

      {/* Contenu de la notification */}
      <div className="flex flex-col gap-1 flex-1">
        <div className="flex gap-4 items-center">
          <div className="font-semibold text-sm">{title}</div>
          <div className="ml-2">
            <div className="h-2 w-2 rounded-full bg-primary"></div>
          </div>
        </div>
        <p className=" text-muted-foreground dark:text-white">{description}</p>
        <p className=" text-muted-foreground mt-1"> Il y'a {timeAgo}</p>
      </div>
    </li>
  );
};

// Composant Notifications
const Notifications = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold">Notifications</h1>
      <ul className="list rounded-box">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} {...notif} />
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
