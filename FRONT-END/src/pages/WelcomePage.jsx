import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Recycle, Award, TrendingUp, CheckCircle } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Eco-Pulse | Tu Camino al Reciclaje Premiado</title>
        <meta name="description" content="Únete a Eco-Pulse y comienza a ganar puntos por reciclar." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* --- NAVBAR --- */}
        <nav className="flex justify-between items-center px-6 md:px-12 py-4 bg-white sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
            <Leaf className="w-6 h-6" />
            <span>Eco-Pulse</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Iniciar Sesión</Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/register')}>Registrarse</Button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <section className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white pt-16 pb-32 px-6 md:px-12 rounded-b-[50px]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="flex flex-col items-center text-center leading-tight mb-8">
                {/* Parte superior: Grande y destacada */}
                <span className="text-6xl md:text-8xl font-black tracking-tight block bg-white text-transparent bg-clip-text drop-shadow-sm">
                  Eco-Pulse
                </span>
                <span className="text-2xl md:text-4xl font-medium text-green-100 mt-2 block opacity-90">
                  Tu Camino al Reciclaje Premiado
                </span>
              </h1>
              <p className="text-lg md:text-xl text-green-50 mb-8 opacity-90">
                Transforma tus hábitos de reciclaje en recompensas reales. Gana puntos por cada entrega y ayuda al planeta mientras obtienes beneficios únicos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-green-700 hover:bg-slate-100 px-8 py-6 text-lg font-bold shadow-md"
                  onClick={() => navigate('/login')}
                >
                  Empezar ahora
                </Button>

                <Button
                  size="lg"
                  /* Eliminamos 'variant="outline"' para tener control total de los colores */
                  className="bg-white text-green-700 hover:bg-slate-100 px-8 py-6 text-lg font-bold shadow-md"
                  onClick={() => navigate('/register')}
                >
                  Registrarse
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="hidden md:block relative"
              initial={{ opacity: 1, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800"
                  alt="Reciclaje"
                  className="rounded-2xl shadow-inner object-cover h-[400px] w-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- CARDS (Overlap Hero) --- */}
        <section className="relative z-10 -mt-20 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Recycle, title: "Recicla Fácil", desc: "Encuentra centros de acopio cerca de ti de forma rápida." },
              { icon: Award, title: "Gana Puntos", desc: "Cada kilogramo que recicles se traduce en puntos directos." },
              { icon: TrendingUp, title: "Canjea Premios", desc: "Usa tus puntos acumulados en comercios locales aliados." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 text-center hover:translate-y-[-10px] transition-transform duration-300"
              >
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- NUEVA SECCIÓN: CÓMO FUNCIONA --- */}
        <section className="py-24 px-6 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">¿Cómo funciona?</h2>
            <p className="text-slate-600 mb-16">Sigue estos simples pasos para empezar a ganar.</p>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {[
                { step: "1", text: "Regístrate gratis" },
                { step: "2", text: "Lleva tu reciclaje" },
                { step: "3", text: "Suma tus puntos" },
                { step: "4", text: "¡Canjea y disfruta!" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-lg shadow-green-200">
                    {item.step}
                  </div>
                  <p className="font-medium text-slate-700">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* --- FOOTER SENCILLO --- */}
        <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white font-bold text-xl mb-4">
            <Leaf className="w-6 h-6 text-green-500" />
            <span>Eco-Pulse</span>
          </div>
          <p>© 2026 Eco-Pulse. Juntos por un planeta más limpio.</p>
        </footer>
      </div>
    </>
  );
};

export default WelcomePage;