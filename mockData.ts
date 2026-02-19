import { User, Role, Ticket, TicketStatus } from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    name: 'Ana Gómez',
    email: 'ana.gomez@suzuval.cl',
    role: Role.Solicitante,
    manager: 'pedro.pascal@suzuval.cl',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    name: 'Pedro Pascal',
    email: 'pedro.pascal@suzuval.cl',
    role: Role.JefeDirecto,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12',
    name: 'Carlos Diaz',
    email: 'carlos.diaz@suzuval.cl',
    role: Role.MejoraContinua,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef123',
    name: 'Sofia Reyes',
    email: 'sofia.reyes@suzuval.cl',
    role: Role.Administrador,
  },
];

// Mock Tickets
export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'MC-2023-0001',
    title: 'Automatizar reporte de ventas semanal',
    createdAt: new Date('2023-10-26T09:00:00Z').toISOString(),
    solicitanteId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Ana Gómez
    area: 'Comercial',
    sucursal: 'Casa Matriz',
    categoria: 'BI / Reportería',
    description: 'Actualmente, el reporte de ventas se genera manualmente cada lunes, tomando aprox. 4 horas. Se solicita automatizar la extracción de datos y el envío por correo.',
    impacto: 'Ahorro de 16 horas/hombre al mes y reducción de errores manuales.',
    urgencia: 'Alta',
    prioridad: 'Alta',
    status: TicketStatus.EnRevisionJefe,
    aprobadorEmail: 'pedro.pascal@suzuval.cl', // Pedro Pascal
    driveFolderUrl: '#',
    ishikawaData: {
      categories: {
        'Método': ['Proceso manual propenso a errores'],
        'Mano de obra': ['Requiere alta concentración'],
        'Máquina': [],
        'Material': [],
        'Medio ambiente': [],
        'Medición': [],
      }
    },
  },
  {
    id: 'MC-2023-0002',
    title: 'Optimizar proceso de facturación',
    createdAt: new Date('2023-10-25T14:30:00Z').toISOString(),
    solicitanteId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Ana Gómez
    area: 'Finanzas',
    sucursal: 'Antofagasta',
    categoria: 'Proceso Interno',
    description: 'El proceso de facturación involucra varios sistemas y validaciones manuales, generando retrasos.',
    impacto: 'Reducir el tiempo de ciclo de facturación en un 20%.',
    urgencia: 'Media',
    prioridad: 'Alta',
    status: TicketStatus.Aprobado,
    aprobadorEmail: 'pedro.pascal@suzuval.cl', // Pedro Pascal
    asignadoAId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', // Carlos Diaz
    driveFolderUrl: '#',
    ishikawaData: { categories: {} },
  },
  {
    id: 'MC-2023-0003',
    title: 'Implementar checklist digital para mantención',
    createdAt: new Date('2023-10-24T11:00:00Z').toISOString(),
    solicitanteId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1', // Pedro Pascal
    area: 'Operaciones',
    sucursal: 'Valparaíso',
    categoria: 'Operacional',
    description: 'Los checklists de mantención de equipos son en papel, se pierden y es difícil hacer seguimiento.',
    impacto: 'Mejorar trazabilidad de mantenciones y disponibilidad de equipos.',
    urgencia: 'Media',
    prioridad: 'Media',
    status: TicketStatus.EnAnalisis,
    aprobadorEmail: 'sofia.reyes@suzuval.cl', // Sofia Reyes (Admin as manager)
    asignadoAId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', // Carlos Diaz
    driveFolderUrl: '#',
    ishikawaData: { categories: {} },
  },
    {
    id: 'MC-2023-0004',
    title: 'Crear dashboard de KPIs para Gerencia',
    createdAt: new Date('2023-09-15T10:00:00Z').toISOString(),
    solicitanteId: 'd4e5f6a7-b8c9-0123-4567-890abcdef123', // Sofia Reyes
    area: 'Gerencia',
    sucursal: 'Casa Matriz',
    categoria: 'BI / Reportería',
    description: 'Se necesita un dashboard en Power BI con los principales KPIs del negocio para la toma de decisiones estratégicas.',
    impacto: 'Visibilidad en tiempo real del desempeño de la compañía.',
    urgencia: 'Alta',
    prioridad: 'Alta',
    status: TicketStatus.Implementado,
    aprobadorEmail: 'sofia.reyes@suzuval.cl',
    asignadoAId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef12', // Carlos Diaz
    driveFolderUrl: '#',
    ishikawaData: { categories: {} },
  },
];
