import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { styles } from '../../../constants/styles';

const navItems = [
  { path: '/dashboard', label: 'Dashboardd', icon: HomeIcon },
  { path: '/analytics', label: 'Analytiques', icon: ChartBarIcon },
  { path: '/users', label: 'Utilisateurs', icon: UsersIcon },
  { path: '/reports', label: 'Rapports', icon: DocumentTextIcon },
  { path: '/settings', label: 'Paramètres', icon: CogIcon },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200/50 hover:shadow-blue-200/80 transition-all duration-300 hover:-translate-y-0.5">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </span>
        </div>
      </div>

      <div className="px-3 py-4">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`${styles.nav.item} ${isActive ? styles.nav.active : styles.nav.inactive
                }`}
            >
              <Icon className={`h-5 w-5 transition-colors duration-200 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
              <span className="font-medium">{label}</span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200/50 animate-pulse" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar; 