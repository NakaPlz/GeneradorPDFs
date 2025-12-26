# PDF Generator Service

Servicio web para generar PDFs a partir de HTML, compatible con n8n.

## Instalación Local

```bash
npm install
```

## Configuración

Crea un archivo `.env` (o copia `.env.example`):

```env
PORT=3000
API_TOKEN=tu-token-secreto
```

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## API

### POST /api/v1/pdfs

Genera un PDF a partir de HTML.

**Headers:**
- `Authorization: Bearer <API_TOKEN>`
- `Content-Type: application/json`

**Body:**
```json
{
  "html": "<html>...</html>",
  "file_name": "mi-documento",
  "options": {
    "width": 8,
    "marginLeft": 0.4,
    "marginRight": 0.4,
    "marginTop": 0.4,
    "marginBottom": 0.4
  }
}
```

**Response:** PDF binario

## Docker

```bash
docker-compose up -d
```

## Licencia

MIT
