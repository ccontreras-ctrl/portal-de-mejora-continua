
import { Role, TicketStatus } from './types';

export const ROLES: Role[] = [
  Role.Solicitante,
  Role.JefeDirecto,
  Role.MejoraContinua,
  Role.Administrador,
];

export const TICKET_STATUSES: TicketStatus[] = [
  TicketStatus.Borrador,
  TicketStatus.EnRevisionJefe,
  TicketStatus.Aprobado,
  TicketStatus.Rechazado,
  TicketStatus.EnAnalisis,
  TicketStatus.EnDesarrollo,
  TicketStatus.EnValidacion,
  TicketStatus.Implementado,
  TicketStatus.Cerrado,
];

export const ISHIKAWA_CATEGORIES = [
  'Método',
  'Mano de obra',
  'Máquina',
  'Material',
  'Medio ambiente',
  'Medición',
];

export const KANBAN_COLUMNS = {
  [TicketStatus.Aprobado]: 'Por Iniciar',
  [TicketStatus.EnAnalisis]: 'En Análisis',
  [TicketStatus.EnDesarrollo]: 'En Desarrollo',
  [TicketStatus.EnValidacion]: 'En Validación',
  [TicketStatus.Implementado]: 'Implementado'
}
