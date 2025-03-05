import { FC, ReactNode } from 'react';
import Navbar from '../Navbar';
import Header from '../Header';
import Footer from '../Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout; 