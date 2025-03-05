import { FC } from 'react';
import { useAuth } from '../contexts/AuthContext';

const StatCard: FC<{ title: string; value: string | number; description: string }> = ({
  title,
  value,
  description,
}) => (
  <div className="bg-white rounded-lg p-6 shadow-md">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
    <p className="text-gray-600 text-sm mt-2">{description}</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs actifs"
          value="1,234"
          description="12% de plus ce mois"
        />
        <StatCard
          title="Revenus"
          value="23,456 €"
          description="8% de plus que le mois dernier"
        />
        <StatCard
          title="Taux de conversion"
          value="2.4%"
          description="0.4% de plus cette semaine"
        />
        <StatCard
          title="Temps moyen"
          value="12m 30s"
          description="2 minutes de moins qu'hier"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Activités récentes</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-4 border-b pb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600">#{item}</span>
                </div>
                <div>
                  <p className="font-medium">Action {item}</p>
                  <p className="text-sm text-gray-500">Il y a {item * 2} heures</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tâches en cours</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded" />
                  <span>Tâche importante #{item}</span>
                </div>
                <span className="text-sm text-gray-500">Échéance: {item} jours</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 