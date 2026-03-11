
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-blue-50/50 to-transparent -z-10 pointer-events-none" />

        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-10 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
