import { VehicleService } from "../vehicle-service";
import { apiClient } from "@/lib/api/base/client";
import {
  CreateVehicleDto,
  UpdateVehicleDto,
} from "../../../types/entities/vehicle";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("VehicleService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("debe obtener todos los vehículos", async () => {
      const mockVehicles = [
        { id: "1", make: "Toyota", vehicleModel: "Corolla" },
        { id: "2", make: "Honda", vehicleModel: "Civic" },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockVehicles);

      const result = await VehicleService.getAll();

      expect(apiClient.get).toHaveBeenCalledWith("/vehicles");
      expect(result).toEqual(mockVehicles);
    });
  });

  describe("getById", () => {
    it("debe obtener un vehículo por ID", async () => {
      const vehicleId = "vehicle-123";
      const mockVehicle = {
        id: vehicleId,
        make: "Toyota",
        vehicleModel: "Corolla",
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockVehicle);

      const result = await VehicleService.getById(vehicleId);

      expect(apiClient.get).toHaveBeenCalledWith(`/vehicles/${vehicleId}`);
      expect(result).toEqual(mockVehicle);
    });
  });

  describe("create", () => {
    it("debe crear un vehículo exitosamente", async () => {
      const mockVehicleData: CreateVehicleDto = {
        make: "Toyota",
        vehicleModel: "Corolla",
        color: "Blanco",
        year: 2023,
        license_plate: "ABC123",
        url_photos: ["photo1.jpg"],
        daily_price: 50000,
        rental_conditions: "Condiciones de alquiler",
      };

      const mockResponse = { id: "new-vehicle", ...mockVehicleData };

      (apiClient.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await VehicleService.create(mockVehicleData);

      expect(apiClient.post).toHaveBeenCalledWith("/vehicles", mockVehicleData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe("update", () => {
    it("debe actualizar un vehículo", async () => {
      const vehicleId = "vehicle-123";
      const updateData: UpdateVehicleDto = { daily_price: 60000 };
      const mockResponse = { id: vehicleId, ...updateData };

      (apiClient.patch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await VehicleService.update(vehicleId, updateData);

      expect(apiClient.patch).toHaveBeenCalledWith(
        `/vehicles/${vehicleId}`,
        updateData
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("delete", () => {
    it("debe eliminar un vehículo", async () => {
      const vehicleId = "vehicle-123";

      (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

      await VehicleService.delete(vehicleId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/vehicles/${vehicleId}`);
    });
  });

  describe("getMyVehicles", () => {
    it("debe obtener los vehículos del usuario", async () => {
      const mockVehicles = [
        { id: "1", make: "Toyota", vehicleModel: "Corolla" },
        { id: "2", make: "Honda", vehicleModel: "Civic" },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockVehicles);

      const result = await VehicleService.getMyVehicles();

      expect(apiClient.get).toHaveBeenCalledWith("/vehicles/myVehicles");
      expect(result).toEqual(mockVehicles);
    });
  });

  describe("getWithFilters", () => {
    it("debe obtener vehículos con filtros", async () => {
      const mockParams = {
        page: 1,
        limit: 10,
        make: "Toyota",
        minPrice: 40000,
        maxPrice: 60000,
      };

      const mockResponse = {
        data: [{ id: "1", make: "Toyota" }],
        total: 1,
        page: 1,
        limit: 10,
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await VehicleService.getWithFilters(mockParams);

      expect(apiClient.get).toHaveBeenCalledWith(
        "/vehicles?page=1&limit=10&make=Toyota&minPrice=40000&maxPrice=60000"
      );
      expect(result).toEqual(mockResponse);
    });

    it("debe obtener vehículos sin filtros", async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await VehicleService.getWithFilters();

      expect(apiClient.get).toHaveBeenCalledWith("/vehicles");
      expect(result).toEqual(mockResponse);
    });
  });
});
