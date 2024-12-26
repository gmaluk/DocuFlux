const express = require('express');
const router = express.Router();
const providerController = require('../controllers/providerController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

// Rutas protegidas que requieren autenticación
router.use(auth);

// Rutas principales de proveedores
router.get('/', providerController.getAllProviders);
router.post('/', checkRole(['ADMINISTRATOR']), providerController.createProvider);
router.put('/:id', checkRole(['ADMINISTRATOR']), providerController.updateProvider);

module.exports = router;