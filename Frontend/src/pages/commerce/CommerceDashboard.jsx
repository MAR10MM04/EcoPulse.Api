import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, LogOut, PlusCircle, QrCode, History, Award, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const CommerceDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    const allRewards = JSON.parse(localStorage.getItem('eco-pulse-rewards') || '[]');
    const commerceRewards = allRewards.filter(r => r.commerceId === user.id);
    setRewards(commerceRewards);

    const allRedemptions = JSON.parse(localStorage.getItem('eco-pulse-redemptions') || '[]');
    const commerceRedemptions = allRedemptions.filter(r => commerceRewards.some(cr => cr.id === r.rewardId));
    setRedemptions(commerceRedemptions);
  }, [user.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <Helmet>
        <title>Dashboard Comercio - Eco-Pulse</title>
        <meta name="description" content="Panel de control para comercios locales." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                <p className="text-gray-600">Panel de Comercio Local</p>
              </div>
            </div>
            <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              <LogOut className="w-5 h-5 mr-2" />
              Salir
            </Button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Recompensas Ofrecidas</h3>
                <p className="text-4xl font-bold text-green-600">{rewards.length}</p>
              </div>
              <Award className="w-10 h-10 text-green-300" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Canjes Pendientes</h3>
                <p className="text-4xl font-bold text-yellow-600">{redemptions.filter(r => r.status === 'pending').length}</p>
              </div>
              <Gift className="w-10 h-10 text-yellow-300" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2">Canjes Realizados</h3>
                <p className="text-4xl font-bold text-blue-600">{redemptions.filter(r => r.status === 'redeemed').length}</p>
              </div>
              <History className="w-10 h-10 text-blue-300" />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.button whileHover={{ y: -5 }} onClick={() => navigate('/commerce/add-reward')} className="lg:col-span-1 bg-green-600 text-white rounded-xl shadow-lg p-6 text-left flex items-center gap-4">
              <PlusCircle className="w-10 h-10" />
              <div>
                <h3 className="font-bold text-xl">Agregar Recompensa</h3>
                <p className="text-sm opacity-90">Crea nuevos premios para tus clientes</p>
              </div>
            </motion.button>
            <motion.button whileHover={{ y: -5 }} onClick={() => navigate('/commerce/validate')} className="lg:col-span-1 bg-blue-600 text-white rounded-xl shadow-lg p-6 text-left flex items-center gap-4">
              <QrCode className="w-10 h-10" />
              <div>
                <h3 className="font-bold text-xl">Validar Canje</h3>
                <p className="text-sm opacity-90">Escanea el QR de un usuario</p>
              </div>
            </motion.button>
             <motion.button whileHover={{ y: -5 }} onClick={() => navigate('/commerce/history')} className="lg:col-span-1 bg-gray-700 text-white rounded-xl shadow-lg p-6 text-left flex items-center gap-4">
              <History className="w-10 h-10" />
              <div>
                <h3 className="font-bold text-xl">Historial de Canjes</h3>
                <p className="text-sm opacity-90">Revisa todos los canjes</p>
              </div>
            </motion.button>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Mis Recompensas Activas</CardTitle>
            </CardHeader>
            <CardContent>
              {rewards.length > 0 ? (
                <ul className="space-y-4">
                  {rewards.slice(0, 3).map(reward => (
                    <li key={reward.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{reward.name}</p>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{reward.points} Puntos</p>
                        <Button variant="link" size="sm" onClick={() => navigate(`/commerce/edit-reward/${reward.id}`)}>Editar</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Aún no has creado recompensas.</p>
                  <p className="text-sm mt-2">¡Anímate a crear la primera!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CommerceDashboard;