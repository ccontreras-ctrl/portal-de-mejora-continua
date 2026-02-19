
import React from 'react';
import { Ticket } from '../../types';
import Badge from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
    const { selectTicket, users } = useAuth();
    const solicitanteName = users.find(u => u.id === ticket.solicitanteId)?.name || 'Desconocido';

    return (
        <div 
            onClick={() => selectTicket(ticket.id)}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-full cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-primary"
        >
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-md text-text-dark pr-2">{ticket.title}</h3>
                    <Badge status={ticket.status} />
                </div>
                <p className="text-xs text-gray-500 mb-2">{ticket.id}</p>
                <p className="text-sm text-gray-600 line-clamp-3">{ticket.description}</p>
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200 text-xs text-gray-500">
                <p>Solicitante: {solicitanteName}</p>
                <p>Creado: {new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default TicketCard;
