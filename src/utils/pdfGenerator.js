const puppeteer = require('puppeteer');

let browser = null;

/**
 * Obtiene o crea una instancia del navegador
 * Reutiliza la misma instancia para mejor performance
 */
async function getBrowser() {
    if (!browser || !browser.connected) {
        console.log('🌐 Launching browser...');

        // Detectar path de Chromium (Docker usa /usr/bin/chromium)
        const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || null;

        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: executablePath,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer',
                '--single-process',
                '--no-zygote',
                '--disable-extensions',
                '--disable-background-networking',
                '--disable-default-apps',
                '--disable-sync',
                '--disable-translate',
                '--hide-scrollbars',
                '--metrics-recording-only',
                '--mute-audio',
                '--no-first-run',
                '--safebrowsing-disable-auto-update'
            ]
        });
        console.log('✅ Browser ready');
    }
    return browser;
}

/**
 * Genera un PDF a partir de HTML
 * @param {string} html - Contenido HTML a renderizar
 * @param {object} options - Opciones de generación (medidas en pulgadas)
 * @returns {Buffer} - Buffer del PDF generado
 */
async function generate(html, options = {}) {
    const browser = await getBrowser();
    const page = await browser.newPage();

    try {
        // Configurar viewport para renderizado consistente
        await page.setViewport({ width: 1200, height: 800 });

        // Cargar HTML en la página
        await page.setContent(html, {
            waitUntil: ['load', 'networkidle0'], // Esperar a que carguen recursos externos (QR, etc)
            timeout: 30000
        });

        // Convertir pulgadas a unidades de Puppeteer (que usa pulgadas directamente)
        const pdfOptions = {
            format: undefined, // No usar formato predefinido, usamos width/height custom
            width: `${options.width || 8.5}in`,
            printBackground: true, // Importante para fondos y colores
            margin: {
                top: `${options.marginTop || 0.4}in`,
                right: `${options.marginRight || 0.4}in`,
                bottom: `${options.marginBottom || 0.4}in`,
                left: `${options.marginLeft || 0.4}in`
            }
        };

        // Generar PDF
        const pdfBuffer = await page.pdf(pdfOptions);

        return pdfBuffer;

    } finally {
        // Cerrar la página pero mantener el browser abierto para reusar
        await page.close();
    }
}

/**
 * Cierra el navegador (para cleanup)
 */
async function closeBrowser() {
    if (browser) {
        await browser.close();
        browser = null;
    }
}

// Cleanup al cerrar el proceso
process.on('SIGINT', async () => {
    await closeBrowser();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeBrowser();
    process.exit(0);
});

module.exports = {
    generate,
    closeBrowser
};
