import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { 
    LogOut, 
    Menu as MenuIcon,
    Users,
    Building2,
    Truck,
    LayoutDashboard,
    Settings // Añadimos el ícono de Settings
} from 'lucide-react';

const AdminLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [configurationOpen, setConfigurationOpen] = useState(false); // Nuevo estado para el menú de configuración

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const menuItems = [
        {
            title: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            path: '/dashboard'
        },
        {
            title: 'Configuración', // Cambiamos la estructura del menú
            icon: <Settings className="w-5 h-5" />,
            isSubmenu: true,
            subItems: [
                {
                    title: 'Usuarios',
                    icon: <Users className="w-5 h-5" />,
                    path: '/dashboard/users'
                },
                {
                    title: 'Empresas',
                    icon: <Building2 className="w-5 h-5" />,
                    path: '/dashboard/companies'
                },
                {
                    title: 'Proveedores',
                    icon: <Truck className="w-5 h-5" />,
                    path: '/dashboard/providers'
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <MenuIcon className="h-6 w-6" />
                            </button>
                            <h1 className="ml-4 text-xl font-bold text-gray-900">DocuFlux</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">{user?.full_name}</span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} min-h-screen bg-white shadow-sm transition-all duration-300`}>
                <nav className="mt-5 px-2 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.title}>
                            {item.isSubmenu ? (
                                <div>
                                    <div 
                                        onClick={() => setConfigurationOpen(!configurationOpen)}
                                        className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                                    >
                                        {item.icon}
                                        {sidebarOpen && (
                                            <span className="ml-3 flex-1">{item.title}</span>
                                        )}
                                        {sidebarOpen && (
                                            <span className="ml-auto">
                                                {configurationOpen ? '▼' : '►'}
                                            </span>
                                        )}
                                    </div>
                                    {configurationOpen && sidebarOpen && (
                                        <div className="pl-4">
                                            {item.subItems.map((subItem) => (
                                                <Link
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                                >
                                                    {subItem.icon}
                                                    <span className="ml-3">{subItem.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    {item.icon}
                                    {sidebarOpen && (
                                        <span className="ml-3">{item.title}</span>
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>

                {/* Main content */}
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;