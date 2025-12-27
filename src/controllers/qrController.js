const QRCode = require('qrcode');

/**
 * Genera un QR code como imagen PNG
 * GET /api/v1/qr?data=...&size=300
 */
async function generateQrGet(req, res, next) {
    try {
        const { data, size } = req.query;

        if (!data) {
            return res.status(400).json({
                error: 'BadRequest',
                message: 'Missing required query parameter: data'
            });
        }

        const qrSize = parseInt(size) || 300;

        // Generar QR como PNG buffer
        const pngBuffer = await QRCode.toBuffer(data, {
            type: 'png',
            width: qrSize,
            margin: 1,
            errorCorrectionLevel: 'M'
        });

        // Responder con imagen PNG
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24h
        res.send(pngBuffer);

    } catch (error) {
        console.error('Error generating QR:', error);
        next(error);
    }
}

/**
 * Genera un QR code como imagen PNG (POST con body)
 * POST /api/v1/qr { data: "...", size: 300 }
 */
async function generateQrPost(req, res, next) {
    try {
        const { data, size } = req.body;

        if (!data) {
            return res.status(400).json({
                error: 'BadRequest',
                message: 'Missing required field: data'
            });
        }

        const qrSize = parseInt(size) || 300;

        const pngBuffer = await QRCode.toBuffer(data, {
            type: 'png',
            width: qrSize,
            margin: 1,
            errorCorrectionLevel: 'M'
        });

        res.setHeader('Content-Type', 'image/png');
        res.send(pngBuffer);

    } catch (error) {
        console.error('Error generating QR:', error);
        next(error);
    }
}

module.exports = {
    generateQrGet,
    generateQrPost
};
