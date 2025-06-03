import { useState, useEffect, useCallback } from "react";
import { unavailability } from "@/lib/api";
import type { UnavailabilityPeriod } from "@/lib/api/services/unavailability-service";
import { useAutoRefresh } from "./useAutoRefresh";

interface UseVehicleUnavailabilityProps {
  vehicleId: string;
  autoRefresh?: boolean;
}

export const useVehicleUnavailability = ({
  vehicleId,
  autoRefresh = true,
}: UseVehicleUnavailabilityProps) => {
  const [unavailabilityData, setUnavailabilityData] = useState<
    UnavailabilityPeriod[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnavailability = useCallback(async () => {
    if (!vehicleId) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await unavailability.getByVehicleId(vehicleId);
      setUnavailabilityData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [vehicleId]);

  const { forceRefresh } = useAutoRefresh(fetchUnavailability, {
    enabled: autoRefresh && !!vehicleId,
    intervalMs: 30000,
  });

  // Función para generar todas las fechas no disponibles incluyendo rangos
  const getUnavailableDates = (): Date[] => {
    const unavailableDates: Date[] = [];

    unavailabilityData.forEach((period) => {
      const startDate = new Date(period.unavailable_from);
      const endDate = new Date(period.unavailable_to);

      // Generar todas las fechas entre startDate y endDate (inclusive)
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        unavailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    return unavailableDates;
  };

  // Función para verificar si una fecha específica está no disponible
  const isDateUnavailable = (date: Date): boolean => {
    return unavailabilityData.some((period) => {
      const startDate = new Date(period.unavailable_from);
      const endDate = new Date(period.unavailable_to);

      // Normalizar las fechas para comparar solo día/mes/año
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      return checkDate >= startDate && checkDate <= endDate;
    });
  };
  useEffect(() => {
    fetchUnavailability();
  }, [fetchUnavailability]);

  return {
    unavailabilityData,
    unavailableDates: getUnavailableDates(),
    isDateUnavailable,
    isLoading,
    error,
    refreshUnavailability: fetchUnavailability,
    forceRefresh,
  };
};
