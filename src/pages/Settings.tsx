import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
  });

  const [theme, setTheme] = useState('light');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {/* Profil */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Profil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Notifications par email</span>
              <button
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, email: !prev.email }))
                }
                className={`${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span>Notifications push</span>
              <button
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, push: !prev.push }))
                }
                className={`${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out`}
              >
                <span
                  className={`${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-1`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Thème */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Apparence</h2>
          <div className="space-y-4">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="light">Thème clair</option>
              <option value="dark">Thème sombre</option>
              <option value="system">Système</option>
            </select>
          </div>
        </div>

        {/* Bouton de sauvegarde */}
        <div className="p-6">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            Sauvegarder les modifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 