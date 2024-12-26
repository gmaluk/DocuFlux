const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

const router = express.Router();

// Rutas protegidas que requieren autenticación
router.use(auth);

// Rutas que requieren rol de administrador
router.get('/', checkRole(['ADMINISTRATOR']), userController.getAllUsers);
router.post('/', checkRole(['ADMINISTRATOR']), userController.createUser);
router.put('/:id', checkRole(['ADMINISTRATOR']), userController.updateUser);
router.patch('/:id/toggle-status', checkRole(['ADMINISTRATOR']), userController.toggleUserStatus);

// Ruta para obtener controllers (usada en el formulario de proveedores)
router.get('/controllers', userController.getControllers);

module.exports = router;