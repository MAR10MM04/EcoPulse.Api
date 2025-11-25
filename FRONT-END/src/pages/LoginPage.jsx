import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Leaf, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginUsuario } from '@/Service/UsuarioService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor ingresa tu email y contraseña",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Llamar al servicio de login
      const loginResponse = await loginUsuario(formData.email, formData.password);

      console.log('🔐 Respuesta completa del login:', loginResponse);

      // Verificar que la respuesta tenga la estructura esperada
      if (!loginResponse || (!loginResponse.usuarioResponse && !loginResponse.token)) {
        throw new Error('Respuesta del servidor inválida');
      }

      // Determinar de dónde vienen los datos del usuario
      const userDataFromResponse = loginResponse.usuarioResponse || loginResponse;
      
      // Transformar los datos del usuario para el contexto de autenticación
      const userData = {
        id: userDataFromResponse.idUsuario?.toString() || userDataFromResponse.IdUsuario?.toString(),
        role: (userDataFromResponse.rol || 'user').toLowerCase(),
        name: userDataFromResponse.nombre || userDataFromResponse.Nombre,
        email: userDataFromResponse.email || userDataFromResponse.Email,
        points: userDataFromResponse.puntosTotales || userDataFromResponse.PuntosTotales || 0,
        rank: getRankFromPoints(userDataFromResponse.puntosTotales || userDataFromResponse.PuntosTotales || 0),
        token: loginResponse.token
      };

      console.log('👤 Datos transformados del usuario:', userData);

      // Validar que tenemos los datos mínimos necesarios
      if (!userData.id || !userData.token) {
        throw new Error('Datos de usuario incompletos en la respuesta');
      }

      // Guardar en el contexto de autenticación
      login(userData);

      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión correctamente, ${userData.name}.`
      });

      // Pequeño delay para asegurar que el estado se actualice
      setTimeout(() => {
        // TODOS los usuarios van al mismo dashboard
        navigate('/user/dashboard', { replace: true });
      }, 100);

    } catch (error) {
      console.error('❌ Error en login:', error);
      
      let errorMessage = "Credenciales incorrectas. Por favor, verifica tu email y contraseña.";
      
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = "Error de conexión. Verifica que el servidor esté funcionando en http://localhost:5153.";
      } else if (error.message.includes('401')) {
        errorMessage = "Email o contraseña incorrectos.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Función auxiliar para determinar el rango basado en puntos
  const getRankFromPoints = (points) => {
    if (points >= 1000) return 'Oro';
    if (points >= 500) return 'Plata';
    if (points >= 100) return 'Bronce';
    return 'Novato';
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Eco-Pulse</title>
        <meta name="description" content="Inicia sesión en Eco-Pulse para comenzar a reciclar y ganar puntos." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Eco-Pulse</h1>
            <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
          </div>

          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-gray-800">Iniciar Sesión</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Correo Electrónico
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  ¿No tienes cuenta?{' '}
                  <Link
                    to="/register"
                    className="text-green-600 hover:text-green-700 font-semibold underline-offset-2 hover:underline transition-colors"
                    onClick={(e) => isLoading && e.preventDefault()}
                  >
                    Regístrate aquí
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
              onClick={(e) => isLoading && e.preventDefault()}
            >
              ← Volver al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;