import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Recycle, Plus, Phone } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCentros } from '../../Service/CentroServices';

import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RecyclingMap = () => {
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const data = await getCentros();
        setCenters(data);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    fetchCenters();
  }, []);

  return (
    <>
      <Helmet>
        <title>Mapa de Centros - Eco-Pulse</title>
        <meta name="description" content="Encuentra centros de reciclaje cerca de ti." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/user/dashboard')}
              className="text-green-700 hover:text-green-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />

              Volver al Dashboard
            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => navigate('/center/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Centro
            </Button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Mapa de Centros de Reciclaje</h1>

            <div className="flex gap-2 mb-4 flex-wrap">
              <Button
                variant={selectedMaterial === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedMaterial('all')}
                size="sm"
              >
                Todos
              </Button>
              {/* Material filters are kept but currently don't filter as backend data might not have materials yet */}
              <Button
                variant={selectedMaterial === 'plastic' ? 'default' : 'outline'}
                onClick={() => setSelectedMaterial('plastic')}
                size="sm"
              >
                Plástico
              </Button>
              <Button
                variant={selectedMaterial === 'paper' ? 'default' : 'outline'}
                onClick={() => setSelectedMaterial('paper')}
                size="sm"
              >
                Papel
              </Button>
              <Button
                variant={selectedMaterial === 'glass' ? 'default' : 'outline'}
                onClick={() => setSelectedMaterial('glass')}
                size="sm"
              >
                Vidrio
              </Button>
            </div>

            <div className="h-96 rounded-xl overflow-hidden border-2 border-green-200">
              <MapContainer center={[18.186356, -91.041947]} zoom={10} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {centers.map(center => (
                  <Marker key={center.IdCentroAcopio} position={[center.Latitud, center.Longitud]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-green-700">{center.Nombre}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Phone className="w-3 h-3" />
                          {center.Telefono}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {center.HorarioAtencion}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centers.map(center => (
              <div key={center.IdCentroAcopio} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{center.Nombre}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-green-600" />
                  {center.Telefono}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  {center.HorarioAtencion}
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Cómo llegar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecyclingMap;