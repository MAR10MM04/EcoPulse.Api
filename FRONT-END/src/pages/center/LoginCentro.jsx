import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Building, MapPin } from 'lucide-react';
import { createCentro } from '@/service/CentroServices';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
const LocationMarker = ({ position, setPosition }) => {
    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position ? <Marker position={position} /> : null;
};

const LoginCentro = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        telefono: "",
        horarioAtencion: "",
        ciudad: "",
        estado: "",
        latitud: "",
        longitud: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación
        if (!formData.nombre || !formData.telefono) {
            toast({
                title: "Error",
                description: "Completa todos los campos obligatorios.",
                variant: "destructive",
            });
            return;
        }

        let userId = 0;
        try {
            const storedUser = localStorage.getItem("eco-pulse-user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                userId = Number(parsedUser.id);
            }
        } catch (error) {
            console.error("Error getting user ID:", error);
        }

        const payload = {
            Nombre: formData.nombre,
            Telefono: formData.telefono,
            HorarioAtencion: formData.horarioAtencion || "",
            IdUsuario: userId,
            Latitud: formData.latitud || "0",
            Longitud: formData.longitud || "0"
        };

        try {
            await createCentro(payload);

            toast({
                title: "Centro registrado",
                description: "El centro de acopio se registró correctamente.",
            });

            setTimeout(() => navigate("/login"), 1500);

        } catch (error) {
            toast({
                title: "Error al registrar",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const setMapPosition = (latlng) => {
        setFormData(prev => ({
            ...prev,
            latitud: latlng.lat,
            longitud: latlng.lng
        }));
    };

    const mapCenter = [18.186356, -91.041947];
    const currentPosition = formData.latitud && formData.longitud
        ? [formData.latitud, formData.longitud]
        : null;

    return (
        <>
            <Helmet>
                <title>Registrar Centro de Acopio</title>
            </Helmet>

            <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-white py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-2xl"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="mb-4 text-green-700 hover:text-green-800"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver
                    </Button>

                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-full">
                                <Building className="w-12 h-12 text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
                            Registrar Centro de Acopio
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Nombre */}
                            <Field
                                label="Nombre del centro *"
                                id="nombre"
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            />

                            {/* Teléfono */}
                            <Field
                                label="Teléfono *"
                                id="telefono"
                                value={formData.telefono}
                                onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                            />

                            {/* Horario Atencion */}
                            <Field
                                label="Horario de atención"
                                id="horarioAtencion"
                                value={formData.horarioAtencion}
                                onChange={e => setFormData({ ...formData, horarioAtencion: e.target.value })}
                            />

                            {/* Mapa para Latitud y Longitud */}
                            <div className="space-y-2">
                                <Label>Ubicación del Centro (Selecciona en el mapa) *</Label>
                                <div className="h-96 rounded-xl overflow-hidden border-2 border-green-200 relative z-0">
                                    <MapContainer
                                        center={mapCenter}
                                        zoom={13}
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker
                                            position={currentPosition}
                                            setPosition={setMapPosition}
                                        />
                                    </MapContainer>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold">Latitud:</span> {formData.latitud || "No seleccionada"}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold">Longitud:</span> {formData.longitud || "No seleccionada"}
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-4">
                                * Campos obligatorios
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg shadow-lg"
                            >
                                Registrar Centro de Acopio
                            </Button>

                        </form>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

const Field = ({ label, id, value, onChange, type = "text", placeholder = "", ...props }) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="border-gray-300 focus:border-green-500"
            {...props}
        />
    </div>
);

export default LoginCentro;