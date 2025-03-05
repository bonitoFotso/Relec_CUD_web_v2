import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="text-xl text-gray-600 mt-4">Page non trouvée</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 