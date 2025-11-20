import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <>
      <Helmet>
        <title>Configuración - Admin Eco-Pulse</title>
        <meta name="description" content="Configuración del sistema Eco-Pulse." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Configuración del Sistema</h1>
            
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Valores Base de Puntos</h3>
                <p className="text-sm text-gray-600">Configura los puntos por kg de material</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Rangos de Usuario</h3>
                <p className="text-sm text-gray-600">Define los rangos: Bronce, Plata, Oro</p>
              </div>

              <Button
                onClick={() => toast({ description: "🚧 Esta función no está implementada aún—¡pero puedes solicitarla en tu próximo prompt! 🚀" })}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;