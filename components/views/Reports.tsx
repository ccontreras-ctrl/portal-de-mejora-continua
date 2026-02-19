
import React from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { TicketStatus } from '../../types';

const Reports: React.FC = () => {
  const { tickets } = useAppContext();

  const ticketsByStatus = tickets.reduce((acc, ticket) => {
    acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalTickets = tickets.length;
  const closedTickets = tickets.filter(t => t.status === TicketStatus.Cerrado).length;
  const avgCompletionRate = totalTickets > 0 ? (closedTickets / totalTickets) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-primary">Reportes y Métricas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="KPI de Implementación">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500">Tickets Proyectados vs Cerrados</span>
            <span className="text-sm font-bold text-primary">{avgCompletionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${avgCompletionRate}%` }}></div>
          </div>
          <p className="mt-4 text-3xl font-bold">{closedTickets} / {totalTickets}</p>
        </Card>

        <Card title="Tickets por Estado">
          <div className="space-y-3">
            {Object.entries(ticketsByStatus).map(([status, count]) => (
              <div key={status}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{status}</span>
                  <span className="font-bold">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-accent h-1.5 rounded-full"
                    style={{ width: `${(count / totalTickets) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {totalTickets === 0 && <p className="text-gray-500 text-sm">No hay datos disponibles.</p>}
          </div>
        </Card>

        <Card title="Impacto Estimado">
          <p className="text-gray-600">Resumen de beneficios declarados en tickets cerrados.</p>
          <ul className="mt-4 space-y-2">
            {tickets.filter(t => t.status === TicketStatus.Cerrado).slice(0, 3).map(t => (
              <li key={t.id} className="text-xs text-gray-500 border-l-2 border-success pl-2">
                {t.title}: {t.impacto?.substring(0, 50)}...
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
