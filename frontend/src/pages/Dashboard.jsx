import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/authSlice';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
                        {/*<div className="flex items-center space-x-4">
                            <span className="text-gray-600">{user?.full_name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Cerrar Sesión
                            </button>
                        </div>*/} 
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        Bienvenido, {user?.full_name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Información del Usuario */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Información del Usuario</h3>
                            <p className="text-sm text-gray-600">Email: {user?.email}</p>
                            <p className="text-sm text-gray-600">Rol: {user?.role}</p>
                        </div>

                        {/* Estadísticas o información adicional pueden ir aquí */}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;