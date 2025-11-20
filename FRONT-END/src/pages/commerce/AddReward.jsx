import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Gift, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const AddReward = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: '',
    image: ''
  });

  useEffect(() => {
    if (isEditing) {
      const rewards = JSON.parse(localStorage.getItem('eco-pulse-rewards') || '[]');
      const rewardToEdit = rewards.find(r => r.id === id);
      if (rewardToEdit) {
        setFormData(rewardToEdit);
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.points) {
      toast({ title: "Error", description: "Todos los campos son obligatorios.", variant: "destructive" });
      return;
    }

    const allRewards = JSON.parse(localStorage.getItem('eco-pulse-rewards') || '[]');
    
    if (isEditing) {
      const updatedRewards = allRewards.map(r => r.id === id ? { ...formData } : r);
      localStorage.setItem('eco-pulse-rewards', JSON.stringify(updatedRewards));
      toast({ title: "¡Éxito!", description: "Recompensa actualizada correctamente." });
    } else {
      const newReward = {
        ...formData,
        id: `reward-${Date.now()}`,
        commerceId: user.id,
      };
      allRewards.push(newReward);
      localStorage.setItem('eco-pulse-rewards', JSON.stringify(allRewards));
      toast({ title: "¡Éxito!", description: "Recompensa creada correctamente." });
    }
    navigate('/commerce/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar' : 'Agregar'} Recompensa - Eco-Pulse</title>
      </Helmet>
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/commerce/dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Gift className="w-8 h-8 text-green-600" />
                  {isEditing ? 'Editar Recompensa' : 'Agregar Nueva Recompensa'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre de la recompensa</Label>
                    <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej: Café gratis" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe el premio o descuento." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points">Puntos requeridos</Label>
                    <Input id="points" type="number" value={formData.points} onChange={e => setFormData({...formData, points: e.target.value})} placeholder="Ej: 500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image">URL de la Imagen (Opcional)</Label>
                    <div className="flex items-center gap-2">
                      <ImageIcon className="text-gray-400" />
                      <Input id="image" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://ejemplo.com/imagen.jpg" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                    {isEditing ? 'Guardar Cambios' : 'Guardar Recompensa'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AddReward;