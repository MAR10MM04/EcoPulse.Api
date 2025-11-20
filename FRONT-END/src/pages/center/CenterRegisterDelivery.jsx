import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

const CenterRegisterDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    userId: '',
    material: '',
    weight: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.userId || !formData.material || !formData.weight) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    const points = parseInt(formData.weight) * 10;
    
    toast({
      title: "¡Entrega registrada!",
      description: `Se han asignado ${points} puntos al usuario`
    });

    setTimeout(() => navigate('/center/dashboard'), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Registrar Entrega - Centro Eco-Pulse</title>
        <meta name="description" content="Registra entregas de reciclaje de usuarios." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/center/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Registrar Entrega</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="userId">ID o QR del Usuario</Label>
                <Input
                  id="userId"
                  placeholder="Escanea QR o ingresa ID"
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material">Material</Label>
                <Select value={formData.material} onValueChange={(value) => setFormData({...formData, material: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plastic">Plástico</SelectItem>
                    <SelectItem value="paper">Papel</SelectItem>
                    <SelectItem value="glass">Vidrio</SelectItem>
                    <SelectItem value="metal">Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
              </div>

              {formData.weight && (
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-gray-600">Puntos a asignar:</p>
                  <p className="text-2xl font-bold text-green-600">{parseInt(formData.weight) * 10} puntos</p>
                </div>
              )}

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg">
                Registrar Entrega
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CenterRegisterDelivery;