
import React from 'react';
import { Ticket } from '../../types';
import Badge from '../ui/Badge';
import { useAuth } from '../../hooks/useAuth';

interface TicketCardProps {
    ticket: Ticket;
    onApprove?: (id: string, e: React.MouseEvent) => void;
    onReject?: (id: string, e: React.MouseEvent) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onApprove, onReject }) => {
    const { selectTicket, users } = useAuth();
    const solicitanteName = users.find(u => u.id === ticket.solicitanteId)?.name || 'Cargando...';

    // Priority color mapping
    const priorityColors = {
        'Alta': 'bg-red-50 text-red-600 border-red-100',
        'Media': 'bg-amber-50 text-amber-600 border-amber-100',
        'Baja': 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };

    return (
        <div
            onClick={() => selectTicket(ticket.id)}
            className="group relative bg-white rounded-2xl p-5 flex flex-col justify-between h-full cursor-pointer transition-all duration-300 border border-slate-200 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 animate-slide-up"
        >
            {/* Top decorative bar */}
            <div className="absolute top-0 left-6 right-6 h-1 bg-primary/10 rounded-b-full group-hover:bg-primary/40 transition-colors" />

            <div>
                <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">{ticket.id}</span>
                    <Badge status={ticket.status} />
                </div>

                <h3 className="font-extrabold text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors pr-2">
                    {ticket.title}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {ticket.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityColors[ticket.urgencia] || 'bg-slate-50'}`}>
                        {ticket.urgencia}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {ticket.categoria}
                    </span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                            {solicitanteName.charAt(0)}
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-700 leading-none">{solicitanteName}</p>
                            <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{ticket.area}</p>
                        </div>
                    </div>
                    <p className="text-[10px] font-medium text-slate-400">
                        {new Date(ticket.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                    </p>
                </div>

                {(onApprove || onReject) && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                        {onApprove && (
                            <button
                                onClick={(e) => onApprove(ticket.id, e)}
                                className="flex-1 py-1.5 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors text-center"
                            >
                                Aprobar
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={(e) => onReject(ticket.id, e)}
                                className="flex-1 py-1.5 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors text-center"
                            >
                                Rechazar
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketCard;
