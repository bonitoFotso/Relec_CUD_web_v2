import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const Users = () => {
  const [users] = useState<User[]>([
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean@example.com',
      role: 'Admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Marie Martin',
      email: 'marie@example.com',
      role: 'Utilisateur',
      status: 'active',
    },
    {
      id: 3,
      name: 'Pierre Durant',
      email: 'pierre@example.com',
      role: 'Éditeur',
      status: 'inactive',
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Ajouter un utilisateur
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-gray-500">{user.role}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    Modifier
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users; 