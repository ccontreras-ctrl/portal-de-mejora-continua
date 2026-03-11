import { Resend } from 'resend';
import { Ticket } from '../types.js';

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

const PORTAL_URL = 'https://portal-de-mejora-continua-682575749366.us-west1.run.app';

export async function sendNotificationEmail(
    ticket: Ticket,
    type: 'created' | 'status_change' | 'comment',
    recipientEmail: string,
    extraData?: { authorName?: string, commentContent?: string }
) {
    if (!process.env.RESEND_API_KEY) {
        console.warn('⚠️ No RESEND_API_KEY configured. Skipping email.');
        return;
    }

    let subject = '';
    let html = '';

    if (type === 'created') {
        subject = `[NUEVO TICKET] ${ticket.id}: ${ticket.title}`;
        html = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #002279;">Nuevo Requerimiento de Mejora Continua</h2>
                <p>Se ha creado un nuevo ticket con los siguientes detalles:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>ID:</strong> ${ticket.id}</li>
                    <li><strong>Título:</strong> ${ticket.title}</li>
                    <li><strong>Área:</strong> ${ticket.area}</li>
                    <li><strong>Urgencia:</strong> ${ticket.urgencia}</li>
                </ul>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p>Puedes revisarlo en el portal: <a href="${PORTAL_URL}" style="color: #6366f1; font-weight: bold; text-decoration: none;">Ir al Portal</a></p>
            </div>
        `;
    } else if (type === 'status_change') {
        subject = `[ACTUALIZACIÓN] Ticket ${ticket.id}: ${ticket.status}`;
        html = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #002279;">Estado Actualizado</h2>
                <p>El ticket <strong>${ticket.id}</strong> ha cambiado su estado a: <strong>${ticket.status}</strong></p>
                <p><strong>Título:</strong> ${ticket.title}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p>Puedes revisarlo en el portal: <a href="${PORTAL_URL}" style="color: #6366f1; font-weight: bold; text-decoration: none;">Ir al Portal</a></p>
            </div>
        `;
    } else if (type === 'comment') {
        subject = `[COMENTARIO] Ticket ${ticket.id}: Nuevo mensaje de ${extraData?.authorName || 'un usuario'}`;
        html = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #002279;">Nuevo Comentario</h2>
                <p><strong>${extraData?.authorName || 'Un usuario'}</strong> ha comentado en el ticket <strong>${ticket.id}</strong>:</p>
                <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #6366f1; font-style: italic; margin: 15px 0;">
                    "${extraData?.commentContent || ''}"
                </div>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p>Puedes responder en el portal: <a href="${PORTAL_URL}" style="color: #6366f1; font-weight: bold; text-decoration: none;">Ir al Portal</a></p>
            </div>
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
