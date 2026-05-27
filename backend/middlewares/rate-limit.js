import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutos
    max: 100,
    message: { message: 'Demasiadas solicitudes desde esta IP. Intentá de nuevo en 10 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
});


export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // se determina el tiempo de bloqueo después de alcanzar el límite (15 minutos)
    max: 10, // se determina el número máximo de intentos permitidos (10 intentos)
    message: { message: 'Demasiados intentos de inicio de sesión. Intentá de nuevo en 15 minutos.' },
    standardHeaders: true, // se habilitan las cabeceras estándar de rate limit para informar a los clientes sobre su estado de límite
    legacyHeaders: false, // se deshabilitan las cabeceras legacy de rate limit para evitar confusiones con las cabeceras estándar
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5,
    message: { message: 'Demasiados intentos de registro desde esta IP. Intentá de nuevo en 1 hora.' },
    standardHeaders: true,
    legacyHeaders: false,
});
