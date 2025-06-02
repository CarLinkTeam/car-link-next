import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { VehicleService } from "@/lib/api/services/vehicle-service";
import { ReviewService } from "@/lib/api/services/review-service";
import {
  UnavailabilityService,
  UnavailabilityPeriod,
} from "@/lib/api/services/unavailability-service";
import { Vehicle } from "@/lib/types/entities/vehicle";
import { Review } from "@/lib/types/entities/review";

interface VehicleDetails {
  data: Vehicle;
  reviews: Review[];
  unavailabilityPeriods: UnavailabilityPeriod[];
  unavailableDates: Date[];
  lastFetched: number;
  reviewsLastFetched: number;
  unavailabilityLastFetched: number;
}

interface VehicleDetailsState {
  vehicles: Record<string, VehicleDetails>;
  isLoading: boolean;
  isLoadingReviews: boolean;
  isLoadingUnavailability: boolean;
  error: string | null;
  reviewsError: string | null;
  unavailabilityError: string | null;

  // Actions
  fetchVehicleDetails: (id: string, force?: boolean) => Promise<void>;
  fetchVehicleReviews: (id: string, force?: boolean) => Promise<void>;
  fetchVehicleUnavailability: (id: string, force?: boolean) => Promise<void>;
  invalidateVehicle: (id: string) => void;
  invalidateAllVehicles: () => void;
  clearErrors: () => void;
  isDateUnavailable: (vehicleId: string, date: Date) => boolean;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// Función helper para generar fechas no disponibles a partir de períodos
const generateUnavailableDates = (periods: UnavailabilityPeriod[]): Date[] => {
  const unavailableDates: Date[] = [];

  periods.forEach((period) => {
    const startDate = new Date(period.unavailable_from);
    const endDate = new Date(period.unavailable_to);

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      unavailableDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return unavailableDates;
};

export const useVehicleDetailsStore = create<VehicleDetailsState>()(
  persist(
    (set, get) => ({
      vehicles: {},
      isLoading: false,
      isLoadingReviews: false,
      isLoadingUnavailability: false,
      error: null,
      reviewsError: null,
      unavailabilityError: null,

      fetchVehicleDetails: async (id, force = false) => {
        const { vehicles } = get();
        const now = Date.now();
        const existingVehicle = vehicles[id];

        // Verificar cache
        if (
          !force &&
          existingVehicle &&
          existingVehicle.lastFetched &&
          now - existingVehicle.lastFetched < CACHE_DURATION
        ) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const vehicleData = await VehicleService.getById(id);

          set((state) => ({
            isLoading: false,
            vehicles: {
              ...state.vehicles,
              [id]: {
                ...state.vehicles[id],
                data: vehicleData,
                lastFetched: now,
                reviews: state.vehicles[id]?.reviews || [],
                unavailabilityPeriods:
                  state.vehicles[id]?.unavailabilityPeriods || [],
                unavailableDates: state.vehicles[id]?.unavailableDates || [],
                reviewsLastFetched: state.vehicles[id]?.reviewsLastFetched || 0,
                unavailabilityLastFetched:
                  state.vehicles[id]?.unavailabilityLastFetched || 0,
              },
            },
          }));

          // Fetch reviews y unavailability en paralelo si no existen o están desactualizados
          const promises = [];

          if (
            !existingVehicle?.reviewsLastFetched ||
            now - existingVehicle.reviewsLastFetched > CACHE_DURATION
          ) {
            promises.push(get().fetchVehicleReviews(id, true));
          }

          if (
            !existingVehicle?.unavailabilityLastFetched ||
            now - existingVehicle.unavailabilityLastFetched > CACHE_DURATION
          ) {
            promises.push(get().fetchVehicleUnavailability(id, true));
          }

          await Promise.allSettled(promises);
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar el vehículo",
            isLoading: false,
          });
        }
      },

      fetchVehicleReviews: async (id, force = false) => {
        const { vehicles } = get();
        const now = Date.now();
        const existingVehicle = vehicles[id];

        if (
          !force &&
          existingVehicle?.reviewsLastFetched &&
          now - existingVehicle.reviewsLastFetched < CACHE_DURATION
        ) {
          return;
        }

        set({ isLoadingReviews: true, reviewsError: null });

        try {
          const reviews = await ReviewService.getByVehicleId(id);

          set((state) => ({
            isLoadingReviews: false,
            vehicles: {
              ...state.vehicles,
              [id]: {
                ...state.vehicles[id],
                reviews,
                reviewsLastFetched: now,
              },
            },
          }));
        } catch (error) {
          set({
            reviewsError:
              error instanceof Error
                ? error.message
                : "Error al cargar reviews",
            isLoadingReviews: false,
          });
        }
      },

      fetchVehicleUnavailability: async (id, force = false) => {
        const { vehicles } = get();
        const now = Date.now();
        const existingVehicle = vehicles[id];

        if (
          !force &&
          existingVehicle?.unavailabilityLastFetched &&
          now - existingVehicle.unavailabilityLastFetched < CACHE_DURATION
        ) {
          return;
        }

        set({ isLoadingUnavailability: true, unavailabilityError: null });

        try {
          const unavailabilityPeriods =
            await UnavailabilityService.getByVehicleId(id);
          const unavailableDates = generateUnavailableDates(
            unavailabilityPeriods
          );

          set((state) => ({
            isLoadingUnavailability: false,
            vehicles: {
              ...state.vehicles,
              [id]: {
                ...state.vehicles[id],
                unavailabilityPeriods,
                unavailableDates,
                unavailabilityLastFetched: now,
              },
            },
          }));
        } catch (error) {
          set({
            unavailabilityError:
              error instanceof Error
                ? error.message
                : "Error al cargar disponibilidad",
            isLoadingUnavailability: false,
          });
        }
      },

      isDateUnavailable: (vehicleId, date) => {
        const { vehicles } = get();
        const vehicle = vehicles[vehicleId];

        if (!vehicle?.unavailableDates) return false;

        const dateStr = date.toDateString();
        return vehicle.unavailableDates.some(
          (unavailableDate) => unavailableDate.toDateString() === dateStr
        );
      },

      invalidateVehicle: (id) => {
        set((state) => {
          const newVehicles = { ...state.vehicles };
          if (newVehicles[id]) {
            newVehicles[id] = {
              ...newVehicles[id],
              lastFetched: 0,
              reviewsLastFetched: 0,
              unavailabilityLastFetched: 0,
            };
          }
          return { vehicles: newVehicles };
        });
      },

      invalidateAllVehicles: () => {
        set((state) => {
          const newVehicles: Record<string, VehicleDetails> = {};
          Object.keys(state.vehicles).forEach((id) => {
            newVehicles[id] = {
              ...state.vehicles[id],
              lastFetched: 0,
              reviewsLastFetched: 0,
              unavailabilityLastFetched: 0,
            };
          });
          return { vehicles: newVehicles };
        });
      },

      clearErrors: () => {
        set({
          error: null,
          reviewsError: null,
          unavailabilityError: null,
        });
      },
    }),
    {
      name: "vehicle-details-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        vehicles: Object.keys(state.vehicles).reduce((acc, id) => {
          const vehicle = state.vehicles[id];
          // Solo persistir si los datos son recientes (menos de 1 hora)
          if (
            vehicle.lastFetched &&
            Date.now() - vehicle.lastFetched < 60 * 60 * 1000
          ) {
            acc[id] = vehicle;
          }
          return acc;
        }, {} as Record<string, VehicleDetails>),
      }),
    }
  )
);
