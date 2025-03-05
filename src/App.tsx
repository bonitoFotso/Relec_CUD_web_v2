import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { routes } from './routes/routes';

const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
