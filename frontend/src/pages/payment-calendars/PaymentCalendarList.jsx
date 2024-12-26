import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Calendar } from 'lucide-react';
import axiosClient from '../../config/axios';
import PaymentCalendarModal from './PaymentCalendarModal';

const PaymentCalendarList = () => {
    const [calendars, setCalendars] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCalendar, setSelectedCalendar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCalendars = async () => {
        try {
            const response = await axiosClient.get('/payment-calendars');
            setCalendars(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los calendarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendars();
    }, []);

    const handleOpenModal = (calendar = null) => {
        setSelectedCalendar(calendar);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCalendar(null);
        setIsModalOpen(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Calendarios de Pago</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Calendario
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fechas de Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Empresas Asignadas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {calendars.map((calendar) => (
                            <tr key={calendar.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {calendar.name}
                                </td>
                                <td className="px-6 py-4">
                                    {calendar.description}
                                </td>
                                <td className="px-6 py-4">
                                    {calendar.dates?.length || 0} fechas configuradas
                                </td>
                                <td className="px-6 py-4">
                                    {calendar.companies?.length || 0} empresas
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleOpenModal(calendar)}
                                        className="text-blue-600 hover:text-blue-900"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <PaymentCalendarModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    calendar={selectedCalendar}
                    onSuccess={fetchCalendars}
                />
            )}
        </div>
    );
};

export default PaymentCalendarList;