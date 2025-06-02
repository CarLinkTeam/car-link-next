import { useState, useEffect, useCallback } from "react";
import { vehicles } from "@/lib/api";
import { Vehicle } from "@/lib/types/entities/vehicle";

interface UseVehicleState {
  vehicle: Vehicle | null;
  isLoading: boolean;
  error: string | null;
}

interface UseVehicleParams {
  id: string;
  autoFetch?: boolean;
}

export function useVehicle({ id, autoFetch = true }: UseVehicleParams) {
  const [state, setState] = useState<UseVehicleState>({
    vehicle: null,
    isLoading: false,
    error: null,
  });
  const fetchVehicle = useCallback(async () => {
    if (!id) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const vehicle = await vehicles.getById(id);
      setState({
        vehicle,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar el vehículo";
      setState({
        vehicle: null,
        isLoading: false,
        error: errorMessage,
      });
    }
  }, [id]);

  const refreshVehicle = () => {
    fetchVehicle();
  };
  useEffect(() => {
    if (autoFetch && id) {
      fetchVehicle();
    }
  }, [autoFetch, id, fetchVehicle]);

  return {
    ...state,
    refreshVehicle,
    fetchVehicle,
  };
}
