import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, LogOut, Share2, Copy, Recycle, Wind, TreePine, Building, Store, Loader2, RefreshCw } from 'lucide-react';
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
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = 'http://localhost:5153/api';

  const checkUserEntities = async (userId) => {
    try {
      console.log('🔍 Verificando entidades para usuario ID:', userId);
      
      if (!userId) {
        console.error('❌ No hay ID de usuario');
        return { hasCenter: false, hasCommerce: false };
      }

      let hasCenter = false;
      let hasCommerce = false;

      // Verificar si tiene centro de acopio usando el endpoint específico
      try {
        console.log('📊 Verificando centro para usuario:', userId);
        const centerResponse = await fetch(`${API_BASE_URL}/CentroAcopio/usuario/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        console.log('📊 Respuesta centro:', centerResponse.status);
        
        if (centerResponse.ok) {
          const centerData = await centerResponse.json();
          console.log('✅ Centro encontrado:', centerData);
          hasCenter = true;
        } else if (centerResponse.status === 404) {
          console.log('📭 El usuario no tiene centro de acopio registrado');
          hasCenter = false;
        } else {
          console.warn('⚠️ Error al obtener centro:', centerResponse.status, centerResponse.statusText);
          hasCenter = false;
        }
      } catch (centerError) {
        console.error('❌ Error de conexión al verificar centro:', centerError);
        hasCenter = false;
      }

      // Verificar si tiene comercio - obtener todos los comercios y filtrar
      try {
        console.log('🏪 Verificando comercios para usuario:', userId);
        const commerceResponse = await fetch(`${API_BASE_URL}/Comercio`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          }
        });
        
        console.log('🏪 Respuesta comercios:', commerceResponse.status);
        
        if (commerceResponse.ok) {
          const commerces = await commerceResponse.json();
          console.log('🏪 Comercios encontrados:', commerces);
          
          // Buscar si algún comercio pertenece a este usuario
          hasCommerce = commerces.some(commerce => {
            console.log(`Comercio ${commerce.idComercio} - Usuario: ${commerce.idUsuario} vs ${userId}`);
            return commerce.idUsuario == userId;
          });
          
          console.log('🏪 Usuario tiene comercio:', hasCommerce);
        } else {
          console.warn('⚠️ No se pudieron obtener comercios:', commerceResponse.status, commerceResponse.statusText);
          hasCommerce = false;
        }
      } catch (commerceError) {
        console.error('❌ Error de conexión al verificar comercios:', commerceError);
        hasCommerce = false;
      }

      console.log('✅ Resultados finales:', { hasCenter, hasCommerce });
      
      return { hasCenter, hasCommerce };
    } catch (error) {
      console.error('❌ Error general verificando entidades:', error);
      return { hasCenter: false, hasCommerce: false };
    }
  };

  const loadUserEntities = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔄 Cargando entidades del usuario...');
      
      if (!user?.id) {
        console.error('❌ No hay usuario o ID de usuario');
        setUserEntities({ hasCenter: false, hasCommerce: false });
        return;
      }

      const entities = await checkUserEntities(user.id);
      console.log('✅ Entidades cargadas:', entities);
      
      setUserEntities(entities);

      if (isManualRefresh) {
        toast({
          title: "Datos actualizados",
          description: "La información se ha actualizado correctamente",
        });
      }
    } catch (error) {
      console.error('❌ Error cargando entidades:', error);
      if (isManualRefresh) {
        toast({
          title: "Error de conexión",
          description: "No se pudieron verificar los permisos de administración",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUserEntities();
  }, [user?.id]);

  const handleRefresh = () => {
    loadUserEntities(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const copyToClipboard = (text) => {
    if (!text) {
      toast({
        title: "Error",
        description: "No hay ID de usuario para copiar",
        variant: "destructive"
      });
      return;
    }
    
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "Tu ID de usuario ha sido copiado al portapapeles."
    });
  };

  const kgReciclados = 84;
  const co2Ahorrado = Math.round(kgReciclados * 2.5);
  const arbolesEquiv = (kgReciclados / 1000 * 17).toFixed(2);

  const formatMemberSince = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Fecha no disponible' : date.toLocaleDateString();
    } catch {
      return 'Fecha no disponible';
    }
  };

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
            Volver al Dashboard
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
                    <h1 className="text-3xl font-bold text-gray-800">{user?.name || 'Usuario'}</h1>
                    <p className="text-gray-600">{user?.email || 'Email no disponible'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Miembro desde {formatMemberSince(user?.createdAt)}
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
                  <QRCode value={user?.id ? user.id.toString() : 'no-id'} size={128} />
                </div>
                <div className="flex-grow text-center sm:text-left">
                  <p className="text-sm text-gray-600 mb-2">Usa este QR en los centros de acopio</p>
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <span className="font-mono text-gray-700 text-sm truncate">
                      {user?.id ? user.id.toString() : 'ID no disponible'}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => copyToClipboard(user?.id?.toString())}>
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

            {/* Panel de Administración */}
            {loading ? (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Mis Puntos de Gestión</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Verificando permisos...</span>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Mis Puntos de Gestión</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleRefresh} 
                      disabled={refreshing}
                      title="Actualizar permisos"
                    >
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(userEntities.hasCenter || userEntities.hasCommerce) ? (
                      <>
                        <p className="text-sm text-gray-600 mb-4">
                          Tienes acceso a los siguientes paneles de administración:
                        </p>
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
                      </>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">No tienes centros de reciclaje o comercios asignados.</p>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-500">
                            Si crees que deberías tener acceso, contacta con administración o verifica que tus datos estén registrados en el sistema.
                          </p>
                          <p className="text-xs text-gray-400">
                            Usa el botón de actualizar para verificar cambios recientes.
                          </p>
                        </div>
                      </div>
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