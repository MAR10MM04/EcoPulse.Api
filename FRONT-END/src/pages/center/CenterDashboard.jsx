import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Leaf, Package, TrendingUp, ArrowLeft } from 'lucide-react';

const CenterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    navigate('/user/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Centro - Eco-Pulse</title>
        <meta name="description" content="Panel de control para centros de acopio." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-600">Panel de Centro de Acopio</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleBack} className="text-green-600 hover:text-green-700">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Entregas</h3>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Kg Procesados</h3>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Usuarios Atendidos</h3>
              <p className="text-4xl font-bold text-green-600">0</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => navigate('/center/register')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
            >
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Package className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Registrar Entrega</h3>
              <p className="text-sm text-gray-600">Registra una nueva entrega de reciclaje</p>
            </button>

            <button
              onClick={() => navigate('/center/history')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <TrendingUp className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Historial</h3>
              <p className="text-sm text-gray-600">Ver todas las entregas registradas</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterDashboard;