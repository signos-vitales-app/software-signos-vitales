const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        // Obtener el token del header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No se proporciona ningún token' });
        }

        const token = authHeader.split(' ')[1];

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Agregar la información del usuario decodificada a la request
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Token invalido' });
    }
};

module.exports = authMiddleware; 