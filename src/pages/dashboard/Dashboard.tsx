import { FC } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UsersIcon, 
  CurrencyEuroIcon, 
  ChartBarIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

const StatCard: FC<{ 
  title: string; 
  value: string | number; 
  description: string;
  icon: React.ElementType;
  trend: 'up' | 'down';
  percentage: number;
}> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  percentage,
}) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="p-3 rounded-lg bg-blue-50">
          <Icon className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </div>
      <div className={`px-2.5 py-1.5 rounded-full text-sm ${
        trend === 'up' 
          ? 'bg-green-50 text-green-600' 
          : 'bg-red-50 text-red-600'
      }`}>
        {trend === 'up' ? '↑' : '↓'} {percentage}%
      </div>
    </div>
    <p className="text-gray-600 text-sm mt-4">{description}</p>
  </div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, {currentUser?.name}. Voici vos statistiques d'aujourd'hui.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          Télécharger le rapport
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs actifs"
          value="1,234"
          description="12% de plus ce mois"
          icon={UsersIcon}
          trend="up"
          percentage={12}
        />
        <StatCard
          title="Revenus"
          value="23,456 €"
          description="8% de plus que le mois dernier"
          icon={CurrencyEuroIcon}
          trend="up"
          percentage={8}
        />
        <StatCard
          title="Taux de conversion"
          value="2.4%"
          description="0.4% de plus cette semaine"
          icon={ChartBarIcon}
          trend="up"
          percentage={0.4}
        />
        <StatCard
          title="Temps moyen"
          value="12m 30s"
          description="2 minutes de moins qu'hier"
          icon={ClockIcon}
          trend="down"
          percentage={15}
        />
      </div>

      {/* ... Reste du dashboard ... */}
    </div>
  );
};

export default Dashboard; 