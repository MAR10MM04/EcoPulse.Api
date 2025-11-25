import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth.jsx';

import WelcomePage from '@/pages/WelcomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

import UserDashboard from '@/pages/user/UserDashboard';
import RecyclingMap from '@/pages/user/RecyclingMap';
import RegisterDelivery from '@/pages/user/RegisterDelivery';
import DeliveryHistory from '@/pages/user/DeliveryHistory';
import EcoMarket from '@/pages/user/EcoMarket';
import UserProfile from '@/pages/user/UserProfile';

import CenterDashboard from '@/pages/center/CenterDashboard';
import CenterRegisterDelivery from '@/pages/center/CenterRegisterDelivery';
import CenterHistory from '@/pages/center/CenterHistory';
import MaterialsManagement from '@/pages/center/MaterialsManagement';

import CommerceDashboard from '@/pages/commerce/CommerceDashboard';
import AddReward from '@/pages/commerce/AddReward';
import ValidateRedemption from '@/pages/commerce/ValidateRedemption';
import RedemptionHistory from '@/pages/commerce/RedemptionHistory';

import { Loader2 } from 'lucide-react';

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('🔄 Estado de autenticación en App:', { 
    isAuthenticated, 
    loading, 
    user,
    hasLocalStorageUser: !!localStorage.getItem('eco-pulse-user'),
    hasLocalStorageToken: !!localStorage.getItem('eco-pulse-token')
  });

  const ProtectedRoute = ({ children }) => {
    console.log('🔒 ProtectedRoute - Estado:', { isAuthenticated, loading });
    
    if (loading) {
      console.log('⏳ ProtectedRoute: Cargando...');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {
      console.log('❌ ProtectedRoute: No autenticado, redirigiendo a login');
      return <Navigate to="/login" replace />;
    }

    console.log('✅ ProtectedRoute: Usuario autenticado, permitiendo acceso');
    return children;
  };

  const AuthRoute = ({ children }) => {
    console.log('🔐 AuthRoute - Estado:', { isAuthenticated, loading });
    
    if (loading) {
      console.log('⏳ AuthRoute: Cargando...');
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        </div>
      );
    }
    
    if (isAuthenticated) {
      console.log('✅ AuthRoute: Usuario autenticado, redirigiendo a dashboard');
      return <Navigate to="/user/dashboard" replace />;
    }
    
    console.log('🔓 AuthRoute: Usuario no autenticado, mostrando formulario');
    return children;
  };

  return (
    <>
      <Helmet>
        <title>Eco-Pulse - Recicla y Gana Puntos</title>
        <meta name="description" content="Eco-Pulse es la aplicación que te recompensa por reciclar. Gana puntos por cada entrega y canjéalos por increíbles premios." />
      </Helmet>

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />

        {/* Todas las rutas protegidas - accesibles para cualquier usuario autenticado */}
        <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/map" element={<ProtectedRoute><RecyclingMap /></ProtectedRoute>} />
        <Route path="/user/register-delivery" element={<ProtectedRoute><RegisterDelivery /></ProtectedRoute>} />
        <Route path="/user/history" element={<ProtectedRoute><DeliveryHistory /></ProtectedRoute>} />
        <Route path="/user/market" element={<ProtectedRoute><EcoMarket /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        <Route path="/center/dashboard" element={<ProtectedRoute><CenterDashboard /></ProtectedRoute>} />
        <Route path="/center/register" element={<ProtectedRoute><CenterRegisterDelivery /></ProtectedRoute>} />
        <Route path="/center/history" element={<ProtectedRoute><CenterHistory /></ProtectedRoute>} />
        <Route path="/center/materials" element={<ProtectedRoute><MaterialsManagement /></ProtectedRoute>} />

        <Route path="/commerce/dashboard" element={<ProtectedRoute><CommerceDashboard /></ProtectedRoute>} />
        <Route path="/commerce/add-reward" element={<ProtectedRoute><AddReward /></ProtectedRoute>} />
        <Route path="/commerce/edit-reward/:id" element={<ProtectedRoute><AddReward /></ProtectedRoute>} />
        <Route path="/commerce/validate" element={<ProtectedRoute><ValidateRedemption /></ProtectedRoute>} />
        <Route path="/commerce/history" element={<ProtectedRoute><RedemptionHistory /></ProtectedRoute>} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;