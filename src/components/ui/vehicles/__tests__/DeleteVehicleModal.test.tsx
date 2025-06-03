import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DeleteVehicleModal } from "../DeleteVehicleModal";
import { Vehicle } from "@/lib/types/entities/vehicle";

// Mock de Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
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

describe("DeleteVehicleModal", () => {
  it("debe renderizar el modal cuando está abierto con vehículo", () => {
    render(
      <DeleteVehicleModal
        isOpen={true}
        vehicle={mockVehicle}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByText("Eliminar Vehículo")).toBeInTheDocument();
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("2023 • Blanco • ABC123")).toBeInTheDocument();
  });

  it("no debe renderizar cuando está cerrado", () => {
    render(
      <DeleteVehicleModal
        isOpen={false}
        vehicle={mockVehicle}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.queryByText("Eliminar Vehículo")).not.toBeInTheDocument();
  });

  it("no debe renderizar cuando no hay vehículo", () => {
    render(
      <DeleteVehicleModal
        isOpen={true}
        vehicle={null}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.queryByText("Eliminar Vehículo")).not.toBeInTheDocument();
  });

  it("debe llamar onConfirm cuando se hace clic en confirmar", () => {
    const onConfirmMock = jest.fn();

    render(
      <DeleteVehicleModal
        isOpen={true}
        vehicle={mockVehicle}
        onConfirm={onConfirmMock}
        onCancel={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Sí, eliminar"));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  it("debe llamar onCancel cuando se hace clic en cancelar", () => {
    const onCancelMock = jest.fn();

    render(
      <DeleteVehicleModal
        isOpen={true}
        vehicle={mockVehicle}
        onConfirm={jest.fn()}
        onCancel={onCancelMock}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  it("debe mostrar estado de carga cuando está eliminando", () => {
    render(
      <DeleteVehicleModal
        isOpen={true}
        vehicle={mockVehicle}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        isDeleting={true}
      />
    );

    expect(screen.getByText("Eliminando...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /eliminando/i })).toBeDisabled();
  });

  it("debe mostrar la imagen del vehículo cuando está disponible", () => {
    render(
      <DeleteVehicleModal
        isOpen={true}
        vehicle={mockVehicle}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByAltText("Toyota Corolla")).toBeInTheDocument();
  });
});
