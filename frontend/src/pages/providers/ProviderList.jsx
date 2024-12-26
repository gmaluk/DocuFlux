import React, { useState, useEffect } from 'react';
import { Plus, Edit2 } from 'lucide-react';
import axiosClient from '../../config/axios';
import ProviderModal from './ProviderModal';

const ProviderList = () => {
    const [providers, setProviders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [controllers, setControllers] = useState([]);

    const fetchProviders = async () => {
        try {
            const response = await axiosClient.get('/providers');
            setProviders(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los proveedores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await axiosClient.get('/companies');
            setCompanies(response.data);
        } catch (err) {
            console.error('Error al cargar las empresas:', err);
        }
    };

    const fetchControllers = async () => {
        try {
            const response = await axiosClient.get('/users/controllers');
            setControllers(response.data);
        } catch (err) {
            console.error('Error al cargar los controllers:', err);
        }
    };

    useEffect(() => {
        fetchProviders();
        fetchCompanies();
        fetchControllers();
    }, []);

    const handleOpenModal = (provider = null) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedProvider(null);
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
                <h2 className="text-2xl font-bold text-gray-800">Proveedores</h2>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Proveedor
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
                                Empresa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Controller Asignado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {providers.map((provider) => (
                            <tr key={provider.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.tax_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.company?.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.controller?.full_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => handleOpenModal(provider)}
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
                <ProviderModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    provider={selectedProvider}
                    companies={companies}
                    controllers={controllers}
                    onSuccess={fetchProviders}
                />
            )}
        </div>
    );
};

export default ProviderList;