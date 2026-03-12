import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Plus, ChevronRight, History } from 'lucide-react';

const DeliveryHistory = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Historial de Entregas - Eco-Pulse</title>
        <meta name="description" content="Revisa tu historial de entregas de reciclaje." />
      </Helmet>

      <div className="min-h-screen bg-[#f0f9f4] p-4 md:p-8 text-slate-800">
        <div className="max-w-4xl mx-auto">

          {/* Botón Volver con estilo refinado */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate('/user/dashboard')}
              className="mb-6 text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/50 rounded-xl font-bold group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al panel
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
          >
            {/* Cabecera de la Tarjeta */}
            <div className="p-8 pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600 shadow-inner">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800">Historial</h1>
                  <p className="text-slate-400 font-medium">Todas tus contribuciones al planeta</p>
                </div>
              </div>

              {/* Botón de acción rápida en la esquina */}
              <Button
                onClick={() => navigate('/user/register-delivery')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-6 py-6 shadow-lg shadow-emerald-200 font-bold transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="w-5 h-5 mr-2" />
                Nueva Entrega
              </Button>
            </div>

            <hr className="my-8 border-slate-50" />

            {/* Estado Vacío Estilizado (Efecto 3D) */}
            <div className="px-8 pb-16 text-center">
              <div className="relative inline-block mb-6">
                {/* Círculos decorativos de fondo */}
                <div className="absolute inset-0 bg-emerald-100 blur-3xl opacity-30 rounded-full scale-150"></div>

                {/* Contenedor del Icono con profundidad */}
                <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 w-32 h-32 rounded-[2rem] flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_10px_20px_rgba(0,0,0,0.05)] border border-white mx-auto">
                  <Package className="w-14 h-14 text-slate-300 drop-shadow-md" />
                </div>
              </div>

              <div className="max-w-xs mx-auto">
                <h2 className="text-xl font-bold text-slate-700 mb-2">¿Aún no has reciclado?</h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                  Parece que tu historial está descansando. ¡Es un buen momento para darle una alegría al planeta!
                </p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => navigate('/user/register-delivery')}
                    variant="outline"
                    className="border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-50 rounded-2xl font-black px-8 py-6 text-xs uppercase tracking-widest shadow-sm"
                  >
                    Empezar ahora <ChevronRight className="ml-2 w-4 h-4" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Footer decorativo de la tarjeta */}
            <div className="bg-slate-50/50 p-4 text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-300">
                Eco-Pulse Sistema de Registro Verificado
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DeliveryHistory;