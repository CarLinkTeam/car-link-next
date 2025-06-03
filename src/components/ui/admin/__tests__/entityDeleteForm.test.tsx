import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntityDeleteForm from "../entityDeleteForm";

describe("EntityDeleteForm", () => {
  const mockOnDelete = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar correctamente", () => {
    render(
      <EntityDeleteForm onDelete={mockOnDelete} onCancel={mockOnCancel} />
    );

    expect(
      screen.getByText(/¿Estás seguro de este esta eliminación?/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Eliminar" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Cancelar" })
    ).toBeInTheDocument();
  });

  it("debe llamar onCancel cuando se hace clic en cancelar", () => {
    render(
      <EntityDeleteForm onDelete={mockOnDelete} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("debe llamar onDelete cuando se hace clic en eliminar", async () => {
    mockOnDelete.mockResolvedValue(undefined);
    render(
      <EntityDeleteForm onDelete={mockOnDelete} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    
    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });

  it("debe mostrar error cuando onDelete falla", async () => {
    mockOnDelete.mockRejectedValue(new Error("Test error"));
    render(
      <EntityDeleteForm onDelete={mockOnDelete} onCancel={mockOnCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() => {
      expect(
        screen.getByText("Error al eliminar el elemento.")
      ).toBeInTheDocument();
    });
  });
});
