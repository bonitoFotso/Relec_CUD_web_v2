import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  EllipsisVerticalIcon 
} from '@heroicons/react/24/outline';
import { styles } from '../../constants/styles';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-03-15T10:30:00',
    },
    // ... autres utilisateurs
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Utilisateurs
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez les utilisateurs et leurs permissions
          </p>
        </div>
        <button className={`group ${styles.button.primary}`}>
          <div className="flex items-center">
            <PlusIcon className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:rotate-90" />
            <span>Ajouter un utilisateur</span>
          </div>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors duration-200 group-focus-within:text-blue-500" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className={`${styles.input.base} ${styles.input.withIcon}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className={`group ${styles.button.secondary}`}>
          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 mr-2 text-gray-400 transition-colors duration-200 group-hover:text-gray-600" />
            <span>Filtres</span>
          </div>
        </button>
      </div>

      <div className={styles.container}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dernière connexion
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-colors duration-150 group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                      <span className="text-blue-600 font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${styles.badge.base} ${styles.badge.info}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${styles.badge.base} ${
                    user.status === 'active' ? styles.badge.success : styles.badge.danger
                  }`}>
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className={styles.button.icon}>
                      <PencilSquareIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    <button className={styles.button.danger}>
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                    <button className={styles.button.icon}>
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <button className={styles.button.secondary}>
              Précédent
            </button>
            <button className={styles.button.secondary}>
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users; 