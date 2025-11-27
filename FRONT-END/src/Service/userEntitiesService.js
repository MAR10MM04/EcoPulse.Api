// src/services/userEntitiesService.js
export const useUserEntitiesService = () => {
  const checkUserEntities = async (userId) => {
    try {
      console.log('🔍 Verificando entidades para usuario ID:', userId);
      
      if (!userId) {
        console.error('❌ No hay ID de usuario');
        return { hasCenter: false, hasCommerce: false };
      }

      let hasCenter = false;
      let hasCommerce = false;

      // Verificar si tiene centro de acopio
      try {
        const centerResponse = await fetch(`/api/CentroAcopio`);
        if (centerResponse.ok) {
          const centers = await centerResponse.json();
          console.log('📊 Centros encontrados:', centers);
          // Asumiendo que el campo es IdUsuario (con mayúscula) y que el userId es string o number, comparamos con ==
          hasCenter = centers.some(center => center.IdUsuario == userId);
        } else {
          console.warn('⚠️ No se pudieron obtener centros de acopio');
        }
      } catch (centerError) {
        console.warn('⚠️ Error al obtener centros:', centerError);
      }

      // Verificar si tiene comercio
      try {
        const commerceResponse = await fetch(`/api/Comercio`);
        if (commerceResponse.ok) {
          const commerces = await commerceResponse.json();
          console.log('🏪 Comercios encontrados:', commerces);
          hasCommerce = commerces.some(commerce => commerce.IdUsuario == userId);
        } else {
          console.warn('⚠️ No se pudieron obtener comercios');
        }
      } catch (commerceError) {
        console.warn('⚠️ Error al obtener comercios:', commerceError);
      }

      console.log('✅ Resultados finales:', { hasCenter, hasCommerce });
      
      return { hasCenter, hasCommerce };
    } catch (error) {
      console.error('❌ Error general verificando entidades:', error);
      return { hasCenter: false, hasCommerce: false };
    }
  };

  return { checkUserEntities };
};