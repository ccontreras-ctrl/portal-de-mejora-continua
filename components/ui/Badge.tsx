
import React from 'react';
import { TicketStatus } from '../../types';

interface BadgeProps {
  status?: TicketStatus;
  content?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
}

const Badge: React.FC<BadgeProps> = ({ status, content, variant }) => {
  const statusColors: Record<TicketStatus, string> = {
    [TicketStatus.Borrador]: 'bg-slate-100 text-slate-600 border-slate-200',
    [TicketStatus.EnRevisionJefe]: 'bg-amber-100 text-amber-700 border-amber-200',
    [TicketStatus.Aprobado]: 'bg-blue-100 text-blue-700 border-blue-200',
    [TicketStatus.Rechazado]: 'bg-rose-100 text-rose-700 border-rose-200',
    [TicketStatus.EnAnalisis]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    [TicketStatus.EnDesarrollo]: 'bg-violet-100 text-violet-700 border-violet-200',
    [TicketStatus.EnValidacion]: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
    [TicketStatus.Implementado]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [TicketStatus.Cerrado]: 'bg-green-100 text-green-700 border-green-200',
  };

  const variantColors = {
    info: 'bg-blue-50 text-blue-600 border-blue-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  let className = status ? (statusColors[status] || variantColors.neutral) : (variant ? variantColors[variant] : variantColors.neutral);
  let text = content || status || '';

  return (
    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${className}`}>
      {text}
    </span>
  );
};

export default Badge;
