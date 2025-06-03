import React, { ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { VehicleForm } from "../VehicleForm";
import { useCreateVehicle } from "@/hooks/vehicles/useCreateVehicle";
import { useUpdateVehicle } from "@/hooks/vehicles/useUpdateVehicle";
import { Vehicle } from "@/lib/types/entities/vehicle";

// Mock de los hooks
jest.mock("@/hooks/vehicles/useCreateVehicle", () => ({
  useCreateVehicle: jest.fn(),
}));

jest.mock("@/hooks/vehicles/useUpdateVehicle", () => ({
  useUpdateVehicle: jest.fn(),
}));

// Mock de next-cloudinary
jest.mock("next-cloudinary", () => ({
  CldUploadWidget: ({ children }: { children: ReactNode }) => (
    <div data-testid="upload-widget">{children}</div>
  ),
}));

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

const mockCreateVehicle = {
  createVehicle: jest.fn(),
  isLoading: false,
  error: null,
  success: false,
  clearMessages: jest.fn(),
};

const mockUpdateVehicle = {
  updateVehicle: jest.fn(),
  isLoading: false,
  error: null,
  success: false,
  clearMessages: jest.fn(),
};

describe("VehicleForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCreateVehicle as jest.Mock).mockReturnValue(mockCreateVehicle);
    (useUpdateVehicle as jest.Mock).mockReturnValue(mockUpdateVehicle);
  });

  it("debe renderizar el formulario en modo crear", () => {
    render(
      <VehicleForm mode="create" onSuccess={jest.fn()} onCancel={jest.fn()} />
    );

    expect(screen.getByText("Modelo del Vehículo *")).toBeInTheDocument();
    expect(screen.getByText("Marca *")).toBeInTheDocument();
    expect(screen.getByText("Color *")).toBeInTheDocument();
    expect(screen.getByText("Año *")).toBeInTheDocument();
  });

  it("debe renderizar el formulario en modo editar con datos del vehículo", () => {
    render(
      <VehicleForm
        mode="edit"
        vehicle={mockVehicle}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue("Corolla")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Toyota")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Blanco")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2023")).toBeInTheDocument();
  });

  it("debe mostrar campos adicionales en modo editar", () => {
    render(
      <VehicleForm
        mode="edit"
        vehicle={mockVehicle}
        onSuccess={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText("Clase")).toBeInTheDocument();
    expect(screen.getByText("Tracción")).toBeInTheDocument();
    expect(screen.getByText("Tipo de Combustible")).toBeInTheDocument();
    expect(screen.getByText("Transmisión")).toBeInTheDocument();
  });

  it("debe llamar onCancel cuando se hace clic en cancelar", () => {
    const onCancelMock = jest.fn();

    render(
      <VehicleForm
        mode="create"
        onSuccess={jest.fn()}
        onCancel={onCancelMock}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("debe deshabilitar botones cuando está cargando", () => {
    (useCreateVehicle as jest.Mock).mockReturnValue({
      ...mockCreateVehicle,
      isLoading: true,
    });

    render(
      <VehicleForm mode="create" onSuccess={jest.fn()} onCancel={jest.fn()} />
    );

    expect(screen.getByRole("button", { name: /creando/i })).toBeDisabled();
  });

  it("debe mostrar mensaje de error cuando hay error", () => {
    (useCreateVehicle as jest.Mock).mockReturnValue({
      ...mockCreateVehicle,
      error: "Error de prueba",
    });

    render(
      <VehicleForm mode="create" onSuccess={jest.fn()} onCancel={jest.fn()} />
    );

    expect(screen.getByText("Error de prueba")).toBeInTheDocument();
  });
});
