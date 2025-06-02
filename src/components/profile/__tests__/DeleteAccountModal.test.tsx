import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DeleteAccountModal } from "../DeleteAccountModal";

// Mock del hook useDeleteUser
jest.mock("@/hooks/useDeleteUser", () => ({
  useDeleteUser: jest.fn(),
}));

import { useDeleteUser } from "@/hooks/useDeleteUser";

describe("DeleteAccountModal Component", () => {
  const mockOnClose = jest.fn();
  const mockDeleteUser = jest.fn();
  const mockClearError = jest.fn();
  const mockUseDeleteUser = useDeleteUser as jest.MockedFunction<
    typeof useDeleteUser
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseDeleteUser.mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: false,
      error: null,
      clearError: mockClearError,
    });
  });

  it("no debe renderizar cuando isOpen es false", () => {
    render(
      <DeleteAccountModal
        isOpen={false}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    expect(screen.queryByText("Eliminar Cuenta")).not.toBeInTheDocument();
  });

  it("debe renderizar correctamente cuando isOpen es true", () => {
    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    expect(
      screen.getByRole("heading", { name: "Eliminar Cuenta" })
    ).toBeInTheDocument();
    expect(
      screen.getByText("¡Esta acción es irreversible!")
    ).toBeInTheDocument();
    expect(screen.getByText(/Al eliminar tu cuenta/)).toBeInTheDocument();
    expect(screen.getByText("test@test.com")).toBeInTheDocument();
  });

  it("debe mostrar el campo de confirmación de texto", () => {
    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const input = screen.getByPlaceholderText("ELIMINAR MI CUENTA");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("debe habilitar el botón de eliminar cuando se escribe 'ELIMINAR MI CUENTA'", () => {
    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const input = screen.getByPlaceholderText("ELIMINAR MI CUENTA");
    const deleteButton = screen.getByRole("button", {
      name: "Eliminar Cuenta",
    });

    expect(deleteButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "ELIMINAR MI CUENTA" } });

    expect(deleteButton).not.toBeDisabled();
  });

  it("debe llamar onClose cuando se hace clic en cancelar", () => {
    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("debe llamar deleteUser cuando se confirma correctamente", async () => {
    mockDeleteUser.mockResolvedValue(true);

    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const input = screen.getByPlaceholderText("ELIMINAR MI CUENTA");
    const deleteButton = screen.getByRole("button", {
      name: "Eliminar Cuenta",
    });

    fireEvent.change(input, { target: { value: "ELIMINAR MI CUENTA" } });
    fireEvent.click(deleteButton);

    expect(mockDeleteUser).toHaveBeenCalledTimes(1);
  });

  it("debe deshabilitar botones cuando isLoading es true", () => {
    mockUseDeleteUser.mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: true,
      error: null,
      clearError: mockClearError,
    });

    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const input = screen.getByPlaceholderText("ELIMINAR MI CUENTA");
    const cancelButton = screen.getByRole("button", { name: /cancelar/i });
    const deleteButton = screen.getByRole("button", { name: /eliminando/i });

    fireEvent.change(input, { target: { value: "ELIMINAR MI CUENTA" } });

    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveTextContent("Eliminando...");
  });

  it("debe mostrar mensaje de error cuando hay error", () => {
    mockUseDeleteUser.mockReturnValue({
      deleteUser: mockDeleteUser,
      isLoading: false,
      error: "Error al eliminar la cuenta",
      clearError: mockClearError,
    });

    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    expect(screen.getByText("Error al eliminar cuenta")).toBeInTheDocument();
    expect(screen.getByText("Error al eliminar la cuenta")).toBeInTheDocument();
  });

  it("debe validar que el texto sea exactamente 'ELIMINAR MI CUENTA'", () => {
    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const input = screen.getByPlaceholderText("ELIMINAR MI CUENTA");
    const deleteButton = screen.getByRole("button", {
      name: "Eliminar Cuenta",
    });

    // Probar con texto incorrecto
    fireEvent.change(input, { target: { value: "eliminar mi cuenta" } });
    expect(deleteButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "ELIMINAR" } });
    expect(deleteButton).toBeDisabled();

    fireEvent.change(input, { target: { value: "ELIMINAR MI CUENTA " } });
    expect(deleteButton).toBeDisabled();

    // Probar con texto correcto
    fireEvent.change(input, { target: { value: "ELIMINAR MI CUENTA" } });
    expect(deleteButton).not.toBeDisabled();
  });

  it("debe limpiar error y resetear formulario al cerrar", () => {
    render(
      <DeleteAccountModal
        isOpen={true}
        onClose={mockOnClose}
        userEmail="test@test.com"
      />
    );

    const input = screen.getByPlaceholderText("ELIMINAR MI CUENTA");
    fireEvent.change(input, { target: { value: "ELIMINAR MI CUENTA" } });

    const closeButton = screen.getByRole("button", { name: "" }); // Botón X
    fireEvent.click(closeButton);

    expect(mockClearError).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
