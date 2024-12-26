const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

// Rutas protegidas que requieren autenticación
router.use(auth);

// Rutas principales de empresas
router.get('/', companyController.getAllCompanies);
router.post('/', checkRole(['ADMINISTRATOR']), companyController.createCompany);
router.put('/:id', checkRole(['ADMINISTRATOR']), companyController.updateCompany);

// Rutas para flujos de pago
router.get('/:companyId/payment-flows', companyController.getPaymentFlows);
router.post('/:companyId/payment-flows', checkRole(['ADMINISTRATOR']), companyController.addPaymentFlow);
router.delete('/:companyId/payment-flows/:flowId', checkRole(['ADMINISTRATOR']), companyController.deletePaymentFlow);

module.exports = router;