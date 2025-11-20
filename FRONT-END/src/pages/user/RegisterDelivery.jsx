import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const RegisterDelivery = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    center: '',
    material: '',
    weight: ''
  });

  const handleSubmit = () => {
    if (!formData.center || !formData.material || !formData.weight) {
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
      description: `Has ganado ${points} Eco-Puntos`
    });

    setTimeout(() => navigate('/user/dashboard'), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Registrar Entrega - Eco-Pulse</title>
        <meta name="description" content="Registra tu entrega de reciclaje y gana puntos." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/user/dashboard')}
            className="mb-4 text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Registrar Entrega</h1>

            <div className="flex justify-between mb-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                  </div>
                  {s < 3 && <div className={`w-20 h-1 ${step > s ? 'bg-green-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Paso 1: Seleccionar Centro</h2>
                <div className="space-y-2">
                  <Label>Centro de Acopio</Label>
                  <Select value={formData.center} onValueChange={(value) => setFormData({...formData, center: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un centro" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="centro1">Centro Eco-Verde</SelectItem>
                      <SelectItem value="centro2">Recicladora del Norte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setStep(2)} className="w-full bg-green-600 hover:bg-green-700">
                  Continuar
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Paso 2: Material y Peso</h2>
                <div className="space-y-2">
                  <Label>Tipo de Material</Label>
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
                  <Label>Peso (kg)</Label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                    Atrás
                  </Button>
                  <Button onClick={() => setStep(3)} className="flex-1 bg-green-600 hover:bg-green-700">
                    Continuar
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Paso 3: Confirmar Entrega</h2>
                <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                  <h3 className="font-semibold mb-4">Resumen de Entrega</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Centro:</span> Centro Eco-Verde</p>
                    <p><span className="font-semibold">Material:</span> {formData.material}</p>
                    <p><span className="font-semibold">Peso:</span> {formData.weight} kg</p>
                    <p className="text-lg font-bold text-green-600 mt-4">
                      Puntos a ganar: {parseInt(formData.weight || 0) * 10}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                    Atrás
                  </Button>
                  <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                    Confirmar Entrega
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterDelivery;