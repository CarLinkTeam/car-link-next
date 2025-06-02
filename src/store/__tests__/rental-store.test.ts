import { useRentalStore } from "../rental-store";
import { RentalService } from "@/lib/api/services/rental-service";
import { useVehicleDetailsStore } from "../vehicle-details-store";
import { CreateRentalData } from "@/lib/types/entities/rental";

// Mock de los servicios
jest.mock("@/lib/api/services/rental-service", () => ({
  RentalService: {
    create: jest.fn(),
  },
}));

jest.mock("../vehicle-details-store", () => ({
  useVehicleDetailsStore: {
    getState: jest.fn(() => ({
      invalidateVehicle: jest.fn(),
      fetchVehicleUnavailability: jest.fn(),
    })),
  },
}));

const mockCreateRentalData: CreateRentalData = {
  vehicle_id: "vehicle-1",
  initialDate: "2024-01-01",
  finalDate: "2024-01-05",
  totalCost: 100000,
};

describe("Rental Store", () => {
  beforeEach(() => {
    // Reset del store antes de cada prueba
    useRentalStore.setState({
      isLoading: false,
      error: null,
      success: false,
    });

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("Estado inicial", () => {
    it("debe tener el estado inicial correcto", () => {
      const state = useRentalStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });
  });

  describe("createRental", () => {
    it("debe crear una reserva exitosamente", async () => {
      const mockInvalidateVehicle = jest.fn();
      const mockFetchVehicleUnavailability = jest
        .fn()
        .mockResolvedValue(undefined);

      (useVehicleDetailsStore.getState as jest.Mock).mockReturnValue({
        invalidateVehicle: mockInvalidateVehicle,
        fetchVehicleUnavailability: mockFetchVehicleUnavailability,
      });

      (RentalService.create as jest.Mock).mockResolvedValue({ id: "rental-1" });

      await useRentalStore.getState().createRental(mockCreateRentalData);

      const state = useRentalStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.success).toBe(true);
      expect(state.error).toBeNull();

      expect(RentalService.create).toHaveBeenCalledWith(mockCreateRentalData);
      expect(mockInvalidateVehicle).toHaveBeenCalledWith("vehicle-1");
      expect(mockFetchVehicleUnavailability).toHaveBeenCalledWith(
        "vehicle-1",
        true
      );
    });

    it("debe manejar errores en la creación", async () => {
      const mockError = new Error("Error al crear reserva");
      (RentalService.create as jest.Mock).mockRejectedValue(mockError);

      await useRentalStore.getState().createRental(mockCreateRentalData);

      const state = useRentalStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.success).toBe(false);
      expect(state.error).toBe("Error al crear reserva");
    });

    it("debe manejar errores desconocidos", async () => {
      (RentalService.create as jest.Mock).mockRejectedValue("Error extraño");

      await useRentalStore.getState().createRental(mockCreateRentalData);

      const state = useRentalStore.getState();
      expect(state.error).toBe("Error desconocido");
    });

    it("debe establecer loading durante el proceso", async () => {
      // Mock para que la creación tarde en resolverse
      (RentalService.create as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ id: "rental-1" }), 100)
          )
      );

      const createPromise = useRentalStore
        .getState()
        .createRental(mockCreateRentalData);

      // Verificar que loading está en true inmediatamente
      let state = useRentalStore.getState();
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);

      await createPromise;

      // Verificar que loading vuelve a false
      state = useRentalStore.getState();
      expect(state.isLoading).toBe(false);
    });
  });

  describe("clearStatus", () => {
    it("debe limpiar el estado de error y success", () => {
      // Establecer estado con error y success
      useRentalStore.setState({
        error: "Error de prueba",
        success: true,
      });

      useRentalStore.getState().clearStatus();

      const state = useRentalStore.getState();
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });
  });
});
