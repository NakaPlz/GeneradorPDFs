require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pdfController = require('./controllers/pdfController');
const qrController = require('./controllers/qrController');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint (sin autenticación)
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// QR generation endpoints (GET sin auth para uso directo en img src)
app.get('/api/v1/qr', qrController.generateQrGet);
// QR generation con auth para POST
app.post('/api/v1/qr', authMiddleware, qrController.generateQrPost);

// PDF generation endpoint (con autenticación)
app.post('/api/v1/pdfs', authMiddleware, pdfController.generatePdf);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(err.status || 500).json({
        error: err.name || 'InternalServerError',
        message: err.message || 'An unexpected error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 PDF Generator running on port ${PORT}`);
    console.log(`📄 POST /api/v1/pdfs - Generate PDF from HTML`);
    console.log(`🔲 GET  /api/v1/qr   - Generate QR code`);
    console.log(`❤️  GET  /health     - Health check`);
});
