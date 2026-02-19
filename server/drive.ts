import { google } from 'googleapis';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root folder ID provided by user
const ROOT_FOLDER_ID = '1BAvvaOaBr-MnLVq9qCYjpabnaqVu9by3';

// Load service account credentials from the file we just created
const KEY_FILE = path.join(__dirname, '../../drive-key.json');

const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/drive.metadata'],
});

const drive = google.drive({ version: 'v3', auth });

export async function createTicketFolder(ticketId: string) {
    try {
        const fileMetadata = {
            name: `Ticket-${ticketId}`,
            mimeType: 'application/vnd.google-apps.folder',
            parents: [ROOT_FOLDER_ID],
        };

        const folder = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });

        return folder.data.id;
    } catch (error) {
        console.error('Error creating folder:', error);
        throw error;
    }
}

export async function uploadToDrive(file: Express.Multer.File, ticketId: string) {
    try {
        // First find or create the ticket folder
        // For simplicity, we'll try to find if it exists first
        const response = await drive.files.list({
            q: `name = 'Ticket-${ticketId}' and mimeType = 'application/vnd.google-apps.folder' and '${ROOT_FOLDER_ID}' in parents and trashed = false`,
            fields: 'files(id)',
        });

        let folderId;
        if (response.data.files && response.data.files.length > 0) {
            folderId = response.data.files[0].id;
        } else {
            folderId = await createTicketFolder(ticketId);
        }

        const fileMetadata = {
            name: file.originalname,
            parents: [folderId!],
        };

        const media = {
            mimeType: file.mimetype,
            body: Buffer.from(file.buffer),
        };

        const driveFile = await drive.files.create({
            requestBody: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        // Make the file readable by anyone with the link (optional but helpful)
        await drive.permissions.create({
            fileId: driveFile.data.id!,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        return driveFile.data.webViewLink;
    } catch (error) {
        console.error('Error uploading file to Drive:', error);
        throw error;
    }
}
