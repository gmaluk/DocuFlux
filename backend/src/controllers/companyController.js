const { Company, PaymentFlow } = require('../models');
const { validateRut, formatRut } = require('../utils/rutValidation');

exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            include: [{
                model: PaymentFlow,
                as: 'payment_flows'
            }]
        });
        res.json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener empresas' });
    }
};

exports.createCompany = async (req, res) => {
    try {
        const { name, tax_id } = req.body;

        // Validar el RUT
        if (!validateRut(tax_id)) {
            return res.status(400).json({
                message: 'El RUT ingresado no es válido'
            });
        }

        // Formatear el RUT
        const formattedRut = formatRut(tax_id);

        // Verificar si la empresa ya existe
        const existingCompany = await Company.findOne({ 
            where: { tax_id: formattedRut }
        });
        
        if (existingCompany) {
            return res.status(400).json({ 
                message: 'Ya existe una empresa con este RUT' 
            });
        }

        const company = await Company.create({
            name,
            tax_id: formattedRut
        });

        res.status(201).json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear empresa' });
    }
};

exports.updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tax_id } = req.body;

        // Validar el RUT
        if (!validateRut(tax_id)) {
            return res.status(400).json({
                message: 'El RUT ingresado no es válido'
            });
        }

        // Formatear el RUT
        const formattedRut = formatRut(tax_id);

        const company = await Company.findByPk(id);
        if (!company) {
            return res.status(404).json({ message: 'Empresa no encontrada' });
        }

        // Verificar si el nuevo RUT ya está en uso
        if (formattedRut !== company.tax_id) {
            const existingCompany = await Company.findOne({ 
                where: { tax_id: formattedRut }
            });
            
            if (existingCompany) {
                return res.status(400).json({ 
                    message: 'Ya existe una empresa con este RUT' 
                });
            }
        }

        await company.update({ 
            name, 
            tax_id: formattedRut 
        });
        
        res.json(company);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar empresa' });
    }
};

exports.getPaymentFlows = async (req, res) => {
    try {
        const { companyId } = req.params;
        const paymentFlows = await PaymentFlow.findAll({
            where: { company_id: companyId }
        });
        res.json(paymentFlows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener flujos de pago' });
    }
};

exports.addPaymentFlow = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { payment_day, cutoff_day, approval_day } = req.body;

        // Validar que los días estén en el rango correcto
        if (payment_day < 1 || payment_day > 31 ||
            cutoff_day < 1 || cutoff_day > 31 ||
            approval_day < 1 || approval_day > 31) {
            return res.status(400).json({ 
                message: 'Los días deben estar entre 1 y 31' 
            });
        }

        // Validar la lógica de los días
        if (cutoff_day >= payment_day) {
            return res.status(400).json({
                message: 'El día de corte debe ser anterior al día de pago'
            });
        }

        if (approval_day <= cutoff_day || approval_day >= payment_day) {
            return res.status(400).json({
                message: 'El día de aprobación debe estar entre el día de corte y el día de pago'
            });
        }

        const paymentFlow = await PaymentFlow.create({
            company_id: companyId,
            payment_day,
            cutoff_day,
            approval_day
        });

        res.status(201).json(paymentFlow);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear flujo de pago' });
    }
};

exports.deletePaymentFlow = async (req, res) => {
    try {
        const { companyId, flowId } = req.params;
        
        const paymentFlow = await PaymentFlow.findOne({
            where: {
                id: flowId,
                company_id: companyId
            }
        });

        if (!paymentFlow) {
            return res.status(404).json({ 
                message: 'Flujo de pago no encontrado' 
            });
        }

        await paymentFlow.destroy();
        res.json({ message: 'Flujo de pago eliminado' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar flujo de pago' });
    }
};