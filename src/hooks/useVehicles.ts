import { useState, useEffect } from "react";
import { vehicles } from "@/lib/api";
import { Vehicle } from "@/lib/types/entities/vehicle";
import { VehicleListResponse } from "@/lib/api/services/vehicle-service";

interface UseVehiclesState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  totalPages?: number;
  currentPage?: number;
  totalVehicles?: number;
}

interface UseVehiclesParams {
  autoFetch?: boolean;
  filters?: {
    page?: number;
    limit?: number;
    make?: string;
    vehicleModel?: string;
    class?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
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
      // Si no hay filtros, usar getAll
      if (!filters) {
        console.log("Debug - Using getAll()");
        const vehiclesList = await vehicles.getAll();
        console.log("Debug - getAll response:", vehiclesList?.length);
        setState({
          vehicles: vehiclesList,
          isLoading: false,
          error: null,
        });
        return;
      }

      // Si hay filtros, usar getWithFilters
      const params: {
        page?: number;
        limit?: number;
        make?: string;
        vehicleModel?: string;
        class?: string;
        minPrice?: number;
        maxPrice?: number;
      } = {};

      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.search && filters.search.trim().length > 0) {
        params.make = filters.search.trim();
      }
      if (filters.make) params.make = filters.make;
      if (filters.vehicleModel) params.vehicleModel = filters.vehicleModel;
      if (filters.class) params.class = filters.class;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      console.log("Debug - Using getWithFilters with params:", params);
      const response: VehicleListResponse = await vehicles.getWithFilters(
        params
      );
      console.log("Debug - getWithFilters response:", response);

      setState({
        vehicles: response.data,
        isLoading: false,
        error: null,
        totalPages: Math.ceil(response.total / response.limit),
        currentPage: response.page,
        totalVehicles: response.total,
      });
    } catch (error) {
      console.error("Debug - Error in fetchVehicles:", error);
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
  }, [autoFetch]);

  return {
    ...state,
    refreshVehicles,
    fetchVehicles,
  };
}
