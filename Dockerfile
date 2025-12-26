FROM node:20-slim

# Instalar dependencias de Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Configurar Puppeteer para usar Chromium del sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Copiar package.json primero para aprovechar cache de Docker
COPY package*.json ./

# Instalar dependencias de producción
RUN npm install --production

# Copiar código fuente
COPY src ./src

# Puerto del servicio
EXPOSE 3000

# Usuario no-root para seguridad
RUN groupadd -r pptruser && useradd -r -g pptruser pptruser \
    && chown -R pptruser:pptruser /app
USER pptruser

# Comando de inicio
CMD ["node", "src/index.js"]
