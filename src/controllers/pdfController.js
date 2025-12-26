const pdfGenerator = require('../utils/pdfGenerator');

/**
 * Controller para generar PDFs a partir de HTML
 */
async function generatePdf(req, res, next) {
    try {
        const { html, file_name, options } = req.body;

        // Validar que se envió HTML
        if (!html) {
            return res.status(400).json({
                error: 'BadRequest',
                message: 'Missing required field: html'
            });
        }

        // Nombre del archivo por defecto
        const fileName = file_name || 'document';

        // Opciones por defecto (en pulgadas, como afipSDK)
        const pdfOptions = {
            width: options?.width || 8.5,        // Ancho en pulgadas (Letter = 8.5)
            marginLeft: options?.marginLeft || 0.4,
            marginRight: options?.marginRight || 0.4,
            marginTop: options?.marginTop || 0.4,
            marginBottom: options?.marginBottom || 0.4
        };

        console.log(`📄 Generating PDF: ${fileName}`);
        const startTime = Date.now();

        // Generar PDF
        const pdfBuffer = await pdfGenerator.generate(html, pdfOptions);

        const duration = Date.now() - startTime;
        console.log(`✅ PDF generated in ${duration}ms (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);

        // Configurar headers de respuesta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Enviar PDF
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        next(error);
    }
}

module.exports = {
    generatePdf
};
