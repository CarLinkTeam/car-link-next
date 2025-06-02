import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { RentalService } from "@/lib/api/services/rental-service";
import { Rental, CreateReviewData } from "@/lib/types/entities/rental";
import { Review } from "@/lib/types/entities/review";

interface UserRentalsState {
  rentals: Rental[];
  rentalReviews: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  isCreatingReview: boolean;
  reviewError: string | null;
  lastFetched: number | null;

  // Actions
  fetchRentals: () => Promise<void>;
  createReview: (reviewData: CreateReviewData) => Promise<Review | null>;
  checkHasReview: (rentalId: string) => Promise<boolean>;
  checkMultipleReviews: (rentalIds: string[]) => Promise<void>;
  clearError: () => void;
  clearReviewError: () => void;
  invalidateRentals: () => void;
  updateReviewStatus: (rentalId: string, hasReview: boolean) => void;
}

export const useUserRentalsStore = create<UserRentalsState>()(
  persist(
    (set, get) => ({
      rentals: [],
      rentalReviews: {},
      isLoading: false,
      error: null,
      isCreatingReview: false,
      reviewError: null,
      lastFetched: null,

      fetchRentals: async () => {
        const { lastFetched, rentals } = get();
        const now = Date.now();

        // Si ya tenemos rentas y están en cache (menos de 5 minutos), no recargar
        if (
          lastFetched &&
          rentals.length > 0 &&
          now - lastFetched < 5 * 60 * 1000
        ) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const fetchedRentals = await RentalService.getUserRentals();
          set({
            rentals: fetchedRentals,
            isLoading: false,
            lastFetched: now,
          });

          // Verificar reviews para rentas completadas
          const completedRentals = fetchedRentals.filter(
            (r) => r.status === "completed"
          );
          if (completedRentals.length > 0) {
            get().checkMultipleReviews(completedRentals.map((r) => r.id));
          }
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : "Error al cargar las rentas",
            isLoading: false,
          });
        }
      },

      createReview: async (reviewData) => {
        set({ isCreatingReview: true, reviewError: null });

        try {
          const review = await RentalService.createReview(reviewData);

          // Actualizar el estado de review sin hacer refetch completo
          set((state) => ({
            isCreatingReview: false,
            rentalReviews: {
              ...state.rentalReviews,
              [reviewData.rental_id]: true,
            },
          }));

          return review;
        } catch (error) {
          set({
            reviewError:
              error instanceof Error
                ? error.message
                : "Error al crear la review",
            isCreatingReview: false,
          });
          return null;
        }
      },

      checkHasReview: async (rentalId) => {
        const { rentalReviews } = get();

        // Si ya tenemos el estado en cache, devolverlo
        if (rentalId in rentalReviews) {
          return rentalReviews[rentalId];
        }

        try {
          const hasReview = await RentalService.hasReview(rentalId);
          set((state) => ({
            rentalReviews: {
              ...state.rentalReviews,
              [rentalId]: hasReview,
            },
          }));
          return hasReview;
        } catch {
          return false;
        }
      },

      checkMultipleReviews: async (rentalIds) => {
        const { rentalReviews } = get();
        const uncheckedIds = rentalIds.filter((id) => !(id in rentalReviews));

        if (uncheckedIds.length === 0) return;

        // Verificar reviews en paralelo
        const results = await Promise.allSettled(
          uncheckedIds.map(async (id) => {
            const hasReview = await RentalService.hasReview(id);
            return { id, hasReview };
          })
        );

        const newReviews: Record<string, boolean> = {};
        results.forEach((result, index) => {
          if (result.status === "fulfilled") {
            newReviews[result.value.id] = result.value.hasReview;
          } else {
            newReviews[uncheckedIds[index]] = false;
          }
        });

        set((state) => ({
          rentalReviews: {
            ...state.rentalReviews,
            ...newReviews,
          },
        }));
      },

      updateReviewStatus: (rentalId, hasReview) => {
        set((state) => ({
          rentalReviews: {
            ...state.rentalReviews,
            [rentalId]: hasReview,
          },
        }));
      },

      clearError: () => set({ error: null }),

      clearReviewError: () => set({ reviewError: null }),

      invalidateRentals: () => set({ lastFetched: null }),
    }),
    {
      name: "user-rentals-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rentals: state.rentals,
        rentalReviews: state.rentalReviews,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
