
import React from 'react';
import { TicketStatus } from '../../types';

interface BadgeProps {
  status: TicketStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const statusColors: Record<TicketStatus, string> = {
    [TicketStatus.Borrador]: 'bg-gray-200 text-gray-800',
    [TicketStatus.EnRevisionJefe]: 'bg-yellow-200 text-yellow-800',
    [TicketStatus.Aprobado]: 'bg-blue-200 text-blue-800',
    [TicketStatus.Rechazado]: 'bg-red-200 text-red-800',
    [TicketStatus.EnAnalisis]: 'bg-indigo-200 text-indigo-800',
    [TicketStatus.EnDesarrollo]: 'bg-purple-200 text-purple-800',
    [TicketStatus.EnValidacion]: 'bg-pink-200 text-pink-800',
    [TicketStatus.Implementado]: 'bg-teal-200 text-teal-800',
    [TicketStatus.Cerrado]: 'bg-green-200 text-green-800',
  };

  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status] || 'bg-gray-200 text-gray-800'}`}>
      {status}
    </span>
  );
};

export default Badge;
