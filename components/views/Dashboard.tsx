
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Role, Ticket, TicketStatus } from '../../types';
import KanbanBoard from '../ticket/KanbanBoard';
import TicketCard from '../ticket/TicketCard';
import Button from '../ui/Button';

const Dashboard: React.FC = () => {
  const { user, tickets } = useAuth();
  const [view, setView] = useState<'list' | 'kanban'>('list');

  const isMC = user?.role === Role.MejoraContinua || user?.role === Role.Administrador;

  const ticketsForUser = tickets.filter(ticket => {
    if (!user) return false;
    if (user.role === Role.Solicitante) {
      return ticket.solicitanteId === user.id;
    }
    if (user.role === Role.JefeDirecto) {
      return ticket.aprobadorEmail === user.email || ticket.solicitanteId === user.id;
    }
    if (isMC) {
      return true; // MC and Admin see all
    }
    return false;
  });
  
  const pendingApprovalTickets = tickets.filter(ticket => 
    ticket.status === TicketStatus.EnRevisionJefe && ticket.aprobadorEmail === user?.email
  );


  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-primary">Dashboard de Tickets</h1>
            {isMC && (
                <div className="flex gap-2">
                    <Button variant={view === 'list' ? 'primary' : 'secondary'} onClick={() => setView('list')}>Lista</Button>
                    <Button variant={view === 'kanban' ? 'primary' : 'secondary'} onClick={() => setView('kanban')}>Kanban</Button>
                </div>
            )}
        </div>

        {user?.role === Role.JefeDirecto && pendingApprovalTickets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Tickets Pendientes de Aprobación</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingApprovalTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
            </div>
            <hr className="my-8"/>
          </div>
        )}
        
        {view === 'kanban' && isMC ? (
            <KanbanBoard tickets={tickets} />
        ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">{isMC ? 'Todos los Tickets' : 'Mis Tickets'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {ticketsForUser.map(ticket => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
              </div>
            </div>
        )}
    </div>
  );
};

export default Dashboard;
