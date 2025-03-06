import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Home, 
  Users, 
  Settings, 
  FileText,
  BarChart
} from 'lucide-react';

interface NavbarProps {
  onNavItemClick?: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: string[];
}

const Navbar: FC<NavbarProps> = ({ onNavItemClick }) => {
  const { hasRole } = useAuth();
  
  const navItems: NavItem[] = [
    {
      path: '/dashboard',
      label: 'Tableau de bord',
      icon: <Home className="h-5 w-5" />
    },
    {
      path: '/users',
      label: 'Utilisateurs',
      icon: <Users className="h-5 w-5" />,
      roles: ['super-admin', 'admin']
    },
    {
      path: '/reports',
      label: 'Rapports',
      icon: <FileText className="h-5 w-5" />
    },
    {
      path: '/analytics',
      label: 'Analytiques',
      icon: <BarChart className="h-5 w-5" />
    },
    {
      path: '/settings',
      label: 'Paramètres',
      icon: <Settings className="h-5 w-5" />
    }
  ];

  // Filtrer les éléments de navigation en fonction des rôles
  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.some(role => hasRole(role))
  );

  return (
    <nav className="w-64 bg-white border-r border-slate-200 h-full">
      <div className="py-4">
        <div className="px-4 py-2">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Navigation
          </h2>
        </div>
        
        <ul className="mt-2 space-y-1">
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavItemClick}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;