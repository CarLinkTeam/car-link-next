import { useUserRentalsStore } from "../user-rentals-store";
import { RentalService } from "@/lib/api/services/rental-service";
import { Rental, CreateReviewData } from "@/lib/types/entities/rental";
import { Review } from "@/lib/types/entities/review";

// Mock del servicio
jest.mock("@/lib/api/services/rental-service", () => ({
  RentalService: {
    getUserRentals: jest.fn(),
    createReview: jest.fn(),
    hasReview: jest.fn(),
  },
}));

const mockRental: Rental = {
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
  vehicle: {
    id: "vehicle-1",
    vehicleModel: "Corolla",
    make: "Toyota",
    color: "Blanco",
    year: 2020,
    license_plate: "ABC123",
    url_photos: ["photo1.jpg"],
    daily_price: "50000",
    rental_conditions: "Condiciones",
    class: "Sedán",
    drive: "FWD",
    fuel_type: "Gasolina",
    transmission: "Manual",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
    owner: {
      id: "owner-1",
      email: "owner@test.com",
      password: "password",
      fullName: "Owner Test",
      location: "Bogotá",
      phone: "+573001234568",
      isActive: true,
      roles: ["OWNER"],
    },
    ownerId: "owner-1",
  },
  vehicle_id: "vehicle-1",
};

const mockReview: Review = {
  id: "review-1",
  rating: 5,
  comment: "Excelente vehículo",
  createdAt: "2024-01-06",
  rental_id: "rental-1",
  rental: mockRental,
};

const mockCreateReviewData: CreateReviewData = {
  rental_id: "rental-1",
  rating: 5,
  comment: "Excelente vehículo",
  createdAt: "2024-01-06",
};

