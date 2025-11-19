import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Recycle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

  const centers = [
    {
      id: 1,
      name: 'Centro Eco-Verde',
      lat: 19.4326,
      lng: -99.1332,
      address: 'Av. Reforma 123, CDMX',
      hours: 'Lun-Vie: 8:00-18:00',
      materials: ['Plástico', 'Papel', 'Vidrio']
    },
    {
      id: 2,
      name: 'Recicladora del Norte',
      lat: 19.4426,
      lng: -99.1432,
      address: 'Calle Norte 456, CDMX',
      hours: 'Lun-Sáb: 9:00-17:00',
      materials: ['Metal', 'Electrónicos', 'Papel']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Mapa de Centros - Eco-Pulse</title>
        <meta name="description" content="Encuentra centros de reciclaje cerca de ti." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>

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
              <MapContainer center={[19.4326, -99.1332]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {centers.map(center => (
                  <Marker key={center.id} position={[center.lat, center.lng]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-green-700">{center.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {center.address}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {center.hours}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <Recycle className="w-3 h-3" />
                          {center.materials.join(', ')}
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
              <div key={center.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{center.name}</h3>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-green-600" />
                  {center.address}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-green-600" />
                  {center.hours}
                </p>
                <p className="text-sm text-gray-600 flex items-center gap-2 mb-4">
                  <Recycle className="w-4 h-4 text-green-600" />
                  {center.materials.join(', ')}
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