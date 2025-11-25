import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Leaf, MapPin, Package, Award, TrendingUp, User as UserIcon } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Oro': return 'from-yellow-400 to-yellow-600';
      case 'Plata': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Mi Dashboard - Eco-Pulse</title>
        <meta name="description" content="Gestiona tus puntos, entregas y recompensas en Eco-Pulse." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Hola, {user?.name} 👋</h1>
                <p className="text-gray-600">Bienvenido a tu panel de reciclaje</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-12 w-12"
              onClick={() => navigate('/user/profile')}
            >
              <Avatar className="h-10 w-10 border-2 border-green-500">
                <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Eco-Puntos</h3>
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-5xl font-bold text-green-600 mb-2">{user?.points || 0}</p>
              <p className="text-sm text-gray-600">Puntos acumulados</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`bg-gradient-to-br ${getRankColor(user?.rank)} rounded-2xl shadow-xl p-6 text-white`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rango Actual</h3>
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-4xl font-bold mb-2">{user?.rank || 'Bronce'}</p>
              <div className="bg-white/20 rounded-full h-2 mb-2">
                <div className="bg-white rounded-full h-2" style={{ width: '45%' }}></div>
              </div>
              <p className="text-sm">55% para alcanzar Plata</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              onClick={() => navigate('/user/register-delivery')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
            >
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <Package className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Registrar Entrega</h3>
              <p className="text-sm text-gray-600">Registra tu reciclaje y gana puntos</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => navigate('/user/market')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
            >
              <div className="bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors">
                <Award className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Eco-Market</h3>
              <p className="text-sm text-gray-600">Canjea tus puntos por premios</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => navigate('/user/map')}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
            >
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <MapPin className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-800">Mapa de Centros</h3>
              <p className="text-sm text-gray-600">Encuentra centros cerca de ti</p>
            </motion.button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Últimas Entregas</h3>
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Aún no has registrado entregas</p>
              <Button
                onClick={() => navigate('/user/register-delivery')}
                className="mt-4 bg-green-600 hover:bg-green-700"
              >
                Registrar primera entrega
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;