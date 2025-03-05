import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_NOTIFICATIONS } from './constants/notifications';
import { Notification } from './types/header.types';
import { 
  BellIcon, 
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { styles } from '../../../constants/styles';
import { useOutsideClick } from '../../../hooks/useOutsideClick';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(DEFAULT_NOTIFICATIONS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useOutsideClick(() => setShowNotifications(false));
  const userMenuRef = useOutsideClick(() => setShowUserMenu(false));
  const searchRef = useOutsideClick(() => setIsSearchOpen(false));

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    setIsDark(!isDark);
    // Implémenter la logique du thème sombre
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Recherche */}
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`${styles.button.secondary} ${isSearchOpen ? 'hidden' : 'flex'} items-center`}
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-400">Rechercher...</span>
            </button>

            
            
            {isSearchOpen && (
              <div className="absolute top-0 left-0 w-96 animate-fade-in">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Rechercher..."
                    className={`${styles.input.base} ${styles.input.withIcon}`}
                  />
                </div>
                <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4">
                  <div className="text-sm text-gray-500">Résultats récents</div>
                  {/* Ajouter les résultats de recherche ici */}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Thème */}
            <button
              onClick={toggleTheme}
              className={`${styles.button.icon} relative group`}
            >
              {isDark ? (
                <MoonIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <SunIcon className="h-5 w-5 text-gray-500" />
              )}
              <span className="absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {isDark ? 'Mode clair' : 'Mode sombre'}
              </span>
            </button>

            {/* Notifications */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`${styles.button.icon} relative`}
              >
                <BellIcon className="h-5 w-5 text-gray-500" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <div className="font-semibold">Notifications</div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 hover:bg-gray-50 ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`${styles.badge.base} ${styles.badge[notification.type]}`}>
                            {notification.type}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-gray-500">{notification.message}</div>
                            <div className="text-xs text-gray-400 mt-1">{notification.time}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profil */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:shadow-md transition-all duration-200">
                  <span className="text-blue-600 font-medium">
                    {user?.name?.charAt(0)}
                  </span>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                  <div className="p-4 border-b border-gray-100">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <div className="p-2">
                    <button className={`${styles.button.secondary} w-full justify-start mb-2`}>
                      <UserCircleIcon className="h-5 w-5 mr-2" />
                      Profil
                    </button>
                    <button className={`${styles.button.secondary} w-full justify-start mb-2`}>
                      <Cog6ToothIcon className="h-5 w-5 mr-2" />
                      Paramètres
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`${styles.button.danger} w-full justify-start text-red-600`}
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 