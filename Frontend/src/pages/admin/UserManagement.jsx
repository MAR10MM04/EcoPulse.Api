import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

const UserManagement = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Gestión de Usuarios - Admin Eco-Pulse</title>
        <meta name="description" content="Administra los usuarios de Eco-Pulse." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Usuarios</h1>
            
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No hay usuarios registrados</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserManagement;