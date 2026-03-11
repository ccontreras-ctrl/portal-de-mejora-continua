
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Role } from '../../types';

const NavLink: React.FC<{ icon: React.ReactElement; label: string; page: string; }> = ({ icon, label, page }) => {
    const { page: currentPage, setPage, selectTicket } = useAuth();
    const isActive = currentPage === page;

    const handleClick = () => {
        selectTicket(null);
        setPage(page);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${isActive ? 'bg-white/20 text-white font-semibold' : 'text-gray-200 hover:bg-white/10 hover:text-white'
                }`}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </button>
    );
}

const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H3V7h2a4 4 0 004-4V3h6v2a4 4 0 004 4h2v4h-2a4 4 0 00-4 4v2H9z" /></svg>;
const CreateIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ReportsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const Sidebar: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;

    const canCreate = [Role.Solicitante, Role.JefeDirecto, Role.Administrador].includes(user.role);
    const canSeeReports = [Role.JefeDirecto, Role.MejoraContinua, Role.Administrador].includes(user.role);
    const isAdmin = user.role === Role.Administrador;

    return (
        <aside className="w-64 glass-sidebar text-white flex flex-col z-20">
            <div className="p-6 border-b border-white/10 mb-4 bg-white/5">
                <div className="w-12 h-12 bg-brand-cyan rounded-xl flex items-center justify-center mb-3 shadow-lg shadow-brand-cyan/20">
                    <span className="text-xl font-bold">{user.name.charAt(0)}</span>
                </div>
                <h2 className="text-lg font-bold text-white truncate">{user.name}</h2>
                <div className="flex items-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider text-blue-200 font-semibold">{user.role}</span>
                </div>
            </div>
            <nav className="flex-1 px-4 flex flex-col space-y-1">
                <NavLink icon={<DashboardIcon />} label="Dashboard" page="dashboard" />
                {canCreate && <NavLink icon={<CreateIcon />} label="Crear Ticket" page="create-ticket" />}
                {canSeeReports && <NavLink icon={<ReportsIcon />} label="Reportes" page="reports" />}
                {isAdmin && <NavLink icon={<AdminIcon />} label="Administración" page="admin" />}
            </nav>
            <div className="p-6 mt-auto border-t border-white/10 bg-white/5">
                <p className="text-[10px] text-blue-300 font-medium tracking-tight">Portal Mejora Continua</p>
                <p className="text-[10px] text-blue-400/60 mt-0.5">Suzuval v1.5</p>
            </div>
        </aside>
    );
};

export default Sidebar;