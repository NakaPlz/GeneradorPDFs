/**
 * Script de prueba para el generador de PDFs
 * Ejecutar: node test/test-pdf.js
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api/v1/pdfs';
const API_TOKEN = 'a3f8c2d1e9b7654f0123456789abcdef0123456789abcdef0123456789abcdef';

// Leer el HTML de prueba
const htmlPath = path.join(__dirname, 'factura-prueba.html');
const html = fs.readFileSync(htmlPath, 'utf-8');

async function testPdfGenerator() {
    console.log('🧪 Iniciando prueba del generador de PDFs...\n');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: html,
                file_name: 'factura-prueba',
                options: {
                    width: 8,
                    marginLeft: 0.4,
                    marginRight: 0.4,
                    marginTop: 0.4,
                    marginBottom: 0.4
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('❌ Error:', error);
            return;
        }

        // Guardar el PDF
        const buffer = await response.arrayBuffer();
        const pdfPath = path.join(__dirname, 'factura-generada.pdf');
        fs.writeFileSync(pdfPath, Buffer.from(buffer));

        console.log('✅ PDF generado exitosamente!');
        console.log(`📄 Archivo guardado en: ${pdfPath}`);
        console.log(`📊 Tamaño: ${(buffer.byteLength / 1024).toFixed(2)} KB`);

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.log('\n💡 Asegúrate de que el servidor esté corriendo con: npm run dev');
    }
}

testPdfGenerator();
