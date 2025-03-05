import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutsideClick } from '../../../../hooks/useOutsideClick';
import { useAuth } from '../../../../contexts/AuthContext';

const ProfileMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useOutsideClick(() => setIsOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-600">
            {user?.name?.charAt(0)}
          </span>
        </div>
        <span className="text-gray-700">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
          <a
            href="#profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Profil
          </a>
          <a
            href="#settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Paramètres
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu; 