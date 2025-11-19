import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

const DeliveryHistory = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Historial de Entregas - Eco-Pulse</title>
        <meta name="description" content="Revisa tu historial de entregas de reciclaje." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Historial de Entregas</h1>
            
            <div className="text-center py-12 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No hay entregas registradas</p>
              <p className="text-sm mb-6">Comienza a reciclar para ver tu historial aquí</p>
              <Button
                onClick={() => navigate('/user/register-delivery')}
                className="bg-green-600 hover:bg-green-700"
              >
                Registrar primera entrega
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryHistory;