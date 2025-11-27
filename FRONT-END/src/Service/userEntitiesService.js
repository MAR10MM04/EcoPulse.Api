// src/services/userEntitiesService.js
import { useAuth } from '@/hooks/useAuth';

export const useUserEntities = () => {
  const { user } = useAuth();

  const checkUserEntities = async () => {
    try {
      // Verificar si tiene centro de acopio
      const centerResponse = await fetch(`/api/CentroAcopio/usuario/${user.id}`);
      const hasCenter = centerResponse.ok;

      // Verificar si tiene comercio
      const commerceResponse = await fetch(`/api/Comercio/usuario/${user.id}`);
      const hasCommerce = commerceResponse.ok;

      return { hasCenter, hasCommerce };
    } catch (error) {
      console.error('Error verificando entidades del usuario:', error);
      return { hasCenter: false, hasCommerce: false };
    }
  };

  return { checkUserEntities };
};  