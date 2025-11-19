import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { Leaf, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const users = JSON.parse(localStorage.getItem('eco-pulse-users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password && u.role === formData.role);

    if (user) {
      login(user);
      toast({
        title: "¡Bienvenido!",
        description: "Inicio de sesión exitoso"
      });
      
      switch(user.role) {
        case 'user':
          navigate('/user/dashboard');
          break;
        case 'center':
          navigate('/center/dashboard');
          break;
        case 'commerce':
          navigate('/commerce/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      toast({
        title: "Error",
        description: "Credenciales incorrectas",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Eco-Pulse</title>
        <meta name="description" content="Inicia sesión en Eco-Pulse para comenzar a reciclar y ganar puntos." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white">
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

            <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Iniciar Sesión</h2>
            <p className="text-center text-gray-600 mb-8">Bienvenido de vuelta a Eco-Pulse</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de cuenta</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="center">Centro de Acopio</SelectItem>
                    <SelectItem value="commerce">Comercio Local</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="border-gray-300 focus:border-green-500"
                />
              </div>

              <button
                type="button"
                onClick={() => toast({ description: "🚧 Esta función no está implementada aún—¡pero puedes solicitarla en tu próximo prompt! 🚀" })}
                className="text-sm text-green-600 hover:text-green-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg shadow-lg"
              >
                Entrar
              </Button>

              <p className="text-center text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                >
                  Regístrate aquí
                </button>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;