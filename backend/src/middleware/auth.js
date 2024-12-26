const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
        }

        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({ message: 'Formato de token inválido' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        if (!user.active) {
            return res.status(401).json({ message: 'Usuario inactivo' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = auth;