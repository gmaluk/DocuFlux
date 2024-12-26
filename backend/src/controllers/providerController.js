const { Provider, Company, User } = require('../models');
const { validateRut, formatRut } = require('../utils/rutValidation');

exports.getAllProviders = async (req, res) => {
    try {
        const providers = await Provider.findAll({
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'controller',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });
        res.json(providers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener proveedores' });
    }
};

exports.createProvider = async (req, res) => {
    try {
        const { name, tax_id, company_id, controller_id } = req.body;

        // Validar el RUT
        if (!validateRut(tax_id)) {
            return res.status(400).json({
                message: 'El RUT ingresado no es válido'
            });
        }

        // Formatear el RUT
        const formattedRut = formatRut(tax_id);

        // Verificar si el proveedor ya existe para la empresa
        const existingProvider = await Provider.findOne({
            where: { 
                tax_id: formattedRut,
                company_id
            }
        });

        if (existingProvider) {
            return res.status(400).json({
                message: 'Ya existe un proveedor con este RUT para esta empresa'
            });
        }

        // Verificar que el controller exista y tenga el rol correcto
        const controller = await User.findOne({
            where: {
                id: controller_id,
                role: 'CONTROLLER',
                active: true
            }
        });

        if (!controller) {
            return res.status(400).json({
                message: 'El controller seleccionado no es válido'
            });
        }

        const provider = await Provider.create({
            name,
            tax_id: formattedRut,
            company_id,
            controller_id
        });

        // Cargar las relaciones para la respuesta
        const providerWithRelations = await Provider.findByPk(provider.id, {
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'controller',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });

        res.status(201).json(providerWithRelations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear proveedor' });
    }
};

exports.updateProvider = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, tax_id, company_id, controller_id } = req.body;

        // Validar el RUT
        if (!validateRut(tax_id)) {
            return res.status(400).json({
                message: 'El RUT ingresado no es válido'
            });
        }

        // Formatear el RUT
        const formattedRut = formatRut(tax_id);

        const provider = await Provider.findByPk(id);
        if (!provider) {
            return res.status(404).json({ message: 'Proveedor no encontrado' });
        }

        // Verificar si el nuevo RUT ya está en uso para la empresa
        if (formattedRut !== provider.tax_id || company_id !== provider.company_id) {
            const existingProvider = await Provider.findOne({
                where: {
                    tax_id: formattedRut,
                    company_id,
                    id: { [Op.ne]: id } // Excluir el proveedor actual
                }
            });

            if (existingProvider) {
                return res.status(400).json({
                    message: 'Ya existe un proveedor con este RUT para esta empresa'
                });
            }
        }

        // Verificar que el controller exista y tenga el rol correcto
        const controller = await User.findOne({
            where: {
                id: controller_id,
                role: 'CONTROLLER',
                active: true
            }
        });

        if (!controller) {
            return res.status(400).json({
                message: 'El controller seleccionado no es válido'
            });
        }

        await provider.update({
            name,
            tax_id: formattedRut,
            company_id,
            controller_id
        });

        // Cargar las relaciones para la respuesta
        const updatedProvider = await Provider.findByPk(id, {
            include: [
                {
                    model: Company,
                    as: 'company',
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'controller',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });

        res.json(updatedProvider);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar proveedor' });
    }
};