import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import axiosClient from '../../config/axios';

const PaymentCalendarModal = ({ isOpen, onClose, calendar, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        dates: []
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (calendar) {
            setFormData({
                name: calendar.name,
                description: calendar.description || '',
                dates: calendar.dates || []
            });
        }
    }, [calendar]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addDate = () => {
        setFormData(prev => ({
            ...prev,
            dates: [...prev.dates, { payment_day: '', cutoff_day: '', approval_day: '' }]
        }));
    };

    const removeDate = (index) => {
        setFormData(prev => ({
            ...prev,
            dates: prev.dates.filter((_, i) => i !== index)
        }));
    };

    const handleDateChange = (index, field, value) => {
        const newDates = [...formData.dates];
        newDates[index] = {
            ...newDates[index],
            [field]: parseInt(value) || ''
        };
        setFormData(prev => ({
            ...prev,
            dates: newDates
        }));
    };

    const validateDates = (dates) => {
        for (const date of dates) {
            if (!date.payment_day || !date.cutoff_day || !date.approval_day) {
                return 'Todos los campos de fecha son requeridos';
            }

            if (date.cutoff_day >= date.payment_day) {
                return 'El día de corte debe ser anterior al día de pago';
            }

            if (date.approval_day <= date.cutoff_day || date.approval_day >= date.payment_day) {
                return 'El día de aprobación debe estar entre el día de corte y el día de pago';
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            return;
        }

        if (formData.dates.length === 0) {
            setError('Debe agregar al menos una fecha de pago');
            return;
        }

        const dateError = validateDates(formData.dates);
        if (dateError) {
            setError(dateError);
            return;
        }

        setLoading(true);

        try {
            if (calendar) {
                await axiosClient.put(`/payment-calendars/${calendar.id}`, formData);
            } else {
                await axiosClient.post('/payment-calendars', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el calendario');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {calendar ? 'Editar Calendario' : 'Nuevo Calendario'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">Fechas de Pago</h3>
                            <button
                                type="button"
                                onClick={addDate}
                                className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Fecha
                            </button>
                        </div>

                        {formData.dates.map((date, index) => (
                            <div key={index} className="flex gap-4 items-start mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Día de Corte</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={date.cutoff_day}
                                        onChange={(e) => handleDateChange(index, 'cutoff_day', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Día de Aprobación</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={date.approval_day}
                                        onChange={(e) => handleDateChange(index, 'approval_day', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Día de Pago</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        value={date.payment_day}
                                        onChange={(e) => handleDateChange(index, 'payment_day', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeDate(index)}
                                    className="mt-6 p-2 text-red-600 hover:text-red-900"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-500 p-4 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
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

export default PaymentCalendarModal;