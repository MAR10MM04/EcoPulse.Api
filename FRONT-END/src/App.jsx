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
import LoginCentro from '@/pages/center/LoginCentro';

import CommerceDashboard from '@/pages/commerce/CommerceDashboard';
import AddReward from '@/pages/commerce/AddReward';
import ValidateRedemption from '@/pages/commerce/ValidateRedemption';
import RedemptionHistory from '@/pages/commerce/RedemptionHistory';

import { Loader2 } from 'lucide-react';

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  const ProtectedRoute = ({ children }) => {

    if (loading) {

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        </div>
      );
    }

    if (!isAuthenticated) {

      return <Navigate to="/login" replace />;
    }


    return children;
  };

  const AuthRoute = ({ children }) => {


    if (loading) {

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        </div>
      );
    }

    if (isAuthenticated) {

      return <Navigate to="/user/dashboard" replace />;
    }

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

        {/* Nueva ruta para registrar centro */}


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
        <Route path="/center/create" element={<ProtectedRoute><LoginCentro /></ProtectedRoute>} />

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