import { useVehicleDetailsStore } from "../vehicle-details-store";
import { VehicleService } from "@/lib/api/services/vehicle-service";
import { ReviewService } from "@/lib/api/services/review-service";
import { UnavailabilityService } from "@/lib/api/services/unavailability-service";
import { Vehicle } from "@/lib/types/entities/vehicle";
import { Review } from "@/lib/types/entities/review";

// Mock de los servicios
jest.mock("@/lib/api/services/vehicle-service");
jest.mock("@/lib/api/services/review-service");
jest.mock("@/lib/api/services/unavailability-service");

const mockVehicle: Vehicle = {
  id: "vehicle-1",
  vehicleModel: "Corolla",
  make: "Toyota",
  year: 2022,
  license_plate: "ABC123",
  color: "Blanco",
  daily_price: "25000",
  rental_conditions: "Vehículo en excelente estado",
  class: "Económico",
  drive: "Manual",
  fuel_type: "Gasolina",
  transmission: "Manual",
  url_photos: ["image1.jpg"],
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  ownerId: "owner-1",
  owner: {
    id: "owner-1",
    email: "owner@test.com",
    password: "hashedpassword",
    fullName: "Propietario Test",
    location: "Bogotá",
    phone: "+573001234567",
    isActive: true,
    roles: ["OWNER"],
  },
};

const mockReview: Review = {
  id: "review-1",
  rating: 5,
  comment: "Excelente vehículo",
  createdAt: "2024-01-01T00:00:00Z",
  rental_id: "rental-1",
  rental: {
    id: "rental-1",
    initialDate: "2024-01-01",
    finalDate: "2024-01-05",
    totalCost: "100000",
    status: "completed",
    client: {
      id: "user-1",
      email: "test@test.com",
      password: "password123",
      fullName: "Test User",
      location: "Bogotá",
      phone: "+573001234567",
      roles: ["TENANT"],
      isActive: true,
    },
    client_id: "user-1",
    vehicle: mockVehicle,
    vehicle_id: "vehicle-1",
  },
};

const mockUnavailabilityPeriod = {
  id: "unavail-1",
  vehicle_id: "vehicle-1",
  unavailable_from: "2024-01-15T00:00:00Z",
  unavailable_to: "2024-01-17T00:00:00Z",
  vehicle: {
    id: "vehicle-1",
    vehicleModel: "Corolla",
    make: "Toyota",
    color: "Blanco",
    year: 2022,
    license_plate: "ABC123",
    url_photos: ["image1.jpg"],
    daily_price: "25000",
    rental_conditions: "Vehículo en excelente estado",
    class: "Económico",
    drive: "Manual",
    fuel_type: "Gasolina",
    transmission: "Manual",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    ownerId: "owner-1",
  },
};

