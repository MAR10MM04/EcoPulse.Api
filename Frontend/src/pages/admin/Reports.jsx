import React from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Download } from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <>
      <Helmet>
        <title>Reportes - Admin Eco-Pulse</title>
        <meta name="description" content="Genera reportes y estadísticas del sistema." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Reportes y Estadísticas</h1>
            
            <div className="space-y-4">
              <Button
                onClick={() => toast({ description: "🚧 Esta función no está implementada aún—¡pero puedes solicitarla en tu próximo prompt! 🚀" })}
                className="w-full justify-between bg-green-600 hover:bg-green-700"
              >
                <span>Reporte de Entregas Mensuales</span>
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => toast({ description: "🚧 Esta función no está implementada aún—¡pero puedes solicitarla en tu próximo prompt! 🚀" })}
                className="w-full justify-between bg-green-600 hover:bg-green-700"
              >
                <span>Reporte de Puntos Generados</span>
                <Download className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => toast({ description: "🚧 Esta función no está implementada aún—¡pero puedes solicitarla en tu próximo prompt! 🚀" })}
                className="w-full justify-between bg-green-600 hover:bg-green-700"
              >
                <span>Reporte de Materiales Reciclados</span>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;