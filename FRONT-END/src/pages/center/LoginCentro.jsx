import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Building } from 'lucide-react';
import { createCentro } from '@/Service/CentroServices';

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
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación
        if (!formData.nombre || !formData.direccion || !formData.telefono) {
            toast({
                title: "Error",
                description: "Completa todos los campos obligatorios.",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            nombre: formData.nombre,
            direccion: formData.direccion,
            telefono: formData.telefono,
            horarioAtencion: formData.horarioAtencion,
            ciudad: formData.ciudad,
            estado: formData.estado,
            idUsuario: Number(localStorage.getItem("idUsuario")) || 1, // o el que estés usando
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

                            {/* Dirección */}
                            <Field
                                label="Dirección *"
                                id="direccion"
                                value={formData.direccion}
                                onChange={e => setFormData({ ...formData, direccion: e.target.value })}
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

                            {/* Ciudad */}
                            <Field
                                label="Ciudad"
                                id="ciudad"
                                value={formData.ciudad}
                                onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                            />

                            {/* Estado */}
                            <Field
                                label="Estado"
                                id="estado"
                                value={formData.estado}
                                onChange={e => setFormData({ ...formData, estado: e.target.value })}
                            />

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

const Field = ({ label, id, value, onChange }) => (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input
            id={id}
            value={value}
            onChange={onChange}
            className="border-gray-300 focus:border-green-500"
        />
    </div>
);

export default LoginCentro;