describe("Vehicle Details Store", () => {
  beforeEach(() => {
    // Reset del store antes de cada prueba
    useVehicleDetailsStore.setState({
      vehicles: {},
      isLoading: false,
      isLoadingReviews: false,
      isLoadingUnavailability: false,
      error: null,
      reviewsError: null,
      unavailabilityError: null,
    });

    // Clear all mocks
    jest.clearAllMocks();

    // Mock de Date.now() para pruebas consistentes
    jest.spyOn(Date, "now").mockReturnValue(1640995200000); // 2022-01-01
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Estado inicial", () => {
    it("debe tener el estado inicial correcto", () => {
      const state = useVehicleDetailsStore.getState();

      expect(state.vehicles).toEqual({});
      expect(state.isLoading).toBe(false);
      expect(state.isLoadingReviews).toBe(false);
      expect(state.isLoadingUnavailability).toBe(false);
      expect(state.error).toBeNull();
      expect(state.reviewsError).toBeNull();
      expect(state.unavailabilityError).toBeNull();
    });
  });

  describe("fetchVehicleDetails", () => {
    it("debe cargar los detalles del vehículo exitosamente", async () => {
      (VehicleService.getById as jest.Mock).mockResolvedValue(mockVehicle);

      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.vehicles["vehicle-1"]).toBeDefined();
      expect(state.vehicles["vehicle-1"].data).toEqual(mockVehicle);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it("debe usar cache cuando los datos son recientes", async () => {
      const now = Date.now();
      // Establecer datos en cache (5 minutos atrás)
      useVehicleDetailsStore.setState({
        vehicles: {
          "vehicle-1": {
            data: mockVehicle,
            reviews: [],
            unavailabilityPeriods: [],
            unavailableDates: [],
            lastFetched: now - 5 * 60 * 1000, // 5 minutos atrás
            reviewsLastFetched: 0,
            unavailabilityLastFetched: 0,
          },
        },
      });

      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");

      // No debe llamar al servicio porque está en cache
      expect(VehicleService.getById).not.toHaveBeenCalled();
    });

    it("debe refrescar cuando el cache está expirado", async () => {
      const now = Date.now();
      // Establecer datos expirados (15 minutos atrás)
      useVehicleDetailsStore.setState({
        vehicles: {
          "vehicle-1": {
            data: mockVehicle,
            reviews: [],
            unavailabilityPeriods: [],
            unavailableDates: [],
            lastFetched: now - 15 * 60 * 1000, // 15 minutos atrás
            reviewsLastFetched: 0,
            unavailabilityLastFetched: 0,
          },
        },
      });

      (VehicleService.getById as jest.Mock).mockResolvedValue(mockVehicle);

      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");

      expect(VehicleService.getById).toHaveBeenCalledWith("vehicle-1");
    });

    it("debe manejar errores en la carga", async () => {
      const mockError = new Error("Error de red");
      (VehicleService.getById as jest.Mock).mockRejectedValue(mockError);

      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Error de red");
    });

    it("debe manejar errores desconocidos", async () => {
      (VehicleService.getById as jest.Mock).mockRejectedValue("Error extraño");

      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.error).toBe("Error al cargar el vehículo");
    });

    it("debe establecer loading durante el proceso", async () => {
      // Mock para que la carga tarde en resolverse
      (VehicleService.getById as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve(mockVehicle), 100))
      );

      const fetchPromise = useVehicleDetailsStore
        .getState()
        .fetchVehicleDetails("vehicle-1");

      // Verificar que loading está en true inmediatamente
      let state = useVehicleDetailsStore.getState();
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();

      await fetchPromise;

      // Verificar que loading vuelve a false
      state = useVehicleDetailsStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("fetchVehicleReviews", () => {
    it("debe cargar las reviews del vehículo exitosamente", async () => {
      (ReviewService.getByVehicleId as jest.Mock).mockResolvedValue([
        mockReview,
      ]);

      await useVehicleDetailsStore.getState().fetchVehicleReviews("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.vehicles["vehicle-1"].reviews).toEqual([mockReview]);
      expect(state.isLoadingReviews).toBe(false);
      expect(state.reviewsError).toBeNull();
    });

    it("debe usar cache para reviews cuando los datos son recientes", async () => {
      const now = Date.now();
      useVehicleDetailsStore.setState({
        vehicles: {
          "vehicle-1": {
            data: mockVehicle,
            reviews: [mockReview],
            unavailabilityPeriods: [],
            unavailableDates: [],
            lastFetched: now,
            reviewsLastFetched: now - 5 * 60 * 1000, // 5 minutos atrás
            unavailabilityLastFetched: 0,
          },
        },
      });

      await useVehicleDetailsStore.getState().fetchVehicleReviews("vehicle-1");

      expect(ReviewService.getByVehicleId).not.toHaveBeenCalled();
    });

    it("debe manejar errores en la carga de reviews", async () => {
      const mockError = new Error("Error al cargar reviews");
      (ReviewService.getByVehicleId as jest.Mock).mockRejectedValue(mockError);

      await useVehicleDetailsStore.getState().fetchVehicleReviews("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.isLoadingReviews).toBe(false);
      expect(state.reviewsError).toBe("Error al cargar reviews");
    });
  });

  describe("fetchVehicleUnavailability", () => {
    it("debe cargar la disponibilidad del vehículo exitosamente", async () => {
      (UnavailabilityService.getByVehicleId as jest.Mock).mockResolvedValue([
        mockUnavailabilityPeriod,
      ]);

      await useVehicleDetailsStore
        .getState()
        .fetchVehicleUnavailability("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.vehicles["vehicle-1"].unavailabilityPeriods).toEqual([
        mockUnavailabilityPeriod,
      ]);
      expect(state.vehicles["vehicle-1"].unavailableDates).toHaveLength(3); // 15, 16, 17 enero
      expect(state.isLoadingUnavailability).toBe(false);
      expect(state.unavailabilityError).toBeNull();
    });

    it("debe manejar errores en la carga de disponibilidad", async () => {
      const mockError = new Error("Error al cargar disponibilidad");
      (UnavailabilityService.getByVehicleId as jest.Mock).mockRejectedValue(
        mockError
      );

      await useVehicleDetailsStore
        .getState()
        .fetchVehicleUnavailability("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.isLoadingUnavailability).toBe(false);
      expect(state.unavailabilityError).toBe("Error al cargar disponibilidad");
    });
  });

  describe("isDateUnavailable", () => {
    beforeEach(() => {
      // Establecer fechas no disponibles
      const unavailableDates = [
        new Date("2024-01-15"),
        new Date("2024-01-16"),
        new Date("2024-01-17"),
      ];

      useVehicleDetailsStore.setState({
        vehicles: {
          "vehicle-1": {
            data: mockVehicle,
            reviews: [],
            unavailabilityPeriods: [mockUnavailabilityPeriod],
            unavailableDates,
            lastFetched: Date.now(),
            reviewsLastFetched: 0,
            unavailabilityLastFetched: Date.now(),
          },
        },
      });
    });

    it("debe retornar true para fechas no disponibles", () => {
      const unavailableDate = new Date("2024-01-16");
      const isUnavailable = useVehicleDetailsStore
        .getState()
        .isDateUnavailable("vehicle-1", unavailableDate);

      expect(isUnavailable).toBe(true);
    });

    it("debe retornar false para fechas disponibles", () => {
      const availableDate = new Date("2024-01-20");
      const isUnavailable = useVehicleDetailsStore
        .getState()
        .isDateUnavailable("vehicle-1", availableDate);

      expect(isUnavailable).toBe(false);
    });

    it("debe retornar false si el vehículo no existe", () => {
      const date = new Date("2024-01-16");
      const isUnavailable = useVehicleDetailsStore
        .getState()
        .isDateUnavailable("vehicle-nonexistent", date);

      expect(isUnavailable).toBe(false);
    });
  });

  describe("invalidateVehicle", () => {
    it("debe invalidar el cache de un vehículo específico", () => {
      const now = Date.now();
      // Establecer datos en cache
      useVehicleDetailsStore.setState({
        vehicles: {
          "vehicle-1": {
            data: mockVehicle,
            reviews: [],
            unavailabilityPeriods: [],
            unavailableDates: [],
            lastFetched: now,
            reviewsLastFetched: now,
            unavailabilityLastFetched: now,
          },
        },
      });

      useVehicleDetailsStore.getState().invalidateVehicle("vehicle-1");

      const state = useVehicleDetailsStore.getState();
      expect(state.vehicles["vehicle-1"].lastFetched).toBe(0);
      expect(state.vehicles["vehicle-1"].reviewsLastFetched).toBe(0);
      expect(state.vehicles["vehicle-1"].unavailabilityLastFetched).toBe(0);
    });
  });

  describe("invalidateAllVehicles", () => {
    it("debe invalidar el cache de todos los vehículos", () => {
      const now = Date.now();
      // Establecer datos en cache para múltiples vehículos
      useVehicleDetailsStore.setState({
        vehicles: {
          "vehicle-1": {
            data: mockVehicle,
            reviews: [],
            unavailabilityPeriods: [],
            unavailableDates: [],
            lastFetched: now,
            reviewsLastFetched: now,
            unavailabilityLastFetched: now,
          },
          "vehicle-2": {
            data: { ...mockVehicle, id: "vehicle-2" },
            reviews: [],
            unavailabilityPeriods: [],
            unavailableDates: [],
            lastFetched: now,
            reviewsLastFetched: now,
            unavailabilityLastFetched: now,
          },
        },
      });

      useVehicleDetailsStore.getState().invalidateAllVehicles();

      const state = useVehicleDetailsStore.getState();
      expect(state.vehicles["vehicle-1"].lastFetched).toBe(0);
      expect(state.vehicles["vehicle-2"].lastFetched).toBe(0);
    });
  });

  describe("clearErrors", () => {
    it("debe limpiar todos los errores", () => {
      // Establecer errores
      useVehicleDetailsStore.setState({
        error: "Error general",
        reviewsError: "Error de reviews",
        unavailabilityError: "Error de disponibilidad",
      });

      useVehicleDetailsStore.getState().clearErrors();

      const state = useVehicleDetailsStore.getState();
      expect(state.error).toBeNull();
      expect(state.reviewsError).toBeNull();
      expect(state.unavailabilityError).toBeNull();
    });
  });

  describe("Cache y persistencia", () => {
    it("debe respetar la duración del cache", async () => {
      const mockNow = 1640995200000; // Tiempo base
      jest.spyOn(Date, "now").mockReturnValue(mockNow);

      (VehicleService.getById as jest.Mock).mockResolvedValue(mockVehicle);

      // Primera carga
      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");
      expect(VehicleService.getById).toHaveBeenCalledTimes(1);

      // Segunda carga inmediata (debe usar cache)
      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");
      expect(VehicleService.getById).toHaveBeenCalledTimes(1);

      // Avanzar el tiempo 11 minutos
      jest.spyOn(Date, "now").mockReturnValue(mockNow + 11 * 60 * 1000);

      // Tercera carga (cache expirado)
      await useVehicleDetailsStore.getState().fetchVehicleDetails("vehicle-1");
      expect(VehicleService.getById).toHaveBeenCalledTimes(2);
    });
  });
});