describe("User Rentals Store", () => {
  beforeEach(() => {
    // Reset del store antes de cada prueba
    useUserRentalsStore.setState({
      rentals: [],
      rentalReviews: {},
      isLoading: false,
      error: null,
      isCreatingReview: false,
      reviewError: null,
      lastFetched: null,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("Estado inicial", () => {
    it("debe tener el estado inicial correcto", () => {
      const state = useUserRentalsStore.getState();

      expect(state.rentals).toEqual([]);
      expect(state.rentalReviews).toEqual({});
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isCreatingReview).toBe(false);
      expect(state.reviewError).toBeNull();
      expect(state.lastFetched).toBeNull();
    });
  });

  describe("fetchRentals", () => {
    it("debe cargar las rentas exitosamente", async () => {
      (RentalService.getUserRentals as jest.Mock).mockResolvedValue([
        mockRental,
      ]);
      (RentalService.hasReview as jest.Mock).mockResolvedValue(false);

      await useUserRentalsStore.getState().fetchRentals();

      const state = useUserRentalsStore.getState();
      expect(state.rentals).toEqual([mockRental]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.lastFetched).toBeGreaterThan(0);
    });

    it("debe usar cache cuando los datos son recientes", async () => {
      const now = Date.now();
      useUserRentalsStore.setState({
        rentals: [mockRental],
        lastFetched: now - 2 * 60 * 1000, // 2 minutos atrás
      });

      await useUserRentalsStore.getState().fetchRentals();

      // No debe llamar al servicio porque está en cache
      expect(RentalService.getUserRentals).not.toHaveBeenCalled();
    });

    it("debe refrescar cuando el cache está expirado", async () => {
      const now = Date.now();
      useUserRentalsStore.setState({
        rentals: [],
        lastFetched: now - 6 * 60 * 1000, // 6 minutos atrás (expirado)
      });

      (RentalService.getUserRentals as jest.Mock).mockResolvedValue([
        mockRental,
      ]);

      await useUserRentalsStore.getState().fetchRentals();

      expect(RentalService.getUserRentals).toHaveBeenCalled();
    });

    it("debe manejar errores en la carga", async () => {
      const mockError = new Error("Error de red");
      (RentalService.getUserRentals as jest.Mock).mockRejectedValue(mockError);

      await useUserRentalsStore.getState().fetchRentals();

      const state = useUserRentalsStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Error de red");
      expect(state.rentals).toEqual([]);
    });

    it("debe manejar errores desconocidos", async () => {
      (RentalService.getUserRentals as jest.Mock).mockRejectedValue(
        "Error extraño"
      );

      await useUserRentalsStore.getState().fetchRentals();

      const state = useUserRentalsStore.getState();
      expect(state.error).toBe("Error al cargar las rentas");
    });
  });

  describe("createReview", () => {
    it("debe crear una review exitosamente", async () => {
      (RentalService.createReview as jest.Mock).mockResolvedValue(mockReview);

      await useUserRentalsStore.getState().createReview(mockCreateReviewData);

      const state = useUserRentalsStore.getState();
      expect(state.isCreatingReview).toBe(false);
      expect(state.reviewError).toBeNull();
      expect(state.rentalReviews["rental-1"]).toBe(true);
    });

    it("debe manejar errores en la creación de review", async () => {
      const mockError = new Error("Error al crear review");
      (RentalService.createReview as jest.Mock).mockRejectedValue(mockError);

      await useUserRentalsStore.getState().createReview(mockCreateReviewData);

      const state = useUserRentalsStore.getState();
      expect(state.isCreatingReview).toBe(false);
      expect(state.reviewError).toBe("Error al crear review");
    });

    it("debe manejar errores desconocidos en review", async () => {
      (RentalService.createReview as jest.Mock).mockRejectedValue(
        "Error extraño"
      );

      await useUserRentalsStore.getState().createReview(mockCreateReviewData);

      const state = useUserRentalsStore.getState();
      expect(state.reviewError).toBe("Error al crear la review");
    });
  });

  describe("checkHasReview", () => {
    it("debe verificar si una renta tiene review", async () => {
      (RentalService.hasReview as jest.Mock).mockResolvedValue(true);

      const hasReview = await useUserRentalsStore
        .getState()
        .checkHasReview("rental-1");

      expect(hasReview).toBe(true);
      const state = useUserRentalsStore.getState();
      expect(state.rentalReviews["rental-1"]).toBe(true);
    });

    it("debe usar cache si ya existe la información", async () => {
      useUserRentalsStore.setState({
        rentalReviews: { "rental-1": true },
      });

      const hasReview = await useUserRentalsStore
        .getState()
        .checkHasReview("rental-1");

      expect(hasReview).toBe(true);
      expect(RentalService.hasReview).not.toHaveBeenCalled();
    });

    it("debe manejar errores retornando false", async () => {
      (RentalService.hasReview as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      const hasReview = await useUserRentalsStore
        .getState()
        .checkHasReview("rental-1");

      expect(hasReview).toBe(false);
    });
  });

  describe("checkMultipleReviews", () => {
    it("debe verificar múltiples reviews en paralelo", async () => {
      (RentalService.hasReview as jest.Mock)
        .mockResolvedValueOnce(true)
        .mockResolvedValueOnce(false);

      await useUserRentalsStore
        .getState()
        .checkMultipleReviews(["rental-1", "rental-2"]);

      const state = useUserRentalsStore.getState();
      expect(state.rentalReviews["rental-1"]).toBe(true);
      expect(state.rentalReviews["rental-2"]).toBe(false);
      expect(RentalService.hasReview).toHaveBeenCalledTimes(2);
    });

    it("debe saltar IDs que ya están en cache", async () => {
      useUserRentalsStore.setState({
        rentalReviews: { "rental-1": true },
      });

      (RentalService.hasReview as jest.Mock).mockResolvedValue(false);

      await useUserRentalsStore
        .getState()
        .checkMultipleReviews(["rental-1", "rental-2"]);

      // Solo debe llamar para rental-2
      expect(RentalService.hasReview).toHaveBeenCalledTimes(1);
      expect(RentalService.hasReview).toHaveBeenCalledWith("rental-2");
    });

    it("debe manejar errores estableciendo false", async () => {
      (RentalService.hasReview as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await useUserRentalsStore.getState().checkMultipleReviews(["rental-1"]);

      const state = useUserRentalsStore.getState();
      expect(state.rentalReviews["rental-1"]).toBe(false);
    });
  });

  describe("Acciones de utilidad", () => {
    it("clearError debe limpiar el error", () => {
      useUserRentalsStore.setState({ error: "Error de prueba" });

      useUserRentalsStore.getState().clearError();

      const state = useUserRentalsStore.getState();
      expect(state.error).toBeNull();
    });

    it("clearReviewError debe limpiar el error de review", () => {
      useUserRentalsStore.setState({ reviewError: "Error de review" });

      useUserRentalsStore.getState().clearReviewError();

      const state = useUserRentalsStore.getState();
      expect(state.reviewError).toBeNull();
    });

    it("invalidateRentals debe resetear lastFetched", () => {
      useUserRentalsStore.setState({ lastFetched: Date.now() });

      useUserRentalsStore.getState().invalidateRentals();

      const state = useUserRentalsStore.getState();
      expect(state.lastFetched).toBeNull();
    });

    it("updateReviewStatus debe actualizar el estado de review", () => {
      useUserRentalsStore.getState().updateReviewStatus("rental-1", true);

      const state = useUserRentalsStore.getState();
      expect(state.rentalReviews["rental-1"]).toBe(true);
    });
  });
});
