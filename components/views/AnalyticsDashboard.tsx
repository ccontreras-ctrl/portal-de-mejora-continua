
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { TicketStatus } from '../../types';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import Card from '../ui/Card';
import { TrendingUp, CheckCircle2, Clock, Inbox } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AnalyticsDashboard: React.FC = () => {
    const { tickets } = useAuth();

    // Data for Status Chart
    const statusCounts = tickets.reduce((acc: any, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {});

    const statusData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: 'Tickets por Estado',
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(240, 241, 243, 0.8)', // Borrador
                    'rgba(251, 191, 36, 0.8)', // En revisión jefe
                    'rgba(59, 130, 246, 0.8)', // Aprobado
                    'rgba(244, 63, 94, 0.8)',  // Rechazado
                    'rgba(99, 102, 241, 0.8)', // En análisis
                    'rgba(139, 92, 246, 0.8)', // En desarrollo
                    'rgba(217, 70, 239, 0.8)', // En validación
                    'rgba(16, 185, 129, 0.8)', // Implementado
                    'rgba(34, 197, 94, 0.8)',  // Cerrado
                ],
                borderRadius: 8,
            },
        ],
    };

    // Data for Area Chart
    const areaCounts = tickets.reduce((acc: any, ticket) => {
        acc[ticket.area] = (acc[ticket.area] || 0) + 1;
        return acc;
    }, {});

    const areaData = {
        labels: Object.keys(areaCounts),
        datasets: [
            {
                data: Object.values(areaCounts),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(244, 63, 94, 0.8)',
                ],
                borderWidth: 0,
            },
        ],
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Distribución por Estado">
                    <div className="h-[300px] flex items-center justify-center">
                        <Bar
                            data={statusData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
                            }}
                        />
                    </div>
                </Card>

                <Card title="Participación por Área">
                    <div className="h-[300px] flex items-center justify-center">
                        <Pie
                            data={areaData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { position: 'bottom' } }
                            }}
                        />
                    </div>
                </Card>
            </div>

            <Card title="Eficiencia del Proceso">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-4">
                    <div className="text-center">
                        <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3">
                            <CheckCircle2 size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Tasa de Implementación</p>
                        <p className="text-3xl font-black text-slate-800">
                            {Math.round((tickets.filter(t => t.status === TicketStatus.Implementado || t.status === TicketStatus.Cerrado).length / (tickets.length || 1)) * 100)}%
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3">
                            <Clock size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Promedio de Respuesta</p>
                        <p className="text-3xl font-black text-slate-800">2.4 <span className="text-sm font-bold text-slate-400">Días</span></p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-2xl mb-3">
                            <TrendingUp size={24} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Impacto Estimado</p>
                        <p className="text-3xl font-black text-slate-800">Alto</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AnalyticsDashboard;
