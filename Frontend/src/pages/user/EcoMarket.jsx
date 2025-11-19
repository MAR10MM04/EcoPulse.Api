import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Award } from 'lucide-react';

const EcoMarket = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const rewards = [
    { id: 1, name: 'Descuento 10% Restaurante', points: 100, category: 'Comida' },
    { id: 2, name: 'Entrada Cine', points: 200, category: 'Entretenimiento' },
    { id: 3, name: 'Descuento 20% Tienda', points: 150, category: 'Compras' },
    { id: 4, name: 'Clase de Yoga Gratis', points: 180, category: 'Bienestar' }
  ];

  const handleRedeem = (reward) => {
    toast({
      title: "¡Recompensa canjeada!",
      description: `Has canjeado: ${reward.name}`
    });
  };

  return (
    <>
      <Helmet>
        <title>Eco-Market - Eco-Pulse</title>
        <meta name="description" content="Canjea tus puntos por increíbles recompensas." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Eco-Market</h1>
            <p className="text-gray-600">Canjea tus puntos por increíbles recompensas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map(reward => (
              <div key={reward.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <Award className="w-20 h-20 text-white" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {reward.category}
                  </span>
                  <h3 className="font-bold text-lg mt-3 mb-2 text-gray-800">{reward.name}</h3>
                  <p className="text-2xl font-bold text-green-600 mb-4">{reward.points} puntos</p>
                  <Button
                    onClick={() => handleRedeem(reward)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Canjear
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EcoMarket;