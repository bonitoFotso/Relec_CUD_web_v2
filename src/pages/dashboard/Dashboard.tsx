import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FileText, Users, Calendar, Tag, Clock, CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { User, UserService } from '@/services/UsersService';
import { Mission, MissionsService } from '@/services/missions.service';
import { Sticker, StickersService } from '@/services/stickers.service';


interface DashboardStats {
  missionsCount: number;
  agentsCount: number;
  stickersCount: number;
  completedMissionsCount: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

interface PieChartData {
  name: string;
  value: number;
}

interface BarChartData {
  name: string;
  stickers: number;
}

interface MissionsTableProps {
  missions: Mission[];
}

interface AgentsListProps {
  agents: User[];
}



// Composant de carte statistique
const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

// Composant de tableau pour les missions
const MissionsTable: React.FC<MissionsTableProps> = ({ missions }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Missions récentes</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {missions.length > 0 ? (
              missions.map((mission) => (
                <tr key={mission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{mission.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mission.intervention_type_id || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{mission.street_name || "N/A"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {mission.status || "En cours"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href={`/missions/${mission.id}`} className="text-blue-600 hover:text-blue-900">Détails</a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucune mission trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-gray-200">
        <a href="/missions" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          Voir toutes les missions <ChevronRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

// Composant pour afficher les agents
const AgentsList: React.FC<AgentsListProps> = ({ agents }) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Agents actifs</h2>
      </div>
      <ul className="divide-y divide-gray-200">
        {agents.length > 0 ? (
          agents.slice(0, 5).map((agent) => (
            <li key={agent.id} className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">{agent.name?.charAt(0).toUpperCase() || "U"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{agent.name}</p>
                  <p className="text-sm text-gray-500 truncate">{agent.email}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {agent.status === 'active' ? 'Actif' : 'Inactif'}
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <li className="px-4 py-3 text-center text-sm text-gray-500">Aucun agent trouvé</li>
        )}
      </ul>
      <div className="px-4 py-3 border-t border-gray-200">
        <a href="/users" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          Voir tous les agents <ChevronRight className="ml-1 w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<DashboardStats>({
    missionsCount: 0,
    agentsCount: 0,
    stickersCount: 0,
    completedMissionsCount: 0
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [agents, setAgents] = useState<User[]>([]);

  // Graphique de répartition des missions par type
  const missionTypeData: PieChartData[] = [
    { name: 'Déploiement', value: 12 },
    { name: 'Maintenance', value: 8 },
    { name: 'Urgence', value: 3 },
    { name: 'Inspection', value: 7 }
  ];
  
  const COLORS: string[] = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Graphique des stickers utilisés par mois
  const stickerMonthlyData: BarChartData[] = [
    { name: 'Jan', stickers: 65 },
    { name: 'Fév', stickers: 59 },
    { name: 'Mar', stickers: 80 },
    { name: 'Avr', stickers: 81 },
    { name: 'Mai', stickers: 56 },
    { name: 'Juin', stickers: 55 },
    { name: 'Juil', stickers: 40 }
  ];

  useEffect(() => {
    const fetchDashboardData = async (): Promise<void> => {
      try {
        setLoading(true);
        // Récupérer les missions
        const missionsData: Mission[] = await MissionsService.getAll();
        setMissions(missionsData);
        
        // Récupérer les utilisateurs (agents)
        const usersData: User[] = await UserService.getAll();
        const agentsData = usersData.filter(user => user.role === 'agent');
        setAgents(agentsData.map(agent => ({
          ...agent,
          status: Math.random() > 0.3 ? 'active' : 'inactive' // Simulation de statut
        })));
        
        // Récupérer les statistiques de stickers
        const stickersData: Sticker[] = await StickersService.getAll();
        
        // Mettre à jour les statistiques
        setStats({
          missionsCount: missionsData.length,
          agentsCount: agentsData.length,
          stickersCount: stickersData.reduce((acc, sticker) => acc + (sticker.count || 0), 0),
          completedMissionsCount: Math.floor(missionsData.length * 0.7) // Simulation
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données du dashboard', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Fonction pour générer le rapport PDF
  const handleDownloadReport = (): void => {
    alert('Téléchargement du rapport...');
    // Ici vous pourriez implémenter la génération de PDF
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">
            Bienvenue, {currentUser?.name}. Voici vos statistiques d'aujourd'hui.
          </p>
        </div>
        <button 
          onClick={handleDownloadReport}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
        >
          <FileText className="w-4 h-4 mr-2" />
          Télécharger le rapport
        </button>
      </div>
      
      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Missions totales" 
          value={stats.missionsCount} 
          icon={Calendar} 
          color="bg-blue-500"
        />
        <StatCard 
          title="Agents actifs" 
          value={stats.agentsCount} 
          icon={Users} 
          color="bg-green-500"
        />
        <StatCard 
          title="Stickers utilisés" 
          value={stats.stickersCount} 
          icon={Tag} 
          color="bg-purple-500"
        />
        <StatCard 
          title="Missions terminées" 
          value={stats.completedMissionsCount} 
          icon={CheckCircle} 
          color="bg-amber-500"
        />
      </div>
      
      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Répartition des missions par type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={missionTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string, percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {missionTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Utilisation des stickers par mois</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stickerMonthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="stickers" fill="#8884d8" name="Stickers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Tableau des missions récentes et liste des agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MissionsTable missions={missions} />
        </div>
        <div>
          <AgentsList agents={agents} />
        </div>
      </div>
      
      {/* Section des alertes */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
          <h2 className="text-lg font-semibold text-gray-800">Alertes récentes</h2>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Stock de stickers pour équipements de type 2 faible (5 restants)</p>
              </div>
            </div>
          </div>
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">3 missions en attente d'affectation depuis plus de 48h</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;