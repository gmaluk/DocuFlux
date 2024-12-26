import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axiosClient from '../../config/axios';

const CompanyModal = ({ isOpen, onClose, company, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        tax_id: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (company) {
            setFormData({
                name: company.name,
                tax_id: company.tax_id
            });
        }
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatRut = (rut) => {
        // Eliminar puntos y guión
        let value = rut.replace(/\./g, '').replace(/-/g, '');
        
        // Obtener dígito verificador
        let dv = value.slice(-1);
        let rutNumber = value.slice(0, -1);
        
        // Formatear número
        rutNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        return rutNumber + "-" + dv;
    };

    const validateRut = (rut) => {
        // Verificar formato básico (XX.XXX.XXX-Y)
        const rutRegex = /^(\d{1,2}\.)?(\d{3}\.)*\d{3}-[\dkK]$/;
        return rutRegex.test(rut);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validar RUT
        if (!validateRut(formData.tax_id)) {
            setError('El formato del RUT no es válido (ej: 12.345.678-9)');
            return;
        }

        setLoading(true);

        try {
            if (company) {
                // Actualizar empresa
                await axiosClient.put(`/companies/${company.id}`, formData);
            } else {
                // Crear nueva empresa
                await axiosClient.post('/companies', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la empresa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {company ? 'Editar Empresa' : 'Nueva Empresa'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nombre de la Empresa
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            RUT
                        </label>
                        <input
                            type="text"
                            name="tax_id"
                            value={formData.tax_id}
                            onChange={(e) => {
                                const formattedRut = formatRut(e.target.value);
                                setFormData(prev => ({
                                    ...prev,
                                    tax_id: formattedRut
                                }));
                            }}
                            placeholder="12.345.678-9"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                loading ? 'opacity-75 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyModal;