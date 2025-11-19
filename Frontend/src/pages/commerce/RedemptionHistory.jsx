import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, History, User, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

const RedemptionHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    const allRewards = JSON.parse(localStorage.getItem('eco-pulse-rewards') || '[]');
    const commerceRewards = allRewards.filter(r => r.commerceId === user.id);
    const allRedemptions = JSON.parse(localStorage.getItem('eco-pulse-redemptions') || '[]');
    const users = JSON.parse(localStorage.getItem('eco-pulse-users') || '[]');

    const commerceRedemptions = allRedemptions
      .filter(r => commerceRewards.some(cr => cr.id === r.rewardId))
      .map(redemption => {
        const rewardData = commerceRewards.find(r => r.id === redemption.rewardId);
        const userData = users.find(u => u.id === redemption.userId);
        return { ...redemption, reward: rewardData, user: userData };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    setRedemptions(commerceRedemptions);
  }, [user.id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'redeemed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Historial de Canjes - Eco-Pulse</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/commerce/dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Dashboard
          </Button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <History className="w-8 h-8 text-gray-700" />
                  Historial de Canjes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {redemptions.length > 0 ? (
                  <ul className="space-y-4">
                    {redemptions.map(item => (
                      <motion.li 
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white p-4 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                      >
                        <div className="flex-grow space-y-2">
                          <div className="flex items-center gap-2">
                            <Gift className="w-5 h-5 text-green-600" />
                            <p className="font-bold text-lg text-gray-800">{item.reward?.name || 'Recompensa eliminada'}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <p>Usuario: {item.user?.name || 'Usuario desconocido'}</p>
                          </div>
                           <p className="text-xs text-gray-500 font-mono">ID: {item.id}</p>
                        </div>
                        <div className="text-left sm:text-right w-full sm:w-auto">
                          <p className={`text-xs font-bold px-2 py-1 rounded-full inline-block ${getStatusBadge(item.status)}`}>
                            {item.status === 'pending' ? 'PENDIENTE' : 'CANJEADO'}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">{new Date(item.date).toLocaleString()}</p>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold">Sin canjes todavía</h3>
                    <p>Aquí aparecerá la lista de canjes cuando los usuarios usen sus puntos.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RedemptionHistory;