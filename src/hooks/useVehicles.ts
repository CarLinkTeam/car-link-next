import { useState, useEffect } from "react";
import { vehicles } from "@/lib/api";
import { Vehicle } from "@/lib/types/entities/vehicle";

interface UseVehiclesState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
}

interface UseVehiclesParams {
  autoFetch?: boolean;
  filters?: {
    make?: string;
    class?: string;
    minPrice?: number;
    maxPrice?: number;
  };
}

export function useVehicles({
  autoFetch = true,
  filters,
}: UseVehiclesParams = {}) {
  const [state, setState] = useState<UseVehiclesState>({
    vehicles: [],
    isLoading: false,
    error: null,
  });

  const fetchVehicles = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const vehiclesList = await vehicles.getAll();
      setState({
        vehicles: vehiclesList,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al cargar vehículos";
      setState({
        vehicles: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  };

  const refreshVehicles = () => {
    fetchVehicles();
  };

  useEffect(() => {
    if (autoFetch) {
      fetchVehicles();
    }
  }, [autoFetch, filters]);

  return {
    ...state,
    refreshVehicles,
    fetchVehicles,
  };
}
