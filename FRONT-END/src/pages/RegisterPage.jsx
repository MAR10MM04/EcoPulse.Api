import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Leaf, ArrowLeft, User } from 'lucide-react';
import { createUsuario } from '@/Service/UsuarioService';


const RegisterPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    try {
      // Preparar datos para la API (solo los campos requeridos)
      const usuarioData = {
        Nombre: formData.name,
        Email: formData.email,
        Password: formData.password
      };

      // Llamar al servicio para crear el usuario en la base de datos
      await createUsuario(usuarioData);

      toast({
        title: "¡Cuenta creada!",
        description: "Tu cuenta ha sido creada exitosamente en nuestra base de datos. Ahora puedes iniciar sesión."
      });

      // Redirigir al login después del registro exitoso
      setTimeout(() => navigate('/login'), 1500);

    } catch (error) {
      console.error('Error al crear usuario:', error);
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al crear la cuenta. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Registro - Eco-Pulse</title>
        <meta name="description" content="Crea tu cuenta en Eco-Pulse y comienza a reciclar para ganar puntos." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full">
                <Leaf className="w-12 h-12 text-white" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Crear Cuenta</h2>
            <p className="text-center text-gray-600 mb-8">Únete a la comunidad Eco-Pulse</p>

            <div className="mb-8 flex justify-center">
              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-4 inline-flex items-center">
                <User className="w-8 h-8 text-green-600 mr-3" />
                <p className="font-semibold text-sm">Cuenta de Usuario</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo *</Label>
                <Input
                  id="name"
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-gray-300 focus:border-green-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-300 focus:border-green-500"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="border-gray-300 focus:border-green-500"
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>



              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </>
                ) : (
                  'Crear Cuenta'
                )}
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Inicia sesión aquí
                </button>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default RegisterPage;