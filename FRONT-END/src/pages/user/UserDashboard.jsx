import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// ⚠ REVISA Y AJUSTA ESTA RUTA SI ES NECESARIO
import { useAuth } from '../../hooks/useAuth'; 
// IMPORTACIONES DE UI AJUSTADAS A RELATIVAS
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
// Asegúrate de que 'lucide-react', 'framer-motion' y 'react-helmet' estén instalados
import { Leaf, MapPin, Package, Award, TrendingUp, Calendar, Box, Landmark } from 'lucide-react'; 

// 🔑 NUEVA IMPORTACIÓN: Se importa el componente de tabla real
import LatestDeliveriesTable from './LatestDeliveriesTable'; 

// 1. COMPONENTE DE TABLA SIMULADO (ELIMINADO / COMENTADO)
/*
const LatestDeliveriesTable = ({ navigate }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg h-full border border-dashed border-gray-300">
      <Package className="w-12 h-12 text-gray-400 mb-3" />
      <p className="text-gray-600 mb-4">Aún no has registrado entregas</p>
      <button
        onClick={() => navigate('/user/register-delivery')}
        className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-colors"
      >
        Registrar primera entrega
      </button>
    </div>
  );
};
*/

const UserDashboard = () => {
  const navigate = useNavigate();
  // Se asume que useAuth devuelve un objeto con user y user?.name
  const { user } = useAuth() || {}; // Añadido || {} para mayor seguridad en caso de que useAuth devuelva undefined

 
  // Funciones auxiliares
  const getRankColor = (rank) => {
    switch (rank) {
      case 'Oro': return 'from-yellow-400 to-yellow-600';
      case 'Plata': return 'from-gray-300 to-gray-500';
      default: return 'from-orange-400 to-orange-600';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const nameString = String(name);
    return nameString.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  return (
    <>
      <Helmet>
        <title>Mi Dashboard - Eco-Pulse</title>
        <meta name="description" content="Gestiona tus puntos, entregas y recompensas en Eco-Pulse." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Cabecera del Dashboard (Fila 0) */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Hola, {user?.name || 'Usuario'} 👋</h1>
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

          {/* Fila 1: Eco-Puntos y Rango Actual (2 columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Tarjeta de Eco-Puntos */}
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

            {/* Tarjeta de Rango Actual */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              // 🔑 CORRECCIÓN DE SINTAXIS: Se añaden los backticks (comillas inversas)
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

          {/* Fila 2: Acciones Rápidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Tarjeta de Acción 1: Registrar Entrega */}
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

            {/* Tarjeta de Acción 2: Eco-Market */}
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

            {/* Tarjeta de Acción 3: Mapa de Centros */}
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

          {/* Fila 3: Bloque Unificado de Últimas Entregas y Tu Impacto */}
          <div className="grid grid-cols-1 gap-6">
            
            {/* Contenedor Principal: Últimas Entregas + Historial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <div className='flex justify-between items-center mb-4'>
                <h3 className="text-xl font-semibold text-gray-800">Actividad Reciente</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/user/deliveries')}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Ver historial completo
                </Button>
              </div>
              
              {/* 🎯 INSERCIÓN DE LA TABLA REAL */}
              <LatestDeliveriesTable />
              
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;