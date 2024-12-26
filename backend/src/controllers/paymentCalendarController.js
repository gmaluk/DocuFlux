//docuflux/backend/src/controllers/paymentCalendarController.js

const { PaymentCalendar, PaymentCalendarDate, Company } = require('../models');

exports.getAllCalendars = async (req, res) => {
    try {
        const calendars = await PaymentCalendar.findAll({
            include: [{
                model: PaymentCalendarDate,
                as: 'dates'
            }]
        });
        res.json(calendars);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener calendarios' });
    }
};

exports.getCalendarById = async (req, res) => {
    try {
        const calendar = await PaymentCalendar.findByPk(req.params.id, {
            include: [
                {
                    model: PaymentCalendarDate,
                    as: 'dates'
                },
                {
                    model: Company,
                    as: 'companies',
                    attributes: ['id', 'name']
                }
            ]
        });
        if (!calendar) {
            return res.status(404).json({ message: 'Calendario no encontrado' });
        }
        res.json(calendar);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener calendario' });
    }
};

exports.createCalendar = async (req, res) => {
    try {
        const { name, description, dates } = req.body;

        const calendar = await PaymentCalendar.create({
            name,
            description
        });

        if (dates && dates.length > 0) {
            const calendarDates = dates.map(date => ({
                ...date,
                calendar_id: calendar.id
            }));
            await PaymentCalendarDate.bulkCreate(calendarDates);
        }

        const createdCalendar = await PaymentCalendar.findByPk(calendar.id, {
            include: [{
                model: PaymentCalendarDate,
                as: 'dates'
            }]
        });

        res.status(201).json(createdCalendar);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear calendario' });
    }
};

exports.updateCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, dates } = req.body;

        const calendar = await PaymentCalendar.findByPk(id);
        if (!calendar) {
            return res.status(404).json({ message: 'Calendario no encontrado' });
        }

        await calendar.update({ name, description });

        if (dates) {
            await PaymentCalendarDate.destroy({
                where: { calendar_id: id }
            });

            const calendarDates = dates.map(date => ({
                ...date,
                calendar_id: id
            }));
            await PaymentCalendarDate.bulkCreate(calendarDates);
        }

        const updatedCalendar = await PaymentCalendar.findByPk(id, {
            include: [{
                model: PaymentCalendarDate,
                as: 'dates'
            }]
        });

        res.json(updatedCalendar);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar calendario' });
    }
};

exports.deleteCalendar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const calendar = await PaymentCalendar.findByPk(id, {
            include: [{
                model: Company,
                as: 'companies'
            }]
        });

        if (!calendar) {
            return res.status(404).json({ message: 'Calendario no encontrado' });
        }

        if (calendar.companies && calendar.companies.length > 0) {
            return res.status(400).json({ 
                message: 'No se puede eliminar el calendario porque está siendo usado por empresas' 
            });
        }

        await calendar.destroy();
        res.json({ message: 'Calendario eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar calendario' });
    }
};