import { FC, ReactNode } from 'react';
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Navbar />
        <main className="flex-1 p-4 bg-gray-100">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 