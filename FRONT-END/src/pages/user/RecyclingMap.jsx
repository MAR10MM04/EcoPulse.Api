import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, Plus, Phone, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { getCentros } from '../../Service/CentroServices';
import L from 'leaflet';

// Corregir iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para recentrar el mapa cuando se obtenga la ubicación
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

const RecyclingMap = () => {
  const navigate = useNavigate();
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [centers, setCenters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // 1. Obtener centros desde el servicio
    const fetchCenters = async () => {
      try {
        const data = await getCentros();
        setCenters(data);
      } catch (error) {
        console.error("Error fetching centers:", error);
      }
    };

    // 2. Obtener ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => console.log("Ubicación denegada")
      );
    }

    fetchCenters();
  }, []);

  // Función para trazar ruta (Abre Google Maps externo)
  const handleGetDirections = (lat, lng) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>Mapa de Centros - Eco-Pulse</title>
      </Helmet>

      <div className="min-h-screen bg-[#f0f9f4] p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Botones Superiores */}
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/user/dashboard')}
              className="text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Panel Principal
            </Button>

            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg rounded-xl"
              onClick={() => navigate('/center/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Registrar Centro
            </Button>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-6 mb-8">
            <h1 className="text-3xl font-black mb-6 text-slate-800">Centros Cercanos</h1>

            {/* Filtros */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['all', 'plastic', 'paper', 'glass'].map((mat) => (
                <Button
                  key={mat}
                  variant={selectedMaterial === mat ? 'default' : 'outline'}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`rounded-full px-6 font-bold uppercase text-xs tracking-widest ${selectedMaterial === mat ? 'bg-emerald-600 shadow-emerald-200' : ''
                    }`}
                >
                  {mat === 'all' ? 'Todos' : mat}
                </Button>
              ))}
            </div>

            {/* Mapa */}
            <div className="h-[450px] rounded-[2rem] overflow-hidden border-8 border-slate-50 shadow-inner relative">
              <MapContainer
                center={userLocation || [18.186356, -91.041947]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" // Estilo de mapa más limpio
                  attribution='&copy; OpenStreetMap contributors'
                />

                <RecenterMap coords={userLocation} />

                {/* Marcador del Usuario */}
                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>Estás aquí</Popup>
                  </Marker>
                )}

                {/* Marcadores de Centros */}
                {centers.map(center => (
                  <Marker key={center.IdCentroAcopio} position={[center.Latitud, center.Longitud]}>
                    <Popup className="rounded-2xl">
                      <div className="p-1">
                        <h3 className="font-bold text-slate-800">{center.Nombre}</h3>
                        <p className="text-xs text-slate-500 mb-2">{center.HorarioAtencion}</p>
                        <Button
                          size="sm"
                          className="w-full h-8 bg-emerald-600 text-[10px] font-bold"
                          onClick={() => handleGetDirections(center.Latitud, center.Longitud)}
                        >
                          TRAZAR RUTA
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Tarjetas de Centros */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map(center => (
              <div key={center.IdCentroAcopio} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>

                <h3 className="font-black text-xl mb-3 text-slate-800">{center.Nombre}</h3>

                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    {center.Telefono}
                  </p>
                  <p className="text-sm text-slate-500 flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    {center.HorarioAtencion}
                  </p>
                </div>

                <Button
                  onClick={() => handleGetDirections(center.Latitud, center.Longitud)}
                  className="w-full bg-slate-800 hover:bg-emerald-600 text-white rounded-xl py-6 font-bold transition-all"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Ir al centro
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