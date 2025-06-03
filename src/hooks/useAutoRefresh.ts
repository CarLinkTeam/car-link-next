import { useEffect, useRef } from "react";

interface UseAutoRefreshOptions {
  intervalMs?: number;
  enabled?: boolean;
}

/**
 * Hook para actualizar automáticamente datos cada cierto tiempo
 * Útil para mantener sincronizados los calendarios entre owner y tenant
 */
export const useAutoRefresh = (
  refreshFunction: () => void | Promise<void>,
  options: UseAutoRefreshOptions = {}
) => {
  const { intervalMs = 30000, enabled = true } = options; // 30 segundos por defecto
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const refreshFunctionRef = useRef(refreshFunction);

  // Actualizar la referencia cuando cambie la función
  useEffect(() => {
    refreshFunctionRef.current = refreshFunction;
  }, [refreshFunction]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Configurar el intervalo
    intervalRef.current = setInterval(async () => {
      try {
        await refreshFunctionRef.current();
      } catch (error) {
        console.error("Error en auto-refresh:", error);
      }
    }, intervalMs);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [intervalMs, enabled]);

  // Función para forzar una actualización inmediata
  const forceRefresh = async () => {
    try {
      await refreshFunctionRef.current();
    } catch (error) {
      console.error("Error en force refresh:", error);
    }
  };

  return { forceRefresh };
};
