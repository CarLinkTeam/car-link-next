import {
  Vehicle,
  CreateVehicleDto,
  UpdateVehicleDto,
  VehicleFilters,
} from "../vehicle";

describe("Vehicle Types", () => {
  describe("Vehicle interface", () => {
    it("debe crear un objeto Vehicle válido", () => {
      const vehicle: Vehicle = {
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
        owner: {
          id: "user-123",
          email: "owner@test.com",
          password: "hashed-password",
          fullName: "Owner Test",
          location: "Bogotá",
          phone: "+57 300 123 4567",
          roles: ["OWNER"],
          isActive: true,
        },
        ownerId: "user-123",
      };

      expect(vehicle.id).toBe("vehicle-123");
      expect(vehicle.make).toBe("Toyota");
      expect(vehicle.vehicleModel).toBe("Corolla");
      expect(vehicle.year).toBe(2023);
      expect(vehicle.daily_price).toBe(150000);
    });

    it("debe aceptar campos opcionales", () => {
      const vehicle: Vehicle = {
        id: "vehicle-123",
        vehicleModel: "Corolla",
        make: "Toyota",
        color: "Blanco",
        year: 2023,
        license_plate: "ABC123",
        url_photos: ["https://example.com/photo1.jpg"],
        daily_price: 150000,
        rental_conditions: "Condiciones de prueba",
        class: "Sedán",
        drive: "FWD",
        fuel_type: "Gasolina",
        transmission: "Automática",
        userId: "user-123",
        created_at: "2024-01-01",
        updated_at: "2024-01-01",
        owner: {
          id: "user-123",
          email: "owner@test.com",
          password: "hashed-password",
          fullName: "Owner Test",
          location: "Bogotá",
          phone: "+57 300 123 4567",
          roles: ["OWNER"],
          isActive: true,
        },
        ownerId: "user-123",
      };

      expect(vehicle.class).toBe("Sedán");
      expect(vehicle.drive).toBe("FWD");
      expect(vehicle.fuel_type).toBe("Gasolina");
      expect(vehicle.transmission).toBe("Automática");
    });
  });

  describe("CreateVehicleDto", () => {
    it("debe crear un DTO válido para crear vehículo", () => {
      const createDto: CreateVehicleDto = {
        vehicleModel: "Corolla",
        make: "Toyota",
        color: "Blanco",
        year: 2023,
        license_plate: "ABC123",
        url_photos: ["https://example.com/photo1.jpg"],
        daily_price: 150000,
        rental_conditions: "Condiciones de prueba",
      };

      expect(createDto.make).toBe("Toyota");
      expect(createDto.vehicleModel).toBe("Corolla");
      expect(createDto.daily_price).toBe(150000);
    });

    it("debe aceptar campos opcionales en CreateVehicleDto", () => {
      const createDto: CreateVehicleDto = {
        vehicleModel: "Corolla",
        make: "Toyota",
        color: "Blanco",
        year: 2023,
        license_plate: "ABC123",
        url_photos: ["https://example.com/photo1.jpg"],
        daily_price: 150000,
        rental_conditions: "Condiciones de prueba",
        class: "Sedán",
        drive: "FWD",
        fuel_type: "Gasolina",
        transmission: "Automática",
      };

      expect(createDto.class).toBe("Sedán");
      expect(createDto.drive).toBe("FWD");
    });
  });

  describe("UpdateVehicleDto", () => {
    it("debe permitir actualizaciones parciales", () => {
      const updateDto: UpdateVehicleDto = {
        color: "Rojo",
        daily_price: 180000,
      };

      expect(updateDto.color).toBe("Rojo");
      expect(updateDto.daily_price).toBe(180000);
      expect(updateDto.make).toBeUndefined();
    });
  });

  describe("VehicleFilters", () => {
    it("debe crear filtros válidos para búsqueda", () => {
      const filters: VehicleFilters = {
        make: "Toyota",
        minYear: 2020,
        maxYear: 2024,
        minPrice: 100000,
        maxPrice: 200000,
        location: "Bogotá",
        class: "Sedán",
        fuel_type: "Gasolina",
      };

      expect(filters.make).toBe("Toyota");
      expect(filters.minYear).toBe(2020);
      expect(filters.maxYear).toBe(2024);
      expect(filters.location).toBe("Bogotá");
    });

    it("debe permitir filtros parciales", () => {
      const filters: VehicleFilters = {
        make: "Toyota",
        minPrice: 100000,
      };

      expect(filters.make).toBe("Toyota");
      expect(filters.minPrice).toBe(100000);
      expect(filters.maxPrice).toBeUndefined();
    });
  });
});
