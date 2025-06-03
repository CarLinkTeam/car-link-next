import {
  UserService,
  VehicleService,
  RentalService,
} from "../genericEntities-service";
import { apiClient } from "@/lib/api/base/client";
import { User, Vehicle, Rental } from "@/lib/types";

// Mock del cliente API
jest.mock("@/lib/api/base/client", () => ({
  apiClient: {
    get: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockUser: User = {
  id: "user-123",
  email: "test@example.com",
  password: "hashed-password",
  fullName: "Usuario Test",
  location: "Bogotá",
  phone: "+57 300 123 4567",
  roles: ["TENANT"],
  isActive: true,
};

const mockVehicle: Vehicle = {
  id: "vehicle-123",
  vehicleModel: "Corolla",
  make: "Toyota",
  color: "Blanco",
  year: 2023,
  license_plate: "ABC123",
  url_photos: ["https://example.com/photo1.jpg"],
  daily_price: 150000,
  rental_conditions: "Condiciones de prueba",
  userId: "user-123",
  created_at: "2024-01-01",
  updated_at: "2024-01-01",
  owner: mockUser,
  ownerId: "user-123",
};

const mockRental: Rental = {
  id: "rental-123",
  initialDate: "2024-01-01",
  finalDate: "2024-01-05",
  totalCost: "500000",
  status: "pending",
  client: mockUser,
  client_id: "user-123",
  vehicle: mockVehicle,
  vehicle_id: "vehicle-123",
};

describe("UserService", () => {
  const userService = new UserService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe obtener todos los usuarios", async () => {
    const mockUsers = [mockUser];
    (apiClient.get as jest.Mock).mockResolvedValue(mockUsers);

    const result = await userService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/users");
    expect(result).toEqual(mockUsers);
  });

  it("debe obtener un usuario por ID", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue(mockUser);

    const result = await userService.getById("user-123");

    expect(apiClient.get).toHaveBeenCalledWith("/users/user-123");
    expect(result).toEqual(mockUser);
  });

  it("debe actualizar un usuario por ID", async () => {
    const updateData = { fullName: "Nombre Actualizado" };
    const updatedUser = { ...mockUser, ...updateData };
    (apiClient.patch as jest.Mock).mockResolvedValue(updatedUser);

    const result = await userService.updateById("user-123", updateData);

    expect(apiClient.patch).toHaveBeenCalledWith("/users/user-123", updateData);
    expect(result).toEqual(updatedUser);
  });

  it("debe eliminar un usuario por ID", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await userService.deleteById("user-123");

    expect(apiClient.delete).toHaveBeenCalledWith("/users/user-123");
  });
});

describe("VehicleService", () => {
  const vehicleService = new VehicleService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe obtener todos los vehículos", async () => {
    const mockVehicles = [mockVehicle];
    (apiClient.get as jest.Mock).mockResolvedValue(mockVehicles);

    const result = await vehicleService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/vehicles");
    expect(result).toEqual(mockVehicles);
  });

  it("debe obtener un vehículo por ID", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue(mockVehicle);

    const result = await vehicleService.getById("vehicle-123");

    expect(apiClient.get).toHaveBeenCalledWith("/vehicles/vehicle-123");
    expect(result).toEqual(mockVehicle);
  });

  it("debe actualizar un vehículo por ID", async () => {
    const updateData = { color: "Rojo" };
    const updatedVehicle = { ...mockVehicle, ...updateData };
    (apiClient.patch as jest.Mock).mockResolvedValue(updatedVehicle);

    const result = await vehicleService.updateById("vehicle-123", updateData);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/vehicles/vehicle-123",
      updateData
    );
    expect(result).toEqual(updatedVehicle);
  });

  it("debe eliminar un vehículo por ID", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await vehicleService.deleteById("vehicle-123");

    expect(apiClient.delete).toHaveBeenCalledWith("/vehicles/vehicle-123");
  });
});

describe("RentalService", () => {
  const rentalService = new RentalService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe obtener todas las rentas", async () => {
    const mockRentals = [mockRental];
    (apiClient.get as jest.Mock).mockResolvedValue(mockRentals);

    const result = await rentalService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/rentals");
    expect(result).toEqual(mockRentals);
  });

  it("debe obtener una renta por ID", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue(mockRental);

    const result = await rentalService.getById("rental-123");

    expect(apiClient.get).toHaveBeenCalledWith("/rentals/rental-123");
    expect(result).toEqual(mockRental);
  });

  it("debe actualizar una renta por ID", async () => {
    const updateData = { status: "completed" as const };
    const updatedRental = { ...mockRental, ...updateData };
    (apiClient.patch as jest.Mock).mockResolvedValue(updatedRental);

    const result = await rentalService.updateById("rental-123", updateData);

    expect(apiClient.patch).toHaveBeenCalledWith(
      "/rentals/rental-123",
      updateData
    );
    expect(result).toEqual(updatedRental);
  });

  it("debe eliminar una renta por ID", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

    await rentalService.deleteById("rental-123");

    expect(apiClient.delete).toHaveBeenCalledWith("/rentals/rental-123");
  });
});
