import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, QrCode, User, Gift, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ValidateRedemption = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState('');
  const [redemption, setRedemption] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setRedemption(null);
    const allRedemptions = JSON.parse(localStorage.getItem('eco-pulse-redemptions') || '[]');
    const foundRedemption = allRedemptions.find(r => r.id === code && r.status === 'pending');

    if (foundRedemption) {
      const users = JSON.parse(localStorage.getItem('eco-pulse-users') || '[]');
      const rewards = JSON.parse(localStorage.getItem('eco-pulse-rewards') || '[]');
      const userData = users.find(u => u.id === foundRedemption.userId);
      const rewardData = rewards.find(r => r.id === foundRedemption.rewardId);
      setRedemption({ ...foundRedemption, user: userData, reward: rewardData });
    } else {
      setError('Código no válido, ya canjeado o no encontrado.');
    }
  };

  const handleConfirm = () => {
    const allRedemptions = JSON.parse(localStorage.getItem('eco-pulse-redemptions') || '[]');
    const updatedRedemptions = allRedemptions.map(r => r.id === redemption.id ? { ...r, status: 'redeemed' } : r);
    localStorage.setItem('eco-pulse-redemptions', JSON.stringify(updatedRedemptions));
    toast({ title: "¡Canje confirmado!", description: "La recompensa ha sido marcada como canjeada." });
    navigate('/commerce/dashboard');
  };

  return (
    <>
      <Helmet>
        <title>Validar Canje - Eco-Pulse</title>
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
                  <QrCode className="w-8 h-8 text-blue-600" />
                  Validar Canje de Recompensa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="code">Ingresar código de canje</Label>
                  <div className="flex gap-2">
                    <Input id="code" value={code} onChange={e => setCode(e.target.value)} placeholder="ID del canje..." />
                    <Button onClick={handleSearch}>Buscar</Button>
                  </div>
                  <Button variant="outline" className="w-full mt-2" onClick={() => toast({ description: "🚧 Escaneo QR no implementado aún." })}>
                    Escanear Código QR
                  </Button>
                </div>

                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                {redemption && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg space-y-4">
                    <h3 className="font-bold text-lg text-green-800">Detalles del Canje</h3>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-600" />
                      <p><span className="font-semibold">Usuario:</span> {redemption.user?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Gift className="w-5 h-5 text-gray-600" />
                      <p><span className="font-semibold">Recompensa:</span> {redemption.reward?.name}</p>
                    </div>
                    <Button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                      <CheckCircle className="w-5 h-5 mr-2" /> Confirmar Canje
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ValidateRedemption;