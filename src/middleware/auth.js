/**
 * Middleware de autenticación Bearer Token
 * Verifica que el header Authorization contenga el token válido
 */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Missing Authorization header'
        });
    }

    // Extraer token del header "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid Authorization header format. Use: Bearer <token>'
        });
    }

    const token = parts[1];
    const validToken = process.env.API_TOKEN;

    if (!validToken) {
        console.error('API_TOKEN not configured in environment variables');
        return res.status(500).json({
            error: 'ServerConfigurationError',
            message: 'API token not configured on server'
        });
    }

    // Comparación segura de tiempo constante para evitar timing attacks
    if (!timingSafeEqual(token, validToken)) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid API token'
        });
    }

    next();
}

/**
 * Comparación de strings en tiempo constante
 * Previene ataques de timing
 */
function timingSafeEqual(a, b) {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

module.exports = authMiddleware;
