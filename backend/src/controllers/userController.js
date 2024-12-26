const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'full_name', 'role', 'active']
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, full_name, role } = req.body;

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Crear el usuario
        const user = await User.create({
            email,
            password_hash: password, // El modelo se encarga de hashear la contraseña
            full_name,
            role,
            active: true
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            active: user.active
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, full_name, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el nuevo email ya está en uso
        if (email !== user.email) {
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            }
        }

        // Actualizar usuario
        const updateData = {
            email,
            full_name,
            role
        };

        // Solo actualizar contraseña si se proporciona una nueva
        if (password) {
            updateData.password_hash = password;
        }

        await user.update(updateData);

        res.json({
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            active: user.active
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.update({ active: !user.active });
        
        res.json({
            id: user.id,
            active: user.active
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cambiar el estado del usuario' });
    }
};

exports.getControllers = async (req, res) => {
    try {
        const controllers = await User.findAll({
            where: {
                role: 'CONTROLLER',
                active: true
            },
            attributes: ['id', 'full_name', 'email']
        });
        res.json(controllers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener controllers' });
    }
};