import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { LogOut, Menu } from 'lucide-react';

const ProtectedLayout = () => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="h-16 flex items-center justify-between px-4">
                    <div className="flex items-center">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-md hover:bg-gray-100"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="ml-4 text-xl font-semibold">DocuFlux</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{user?.full_name}</span>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`w-64 bg-white shadow-sm ${sidebarOpen ? '' : 'hidden'}`}>
                    <nav className="mt-5 px-2">
                        {/* Aquí irán los enlaces de navegación según el rol del usuario */}
                    </nav>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;