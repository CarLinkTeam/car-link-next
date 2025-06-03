import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntityEditForm from "../entityEditForm";

describe("EntityEditForm", () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  const mockUserItem = {
    id: "1",
    fullName: "Juan Pérez",
    location: "Ciudad de México",
    phone: "555-1234",
    email: "juan@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar correctamente con campos editables", () => {
    render(
      <EntityEditForm
        entity="users"
        item={mockUserItem}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue("Juan Pérez")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Ciudad de México")).toBeInTheDocument();
    expect(screen.getByDisplayValue("555-1234")).toBeInTheDocument();
    expect(
      screen.queryByDisplayValue("juan@example.com")
    ).not.toBeInTheDocument();
  });

  it("debe permitir editar campos", () => {
    render(
      <EntityEditForm
        entity="users"
        item={mockUserItem}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    const nameInput = screen.getByDisplayValue("Juan Pérez");
    fireEvent.change(nameInput, { target: { value: "Juan Carlos" } });

    expect(screen.getByDisplayValue("Juan Carlos")).toBeInTheDocument();
  });

  it("debe llamar onCancel cuando se hace clic en cancelar", () => {
    render(
      <EntityEditForm
        entity="users"
        item={mockUserItem}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("debe llamar onSave con datos filtrados cuando se guarda", async () => {
    mockOnSave.mockResolvedValue(undefined);
    render(
      <EntityEditForm
        entity="users"
        item={mockUserItem}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Guardar" }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        fullName: "Juan Pérez",
        location: "Ciudad de México",
        phone: "555-1234",
      });
    });
  });
});
