import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { EditProfileForm } from "../EditProfileForm";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { AuthUser } from "@/lib/types/entities/user";

// Mock del hook useUpdateProfile
jest.mock("@/hooks/useUpdateProfile", () => ({
  useUpdateProfile: jest.fn(),
}));

const mockUser: AuthUser = {
  id: "user-123",
  email: "test@example.com",
  fullName: "Usuario Test",
  phone: "+57 300 123 4567",
  location: "Bogotá",
  roles: ["TENANT"],
  isActive: true,
};

const mockUseUpdateProfile = {
  updateProfile: jest.fn(),
  isLoading: false,
  error: null,
  success: false,
  clearMessages: jest.fn(),
};

describe("EditProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUpdateProfile as jest.Mock).mockReturnValue(mockUseUpdateProfile);
  });

  it("debe renderizar el formulario cuando está abierto", () => {
    render(
      <EditProfileForm
        user={mockUser}
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByText("Editar Perfil")).toBeInTheDocument();
    expect(screen.getByLabelText("Nombre Completo")).toBeInTheDocument();
    expect(screen.getByLabelText("Teléfono")).toBeInTheDocument();
    expect(screen.getByLabelText("Ubicación")).toBeInTheDocument();
  });

  it("no debe renderizar cuando está cerrado", () => {
    render(
      <EditProfileForm
        user={mockUser}
        isOpen={false}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.queryByText("Editar Perfil")).not.toBeInTheDocument();
  });

  it("debe inicializar los campos con los datos del usuario", () => {
    render(
      <EditProfileForm
        user={mockUser}
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByDisplayValue("Usuario Test")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+57 300 123 4567")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Bogotá")).toBeInTheDocument();
  });

  it("debe llamar onClose cuando se hace clic en cancelar", () => {
    const onCloseMock = jest.fn();

    render(
      <EditProfileForm
        user={mockUser}
        isOpen={true}
        onClose={onCloseMock}
        onSuccess={jest.fn()}
      />
    );

    fireEvent.click(screen.getByText("Cancelar"));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("debe deshabilitar el formulario cuando está cargando", () => {
    (useUpdateProfile as jest.Mock).mockReturnValue({
      ...mockUseUpdateProfile,
      isLoading: true,
    });

    render(
      <EditProfileForm
        user={mockUser}
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByText("Guardando...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /guardando/i })).toBeDisabled();
  });

  it("debe mostrar mensaje de error cuando hay error", () => {
    (useUpdateProfile as jest.Mock).mockReturnValue({
      ...mockUseUpdateProfile,
      error: "Error de prueba",
    });

    render(
      <EditProfileForm
        user={mockUser}
        isOpen={true}
        onClose={jest.fn()}
        onSuccess={jest.fn()}
      />
    );

    expect(screen.getByText("Error de prueba")).toBeInTheDocument();
  });
});
