import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import axiosClient from '../../config/axios';

const PaymentFlowModal = ({ isOpen, onClose, company, onSuccess }) => {
    const [paymentFlows, setPaymentFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newFlow, setNewFlow] = useState({
        payment_day: '',
        cutoff_day: '',
        approval_day: ''
    });

    const fetchPaymentFlows = async () => {
        try {
            const response = await axiosClient.get(`/companies/${company.id}/payment-flows`);
            setPaymentFlows(response.data);
            setError('');
        } catch (err) {
            setError('Error al cargar los flujos de pago');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (company) {
            fetchPaymentFlows();
        }
    }, [company]);

    const validateDays = (flow) => {
        const paymentDay = parseInt(flow.payment_day);
        const cutoffDay = parseInt(flow.cutoff_day);
        const approvalDay = parseInt(flow.approval_day);

        if (paymentDay < 1 || paymentDay > 31 ||
            cutoffDay < 1 || cutoffDay > 31 ||
            approvalDay < 1 || approvalDay > 31) {
            return 'Los días deben estar entre 1 y 31';
        }

        if (cutoffDay >= paymentDay) {
            return 'El día de corte debe ser anterior al día de pago';
        }

        if (approvalDay <= cutoffDay || approvalDay >= paymentDay) {
            return 'El día de aprobación debe estar entre el día de corte y el día de pago';
        }

        return null;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewFlow(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddFlow = async (e) => {
        e.preventDefault();
        
        const validationError = validateDays(newFlow);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await axiosClient.post(`/companies/${company.id}/payment-flows`, newFlow);
            await fetchPaymentFlows();
            setNewFlow({
                payment_day: '',
                cutoff_day: '',
                approval_day: ''
            });
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al agregar el flujo de pago');
        }
    };

    const handleDeleteFlow = async (flowId) => {
        try {
            await axiosClient.delete(`/companies/${company.id}/payment-flows/${flowId}`);
            await fetchPaymentFlows();
            setError('');
        } catch (err) {
            setError('Error al eliminar el flujo de pago');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Flujos de Pago - {company.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Formulario para agregar nuevo flujo */}
                    <form onSubmit={handleAddFlow} className="mb-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Día de Corte
                                </label>
                                <input
                                    type="number"
                                    name="cutoff_day"
                                    min="1"
                                    max="31"
                                    value={newFlow.cutoff_day}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Día de Aprobación
                                </label>
                                <input
                                    type="number"
                                    name="approval_day"
                                    min="1"
                                    max="31"
                                    value={newFlow.approval_day}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Día de Pago
                                </label>
                                <input
                                    type="number"
                                    name="payment_day"
                                    min="1"
                                    max="31"
                                    value={newFlow.payment_day}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Flujo
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mb-4 bg-red-50 text-red-500 p-4 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* Lista de flujos existentes */}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Flujos de Pago Configurados
                        </h3>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            </div>
                        ) : paymentFlows.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">
                                No hay flujos de pago configurados
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Día de Corte
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Día de Aprobación
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Día de Pago
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paymentFlows.map((flow) => (
                                            <tr key={flow.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {flow.cutoff_day}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {flow.approval_day}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {flow.payment_day}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleDeleteFlow(flow.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFlowModal;