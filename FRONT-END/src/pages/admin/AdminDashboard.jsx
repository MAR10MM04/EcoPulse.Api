import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Users, Building, TrendingUp, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const data = [
    { name: 'Ene', entregas: 0 },
    { name: 'Feb', entregas: 0 },
    { name: 'Mar', entregas: 0 },
    { name: 'Abr', entregas: 0 }
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - Eco-Pulse</title>
        <meta name="description" content="Panel de administración de Eco-Pulse." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
                <p className="text-gray-600">Bienvenido, {user?.name}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-5 h-5 mr-2" />
              Salir
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Usuarios</h3>
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Centros</h3>
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Entregas</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Puntos</h3>
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Entregas por Mes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="entregas" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
            >
              <Users className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Gestión de Usuarios</h3>
              <p className="text-sm text-gray-600">Administra usuarios del sistema</p>
            </button>

            <button
              onClick={() => navigate('/admin/reports')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
            >
              <TrendingUp className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Reportes</h3>
              <p className="text-sm text-gray-600">Genera reportes y estadísticas</p>
            </button>

            <button
              onClick={() => navigate('/admin/settings')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left"
            >
              <Leaf className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Configuración</h3>
              <p className="text-sm text-gray-600">Ajustes del sistema</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;