// src/pages/user/LatestDeliveriesTable.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth'; 
// 🔑 RUTA CORREGIDA: Se usa 'service' (singular) y se importa la función específica
import { getEntregasByUserId } from '../../service/EntregaService'; 
import { Package, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button'; 
import { useNavigate } from 'react-router-dom';

const LatestDeliveriesTable = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // user.id es una cadena de texto (e.g., "1"), obtenida del hook useAuth
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    try {
        return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (e) {
        return dateString.split('T')[0] || 'N/A';
    }
  };

  useEffect(() => {
    const fetchDeliveries = async () => {
      // 1. Asegurarse de tener el ID de usuario
      const userId = user?.id;

      if (!userId) {
        setIsLoading(false);
        return; 
      }
      
      try {
        // 🔥 LLAMADA AL SERVICIO ESPECÍFICO
        const userDeliveries = await getEntregasByUserId(userId);
        
        // El BE ya trae solo las del usuario y ordenadas, simplificando el frontend
        setDeliveries(userDeliveries);
        setError(null);
      } catch (err) {
        console.error("Error fetching deliveries:", err);
        setError("Error al cargar las entregas. Intenta de nuevo.");
        setDeliveries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, [user]);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin text-green-500" />
        <p className='font-semibold'>Cargando tu historial de entregas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500 border border-red-200 bg-red-50 rounded-xl">
        <XCircle className="w-8 h-8 mx-auto mb-3" />
        <p className='font-semibold'>{error}</p>
      </div>
    );
  }

  // 🔑 Mostrar solo las 5 entregas más recientes
  const latestFiveDeliveries = deliveries.slice(0, 5); 

  if (latestFiveDeliveries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p className='text-lg mb-4'>Aún no has registrado entregas.</p>
        <Button
          onClick={() => navigate('/user/register-delivery')}
          className='bg-green-600 hover:bg-green-700 transition-colors'
        >
          Registrar mi primera entrega
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[20%]">Fecha</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[35%]">Material</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider w-[30%]">Centro de Acopio</th>
            <th className="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase tracking-wider w-[15%]">Cant. (kg)</th> 
            <th className="px-3 py-2 text-right text-xs font-medium text-green-700 uppercase tracking-wider w-[15%]">Puntos</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {latestFiveDeliveries.map((delivery) => (
            <tr key={delivery.IdEntrega} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                {formatDate(delivery.FechaEntrega)}
              </td>
              
              {/* Material: Usamos la propiedad .Nombre que devuelve el BE */}
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                {delivery.Material?.Nombre || delivery.Material?.nombre || 'N/A'}
              </td>
              
              {/* Centro de Acopio: Usamos la propiedad .Nombre que devuelve el BE */}
              <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">
                {delivery.CentroAcopio?.Nombre || delivery.CentroAcopio?.nombre || 'N/A'}
              </td>

              <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-semibold text-gray-800">
                {delivery.Cantidad?.toFixed(2) || '0.00'}
              </td>
              
              {/* Puntos Generados */}
              <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-green-600 font-bold">
                {delivery.PuntosGenerados}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LatestDeliveriesTable;