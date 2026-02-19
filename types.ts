
export enum Role {
  Solicitante = 'Solicitante',
  JefeDirecto = 'Jefe Directo',
  MejoraContinua = 'Mejora Continua',
  Administrador = 'Administrador',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  manager?: string; // email of manager
  area?: string;
  sucursal?: string;
}

export enum TicketStatus {
  Borrador = 'Borrador',
  EnRevisionJefe = 'En revisión jefe',
  Aprobado = 'Aprobado',
  Rechazado = 'Rechazado',
  EnAnalisis = 'En análisis',
  EnDesarrollo = 'En desarrollo',
  EnValidacion = 'En pruebas/validación',
  Implementado = 'Implementado',
  Cerrado = 'Cerrado',
}

export interface Comment {
  id: string;
  authorId: string;
  ticketId: string;
  createdAt: string;
  content: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  version: number;
  uploadedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  calendarLink: string;
  attendees: string[];
  minutes: string; // Could be more structured
}

export interface IshikawaData {
  categories: {
    [key: string]: string[];
  };
}

export interface Ticket {
  id: string;
  title: string;
  createdAt: string; // Corresponds to created_at in DB
  solicitanteId: string; // Corresponds to solicitante_id
  area: string;
  sucursal: string;
  categoria: string;
  description: string;
  impacto: string;
  urgencia: 'Baja' | 'Media' | 'Alta';
  prioridad: 'Baja' | 'Media' | 'Alta';
  status: TicketStatus;
  aprobadorEmail: string; // Corresponds to aprobador_email
  asignadoAId?: string; // Corresponds to asignado_a_id
  driveFolderUrl: string; // Corresponds to drive_folder_url
  ishikawaData: IshikawaData; // Corresponds to ishikawa_data
  // Comments, attachments, meetings will be handled in separate tables/fetches
  comments?: Comment[];
  attachments?: Attachment[];
  meetings?: Meeting[];
}
