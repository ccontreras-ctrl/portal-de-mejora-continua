
import React from 'react';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';
import { TicketStatus } from '../../types';

import AnalyticsDashboard from './AnalyticsDashboard';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reportes Avanzados</h1>
          <p className="text-slate-500 font-medium">Visualiza el impacto y rendimiento global de la mejora continua.</p>
        </div>
      </div>

      <AnalyticsDashboard />
    </div>
  );
};

export default Reports;
