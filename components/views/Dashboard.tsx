
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Role, Ticket, TicketStatus } from '../../types';
import KanbanBoard from '../ticket/KanbanBoard';
import TicketCard from '../ticket/TicketCard';
import Button from '../ui/Button';

import AnalyticsDashboard from './AnalyticsDashboard';
import KpiCard from '../ui/KpiCard';
import { LayoutDashboard, Trello, PieChart, Search, Filter } from 'lucide-react';

const IconTotal = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
const IconPending = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconActive = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconClosed = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const Dashboard: React.FC = () => {
  const { user, tickets, updateTicket } = useAuth();
  const [view, setView] = useState<'list' | 'kanban' | 'analytics'>('analytics');

  const isMC = user?.role === Role.MejoraContinua || user?.role === Role.Administrador;

  const handleQuickApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateTicket({ id, status: TicketStatus.Aprobado });
  };

  const handleQuickReject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateTicket({ id, status: TicketStatus.Rechazado });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const ticketsForUser = tickets.filter(ticket => {
    if (!user) return false;
    if (user.role === Role.Solicitante) return ticket.solicitanteId === user.id;
    if (user.role === Role.JefeDirecto) return ticket.aprobadorEmail === user.email || ticket.solicitanteId === user.id;
    return isMC;
  });

  const filteredTickets = ticketsForUser.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingApprovalTickets = tickets.filter(ticket =>
    ticket.status === TicketStatus.EnRevisionJefe && ticket.aprobadorEmail === user?.email
  );

  // Stats calculations
  const stats = {
    total: ticketsForUser.length,
    pending: ticketsForUser.filter(t => t.status === TicketStatus.EnRevisionJefe).length,
    active: ticketsForUser.filter(t => [TicketStatus.EnAnalisis, TicketStatus.EnDesarrollo, TicketStatus.EnValidacion, TicketStatus.Aprobado].includes(t.status)).length,
    closed: ticketsForUser.filter(t => [TicketStatus.Cerrado, TicketStatus.Implementado].includes(t.status)).length
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Panel de Control</h1>
          <p className="text-slate-500 font-medium">Gestiona y monitorea tus proyectos de mejora continua.</p>
        </div>
        {isMC && (
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex gap-1.5">
            <button
              onClick={() => setView('analytics')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'analytics' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <PieChart size={18} /> Analística
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'list' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${view === 'kanban' ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <Trello size={18} /> Kanban
            </button>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard title="Total Tickets" value={stats.total} icon={<IconTotal />} color="text-primary" />
        <KpiCard title="Pendiente Aprobación" value={stats.pending} icon={<IconPending />} color="text-amber-500" trend={{ value: 'Acción Requerida', isUp: false }} />
        <KpiCard title="En Curso" value={stats.active} icon={<IconActive />} color="text-blue-500" />
        <KpiCard title="Finalizados" value={stats.closed} icon={<IconClosed />} color="text-emerald-500" trend={{ value: 'Completados', isUp: true }} />
      </div>

      {user?.role === Role.JefeDirecto && pendingApprovalTickets.length > 0 && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-amber-400 rounded-full" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Acción Requerida: Pendientes de tu Aprobación</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingApprovalTickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onApprove={handleQuickApprove}
                onReject={handleQuickReject}
              />
            ))}
          </div>
        </div>
      )}

      {view === 'analytics' ? (
        <AnalyticsDashboard />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por ID o título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 text-sm font-medium appearance-none"
              >
                <option value="all">Todos los estados</option>
                {Object.values(TicketStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {view === 'kanban' ? (
            <div className="animate-fade-in"><KanbanBoard tickets={filteredTickets} /></div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-8 bg-primary rounded-full" />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">{isMC ? 'Todos los Tickets' : 'Mis Tickets de Mejora'}</h2>
              </div>
              {filteredTickets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                  {filteredTickets.map(ticket => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium">No se encontraron tickets que coincidan con los filtros.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
