import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

const MaterialsManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <>
      <Helmet>
        <title>Gestión de Materiales - Centro Eco-Pulse</title>
        <meta name="description" content="Gestiona los materiales aceptados y sus valores de puntos." />
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
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Materiales</h1>
            
            <div className="space-y-4">
              {['Plástico', 'Papel', 'Vidrio', 'Metal'].map(material => (
                <div key={material} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-semibold">{material}</span>
                  <span className="text-green-600">10 puntos/kg</span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => toast({ description: "🚧 Esta función no está implementada aún—¡pero puedes solicitarla en tu próximo prompt! 🚀" })}
              className="w-full mt-6 bg-green-600 hover:bg-green-700"
            >
              Actualizar Valores
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialsManagement;