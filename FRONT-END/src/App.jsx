
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

import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import Reports from '@/pages/admin/Reports';
import Settings from '@/pages/admin/Settings';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, isAuthenticated, loading } = useAuth();

  const ProtectedRoute = ({ children, allowedRoles }) => {
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
    
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      const userHome = `/${user?.role}/dashboard`;
      return <Navigate to={userHome} replace />;
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
      const userHome = `/${user.role}/dashboard`;
      return <Navigate to={userHome} replace />;
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
        
        {/* User Routes */}
        <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['user']}><UserDashboard /></ProtectedRoute>} />
        <Route path="/user/map" element={<ProtectedRoute allowedRoles={['user']}><RecyclingMap /></ProtectedRoute>} />
        <Route path="/user/register-delivery" element={<ProtectedRoute allowedRoles={['user']}><RegisterDelivery /></ProtectedRoute>} />
        <Route path="/user/history" element={<ProtectedRoute allowedRoles={['user']}><DeliveryHistory /></ProtectedRoute>} />
        <Route path="/user/market" element={<ProtectedRoute allowedRoles={['user']}><EcoMarket /></ProtectedRoute>} />
        <Route path="/user/profile" element={<ProtectedRoute allowedRoles={['user']}><UserProfile /></ProtectedRoute>} />
        
        {/* Center Routes */}
        <Route path="/center/dashboard" element={<ProtectedRoute allowedRoles={['center']}><CenterDashboard /></ProtectedRoute>} />
        <Route path="/center/register" element={<ProtectedRoute allowedRoles={['center']}><CenterRegisterDelivery /></ProtectedRoute>} />
        <Route path="/center/history" element={<ProtectedRoute allowedRoles={['center']}><CenterHistory /></ProtectedRoute>} />
        <Route path="/center/materials" element={<ProtectedRoute allowedRoles={['center']}><MaterialsManagement /></ProtectedRoute>} />
        
        {/* Commerce Routes */}
        <Route path="/commerce/dashboard" element={<ProtectedRoute allowedRoles={['commerce']}><CommerceDashboard /></ProtectedRoute>} />
        <Route path="/commerce/add-reward" element={<ProtectedRoute allowedRoles={['commerce']}><AddReward /></ProtectedRoute>} />
        <Route path="/commerce/edit-reward/:id" element={<ProtectedRoute allowedRoles={['commerce']}><AddReward /></ProtectedRoute>} />
        <Route path="/commerce/validate" element={<ProtectedRoute allowedRoles={['commerce']}><ValidateRedemption /></ProtectedRoute>} />
        <Route path="/commerce/history" element={<ProtectedRoute allowedRoles={['commerce']}><RedemptionHistory /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><Reports /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />

        {/* Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
