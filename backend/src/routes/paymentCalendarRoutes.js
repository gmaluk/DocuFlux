//docuflux/backend/src/routes/paymentCalendarRoutes.js

const express = require('express');
const router = express.Router();
const paymentCalendarController = require('../controllers/paymentCalendarController');
const auth = require('../middleware/auth');
const { checkRole } = require('../middleware/checkRole');

router.use(auth);

router.get('/', paymentCalendarController.getAllCalendars);
router.get('/:id', paymentCalendarController.getCalendarById);
router.post('/', checkRole(['ADMINISTRATOR']), paymentCalendarController.createCalendar);
router.put('/:id', checkRole(['ADMINISTRATOR']), paymentCalendarController.updateCalendar);
router.delete('/:id', checkRole(['ADMINISTRATOR']), paymentCalendarController.deleteCalendar);

module.exports = router;