
import React from 'react';
import { Ticket, TicketStatus } from '../../types';
import { KANBAN_COLUMNS } from '../../constants';
import TicketCard from './TicketCard';

interface KanbanBoardProps {
  tickets: Ticket[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tickets }) => {
    const columns = Object.keys(KANBAN_COLUMNS) as TicketStatus[];

    const getTicketsForColumn = (status: TicketStatus) => {
        return tickets.filter(t => t.status === status);
    };

    return (
        <div className="flex space-x-4 overflow-x-auto p-2">
            {columns.map(status => (
                <div key={status} className="bg-gray-100 rounded-lg w-80 flex-shrink-0">
                    <h2 className="font-bold p-3 text-primary border-b bg-white rounded-t-lg">
                        {KANBAN_COLUMNS[status]} ({getTicketsForColumn(status).length})
                    </h2>
                    <div className="p-2 space-y-3 h-full overflow-y-auto">
                        {getTicketsForColumn(status).map(ticket => (
                            <TicketCard key={ticket.id} ticket={ticket} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
