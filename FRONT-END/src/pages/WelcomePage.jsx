import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, Award, TrendingUp } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Bienvenido a Eco-Pulse</title>
        <meta name="description" content="Únete a Eco-Pulse y comienza a ganar puntos por reciclar. Cuida el planeta mientras obtienes recompensas." />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-full shadow-2xl">
              <Leaf className="w-20 h-20 text-white" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
          >
            Eco-Pulse
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto"
          >
            Transforma tus hábitos de reciclaje en recompensas. Gana puntos por cada entrega y canjéalos por increíbles premios.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Recycle className="w-12 h-12 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Recicla Fácil</h3>
              <p className="text-gray-600 text-sm">Encuentra centros de acopio cerca de ti</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <Award className="w-12 h-12 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Gana Puntos</h3>
              <p className="text-gray-600 text-sm">Cada kg reciclado suma puntos</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Canjea Premios</h3>
              <p className="text-gray-600 text-sm">Usa tus puntos en comercios locales</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Iniciar Sesión
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/register')}
              className="border-2 border-green-600 text-green-700 hover:bg-green-50 px-8 py-6 text-lg"
            >
              Registrarse
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default WelcomePage;