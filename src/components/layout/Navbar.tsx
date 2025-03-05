import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <div className="space-y-4">
        <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded">
          Dashboard
        </Link>
        <Link to="/users" className="block py-2 px-4 hover:bg-gray-700 rounded">
          Utilisateurs
        </Link>
        <Link to="/settings" className="block py-2 px-4 hover:bg-gray-700 rounded">
          Paramètres
        </Link>
      </div>
    </nav>
  );
};

export default Navbar; 