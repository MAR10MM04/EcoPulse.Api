import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, LogOut, Share2, Copy, Recycle, Wind, TreePine, Building, Store } from 'lucide-react';
import QRCode from 'qrcode.react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const motivationalPhrases = [
  "Cada pequeña acción cuenta para un planeta más grande.",
  "Reciclar no es una opción, es nuestro futuro.",
  "Tu esfuerzo hoy es el aire limpio de mañana.",
  "Transforma residuos en recursos. ¡Sigue así!",
  "El planeta te agradece cada vez que reciclas."
];

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [phrase] = React.useState(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
  const [userEntities, setUserEntities] = useState({ hasCenter: false, hasCommerce: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserEntities = async () => {
      if (!user?.id) return;
      
      try {
        // Verificar si tiene centro de acopio
        const centerResponse = await fetch(`/api/CentroAcopio/usuario/${user.id}`);
        const hasCenter = centerResponse.ok;

        // Verificar si tiene comercio
        const commerceResponse = await fetch(`/api/Comercio/usuario/${user.id}`);
        const hasCommerce = commerceResponse.ok;

        setUserEntities({ hasCenter, hasCommerce });
      } catch (error) {
        console.error('Error verificando entidades del usuario:', error);
        setUserEntities({ hasCenter: false, hasCommerce: false });
      } finally {
        setLoading(false);
      }
    };

    checkUserEntities();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "Tu ID de usuario ha sido copiado al portapapeles."
    });
  };

  const kgReciclados = 84;
  const co2Ahorrado = Math.round(kgReciclados * 2.5);
  const arbolesEquiv = (kgReciclados / 1000 * 17).toFixed(2);

  return (
    <>
      <Helmet>
        <title>Mi Perfil - Eco-Pulse</title>
        <meta name="description" content="Gestiona tu perfil, revisa tus estadísticas y comparte tu progreso en Eco-Pulse." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Tarjeta de Información del Usuario */}
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Avatar className="h-24 w-24 border-4 border-green-500">
                    <AvatarFallback className="text-3xl bg-green-100 text-green-700 font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Miembro desde {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Fecha no disponible'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de ID de Reciclador */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Mi ID de Reciclador</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-6">
                <div className="bg-white p-4 rounded-lg border-2 border-dashed border-green-300">
                  <QRCode value={user?.id || 'no-id'} size={128} />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <p className="text-sm text-gray-600 mb-2">Usa este QR en los centros de acopio</p>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <span className="font-mono text-gray-700 text-sm truncate">{user?.id || 'ID no disponible'}</span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(user?.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tarjeta de Impacto Ecológico */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle>Mi Impacto Ecológico</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 p-4 rounded-lg">
                  <Recycle className="w-8 h-8 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-green-700">{kgReciclados} kg</p>
                  <p className="text-sm text-gray-600">Reciclados</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Wind className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-700">{co2Ahorrado} kg</p>
                  <p className="text-sm text-gray-600">CO₂ Ahorrado</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <TreePine className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
                  <p className="text-2xl font-bold text-emerald-700">{arbolesEquiv}</p>
                  <p className="text-sm text-gray-600">Árboles Equiv.</p>
                </div>
              </CardContent>
            </Card>

            {/* Panel de Administración - SOLO si el usuario tiene entidades */}
            {!loading && (userEntities.hasCenter || userEntities.hasCommerce) && (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Mis Puntos de Gestión</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userEntities.hasCenter && (
                      <Button 
                        onClick={() => navigate('/center/dashboard')}
                        className="h-24 flex flex-col gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 transform hover:scale-105"
                      >
                        <Building className="w-8 h-8" />
                        <span className="font-semibold">Administrar Centro de Reciclaje</span>
                      </Button>
                    )}
                    {userEntities.hasCommerce && (
                      <Button 
                        onClick={() => navigate('/commerce/dashboard')}
                        className="h-24 flex flex-col gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white transition-all duration-300 transform hover:scale-105"
                      >
                        <Store className="w-8 h-8" />
                        <span className="font-semibold">Administrar EcoMerts</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Frase Motivacional */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg text-center">
              <p className="font-semibold italic">"{phrase}"</p>
            </div>
            
            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button 
                onClick={() => toast({ 
                  title: "Función en desarrollo",
                  description: "🚧 La función de compartir perfil estará disponible pronto 🚀" 
                })} 
                variant="outline" 
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir mi Perfil
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;