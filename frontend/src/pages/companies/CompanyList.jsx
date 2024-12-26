import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Calendar } from 'lucide-react';
import axiosClient from '../../config/axios';
import CompanyModal from './CompanyModal';
import PaymentFlowModal from './PaymentFlowModal';

const CompanyList = () => {
    const [companies, setCompanies] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentFlowModalOpen, setIsPaymentFlowModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCompanies = async () => {
        try {
            const response = await axiosClient.get('/companies');
            setCompanies(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar las empresas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleOpenModal = (company = null) => {
        setSelectedCompany(company);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCompany(null);
        setIsModalOpen(false);
    };

    const handleOpenPaymentFlowModal = (company) => {
        setSelectedCompany(company);
        setIsPaymentFlowModalOpen(true);
    };

    const handleClosePaymentFlowModal = () => {
        setSelectedCompany(null);
        setIsPaymentFlowModalOpen(false);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Empresas Receptoras</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Empresa
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
                                RUT
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Flujos de Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {companies.map((company) => (
                            <tr key={company.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {company.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {company.tax_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {company.payment_flows?.length || 0} flujos configurados
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(company)}
                                            className="text-blue-600 hover:text-blue-900"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleOpenPaymentFlowModal(company)}
                                            className="text-green-600 hover:text-green-900"
                                            title="Gestionar Flujos de Pago"
                                        >
                                            <Calendar className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <CompanyModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    company={selectedCompany}
                    onSuccess={fetchCompanies}
                />
            )}

            {isPaymentFlowModalOpen && (
                <PaymentFlowModal
                    isOpen={isPaymentFlowModalOpen}
                    onClose={handleClosePaymentFlowModal}
                    company={selectedCompany}
                    onSuccess={fetchCompanies}
                />
            )}
        </div>
    );
};

export default CompanyList;