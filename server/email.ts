import { Resend } from 'resend';
import { Ticket } from '../types.js';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

export async function sendNotificationEmail(ticket: Ticket, type: 'created' | 'status_change', recipientEmail: string) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ No RESEND_API_KEY configured. Skipping email.');
        return;
    }

    let subject = '';
    let html = '';

    if (type === 'created') {
        subject = `[NUEVO TICKET] ${ticket.id}: ${ticket.title}`;
        html = `
            <h2>Nuevo Requerimiento de Mejora Continua</h2>
            <p>Se ha creado un nuevo ticket con los siguientes detalles:</p>
            <ul>
                <li><strong>ID:</strong> ${ticket.id}</li>
                <li><strong>Título:</strong> ${ticket.title}</li>
                <li><strong>Solicitante:</strong> ${ticket.solicitanteId}</li>
                <li><strong>Área:</strong> ${ticket.area}</li>
                <li><strong>Urgencia:</strong> ${ticket.urgencia}</li>
            </ul>
            <p>Puedes revisarlo en el portal: <a href="https://portal-de-mejora-continua-682575749366.us-west1.run.app">Link al Portal</a></p>
        `;
    } else {
        subject = `[ACTUALIZACIÓN] Ticket ${ticket.id}: ${ticket.status}`;
        html = `
            <h2>Estado Actualizado del Ticket</h2>
            <p>El ticket <strong>${ticket.id}</strong> ha cambiado su estado a: <strong>${ticket.status}</strong></p>
            <p>Título: ${ticket.title}</p>
            <p>Puedes revisarlo en el portal: <a href="https://portal-de-mejora-continua-682575749366.us-west1.run.app">Link al Portal</a></p>
        `;
    }

    try {
        await resend.emails.send({
            from: 'Portal Mejora Continua <no-reply@suzuval.cl>',
            to: recipientEmail,
            subject: subject,
            html: html,
        });
        console.log(`📧 Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}
