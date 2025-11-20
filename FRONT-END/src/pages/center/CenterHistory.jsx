import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

const CenterHistory = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Historial - Centro Eco-Pulse</title>
        <meta name="description" content="Historial de entregas del centro de acopio." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/center/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Entregas</h1>
            
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay entregas registradas</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterHistory;