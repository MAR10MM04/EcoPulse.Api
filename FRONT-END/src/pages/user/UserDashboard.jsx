import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
  Leaf, MapPin, Package, Award, TrendingUp,
  Target, ChevronRight, Store, Zap
} from 'lucide-react';

import LatestDeliveriesTable from './LatestDeliveriesTable';

// --- Mini Componente: Gráfica de tendencia simple (SVG) ---
const Sparkline = () => (
  <svg className="w-24 h-10 text-emerald-500 opacity-60" viewBox="0 0 100 40">
    <path
      d="M0 35 Q 20 10, 40 25 T 80 5 T 100 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// --- Mini Componente: Progreso Circular ---
const CircularProgress = ({ progress, rank }) => {
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="48" cy="48" r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-white/20"
        />
        <circle
          cx="48" cy="48" r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      </svg>
      <span className="absolute text-xs font-bold text-white uppercase tracking-tighter">
        {rank}
      </span>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth() || {};

  const getRankColor = (rank) => {
    switch (rank) {
      case 'Oro': return 'from-yellow-400 to-amber-600';
      case 'Plata': return 'from-slate-300 to-slate-500';
      default: return 'from-orange-500 to-red-600';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return String(name).split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <>
      <Helmet>
        <title>Mi Dashboard - Eco-Pulse</title>
      </Helmet>

      <div className="min-h-screen bg-[#f0f9f4] p-4 md:p-8 text-slate-800">
        <div className="max-w-6xl mx-auto">

          {/* Cabecera */}
          <header className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
                <Leaf className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Hola, {user?.name || 'Carlos'} 👋</h1>
                <p className="text-slate-500 font-medium">Bienvenido a tu panel de reciclaje</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/user/profile')}
              className="p-1 rounded-full bg-white shadow-md border-2 border-white hover:scale-105 transition-transform"
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </button>
          </header>

          {/* Fila 1: Puntos y Rango (Diseño 3D/Neumórfico) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">

            {/* Tarjeta Puntos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-[20px_20px_60px_#bebebe,-20px_-20px_60px_#ffffff] border border-emerald-50 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-slate-500 font-bold uppercase text-xs tracking-widest mb-1">Eco-Puntos</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-emerald-600 tracking-tighter">{user?.points || 26}</span>
                    <Sparkline />
                  </div>
                  <p className="text-slate-400 text-sm mt-4 font-medium flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +12% esta semana
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                  <Award className="w-6 h-6" />
                </div>
              </div>
            </motion.div>

            {/* Tarjeta Rango Actual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className={`bg-gradient-to-br ${getRankColor(user?.rank)} rounded-3xl p-8 shadow-xl text-white relative flex items-center justify-between overflow-hidden`}
            >
              <div className="z-10">
                <h3 className="text-white/80 font-bold uppercase text-xs tracking-widest mb-1">Rango Actual</h3>
                <p className="text-4xl font-black mb-4 tracking-tight">{user?.rank || 'Novato'}</p>
                <div className="bg-black/10 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-bold inline-block">
                  55% para alcanzar Plata
                </div>
              </div>

              <div className="z-10">
                <CircularProgress progress={55} rank={user?.rank || 'Nvt'} />
              </div>

              {/* Decoración de fondo */}
              <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
            </motion.div>
          </div>

          {/* Fila 2: Acciones Rápidas y Desafío */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

            {/* Botones de acción mejorados */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Registrar', icon: Package, color: 'bg-orange-100 text-orange-600', path: '/user/register-delivery' },
                { label: 'Eco-Market', icon: Store, color: 'bg-emerald-100 text-emerald-600', path: '/user/market' },
                { label: 'Centros', icon: MapPin, color: 'bg-blue-100 text-blue-600', path: '/user/map' },
              ].map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(item.path)}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all"
                >
                  <div className={`${item.color} p-4 rounded-2xl mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Nuevo: Tarjeta de Desafío Semanal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-emerald-500/20 rounded-2xl p-6 shadow-sm relative overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800">Desafío Semanal</h3>
              </div>
              <p className="text-sm text-slate-600 mb-4">Recicla 5kg de plástico para ganar un bonus.</p>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2">
                <div className="bg-emerald-500 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: '70%' }}></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>3.5kg / 5kg</span>
                <span className="text-emerald-600">70%</span>
              </div>
            </motion.div>
          </div>

          {/* Fila 3: Tabla de Actividad */}
          <motion.section
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8"
          >
            <div className='flex justify-between items-center mb-8'>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Actividad Reciente</h3>
                <p className="text-sm text-slate-400">Tus últimos movimientos de reciclaje</p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/user/deliveries')}
                className="rounded-xl border-emerald-100 text-emerald-600 hover:bg-emerald-50 font-bold text-xs uppercase tracking-widest"
              >
                Ver todo <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-50">
              <LatestDeliveriesTable />
            </div>
          </motion.section>

        </div>
      </div>
    </>
  );
};

export default UserDashboard;