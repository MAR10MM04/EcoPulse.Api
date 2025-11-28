import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';

// 👇 importa tu servicio EXISTENTE
import { getEntregas } from '@/Service/EntregaService'; 
// si tu carpeta es "services" en vez de "Service", usa:
// import { getEntregas } from '@/services/EntregaService';

const CenterHistory = () => {
  const navigate = useNavigate();

  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar historial al entrar a la pantalla
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEntregas(); // 👈 usa tu GET del controlador
        setEntregas(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error al cargar el historial.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Helmet>
        <title>Historial - Centro Eco-Pulse</title>
        <meta
          name="description"
          content="Historial de entregas del centro de acopio."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/center/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              Historial de Entregas
            </h1>

            {loading && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Cargando historial...</p>
              </div>
            )}

            {!loading && error && (
              <div className="text-center py-12 text-red-500">
                <p className="text-lg">⚠ {error}</p>
              </div>
            )}

            {!loading && !error && entregas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No hay entregas registradas</p>
              </div>
            )}

            {!loading && !error && entregas.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                        Fecha
                      </th>
                      <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                        Usuario
                      </th>
                      <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                        Material
                      </th>
                      <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                        Centro
                      </th>
                      <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                        Cantidad (kg)
                      </th>
                      <th className="px-4 py-3 border-b text-gray-700 font-semibold">
                        Puntos
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entregas.map((entrega) => (
                      <tr
                        key={entrega.IdEntrega}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 border-b">
                          {formatDate(entrega.FechaEntrega)}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {entrega.Usuario}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {entrega.Material}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {entrega.CentroAcopio}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {entrega.Cantidad}
                        </td>
                        <td className="px-4 py-3 border-b text-green-700 font-semibold">
                          {entrega.PuntosGenerados}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterHistory;
