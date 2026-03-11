import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';
import { uploadToDrive, createTicketFolder } from './drive.js';
import { sendNotificationEmail } from './email.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Configure Multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Drive upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { ticketId } = req.body;
        if (!ticketId) {
            return res.status(400).json({ error: 'Ticket ID is required' });
        }

        const fileUrl = await uploadToDrive(req.file, ticketId);
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Error uploading to Drive:', error);
        res.status(500).json({ error: 'Failed to upload to Google Drive' });
    }
});

// Notification endpoint
app.post('/api/notify', async (req, res) => {
    try {
        const { ticket, type, recipientEmail, authorName, commentContent } = req.body;
        await sendNotificationEmail(ticket, type, recipientEmail, { authorName, commentContent });
        res.json({ success: true });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Failed to send notification' });
    }
});

// Serve frontend static files
const distPath = path.join(__dirname, '../../../dist');
app.use(express.static(distPath));

// For SPA: any other route should serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
