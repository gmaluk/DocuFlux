import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import axiosClient from '../config/axios';
import { setCredentials } from '../store/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Redireccionar si ya está autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axiosClient.post('/auth/login', {
        email,
        password
      });

      dispatch(setCredentials(response.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6 animate-fade-in">
        {/* Logo y Nombre de la Aplicación */}
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-full">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">DocuFlux</h1>
          <p className="text-gray-500">Sistema de Aprobación de Documentos</p>
        </div>

        {/* Formulario de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Ingrese su correo electrónico"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Ingrese su contraseña"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Pie de página */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 DocuFlux. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;