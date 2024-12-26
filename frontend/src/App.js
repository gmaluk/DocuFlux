import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/layouts/AdminLayout';
import UserList from './pages/users/UserList';
import CompanyList from './pages/companies/CompanyList';
import ProviderList from './pages/providers/ProviderList';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Rutas del Admin */}
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserList />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="providers" element={<ProviderList />} />
          </Route>

          <Route 
            path="/" 
            element={
              localStorage.getItem('token') 
                ? <Navigate to="/dashboard" replace /> 
                : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;