
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Header: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center transition-all duration-300">
      <div className="flex flex-col">
        <h1 className="text-xl font-extrabold tracking-tight text-primary-dark">
          SUZUVAL <span className="text-brand-cyan font-medium">| Mejora Continua</span>
        </h1>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" />
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Panel de Control Premium</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {/* Notifications or other buttons could go here */}
        <button
          onClick={logout}
          className="group flex items-center px-4 py-2 text-slate-600 hover:text-red-600 font-semibold text-sm rounded-xl hover:bg-red-50 transition-all duration-300 border border-transparent hover:border-red-100"
        >
          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform duration-300">
            <LogoutIcon />
          </span>
          Salir
        </button>
      </div>
    </header>
  );
};

export default Header;