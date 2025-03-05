import { useState } from 'react';

const NotificationMenu = () => {
  const [notifications] = useState([
    { id: 1, message: 'Nouvelle mise à jour disponible', time: '2h' },
    { id: 2, message: 'Nouveau message', time: '4h' },
    { id: 3, message: 'Rappel de réunion', time: '1j' },
    { id: 4, message: 'Nouvelle mise à jour disponible', time: '2h' },
    { id: 5, message: 'Nouveau message', time: '4h' },
    { id: 6, message: 'Rappel de réunion', time: '1j' },
  ]);

  return (
    <div className="relative">
      <button className="p-2 text-gray-600 hover:text-gray-800">
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {notifications.length}
        </span>
        <svg
          className="h-6 w-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </button>
    </div>
  );
};

export default NotificationMenu; 