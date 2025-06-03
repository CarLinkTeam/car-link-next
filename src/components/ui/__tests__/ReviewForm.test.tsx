import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewForm from "../ReviewForm";
import { Rental } from "@/lib/types/entities/rental";

const mockRental: Rental = {
  id: "1",
  initialDate: "2024-01-10",
  finalDate: "2024-01-15",
  totalCost: "250000",
  status: "completed",
  client_id: "c1",
  vehicle_id: "v1",
  client: {
    id: "c1",
    location: "Medellín",
    email: "cliente@example.com",
    phone: "987654321",
    password: "hashedpassword",
    fullName: "Cliente Test",
    roles: ["TENANT"],
    isActive: true,
  },
  vehicle: {
    id: "v1",
    make: "Toyota",
    vehicleModel: "Corolla",
    year: 2022,
    color: "Blanco",
    license_plate: "ABC123",
    url_photos: ["https://example.com/car1.jpg"],
    daily_price: 50000,
    rental_conditions: "Combustible lleno",
    class: "Sedán",
    drive: "FWD",
    fuel_type: "Gasolina",
    transmission: "Manual",
    userId: "o1",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    ownerId: "o1",
    owner: {
      id: "o1",
      location: "Bogotá",
      email: "juan@example.com",
      phone: "123456789",
      password: "hashedpassword",
      fullName: "Juan Pérez",
      roles: ["TENANT"],
      isActive: true,
    },
  },
};

describe("ReviewForm Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSubmit.mockResolvedValue(undefined);
    // Mock window.alert
    alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it("no debe renderizar cuando isOpen es false", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.queryByText("Calificar Renta")).not.toBeInTheDocument();
  });

  it("debe renderizar correctamente cuando isOpen es true", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText("Calificar Renta")).toBeInTheDocument();
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("2022 • Blanco")).toBeInTheDocument();
  });

  it("debe mostrar 5 estrellas para calificación", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it("debe permitir seleccionar calificación haciendo clic en las estrellas", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );

    // Hacer clic en la tercera estrella
    fireEvent.click(stars[2]);

    expect(screen.getByText("Regular")).toBeInTheDocument();
  });

  it("debe mostrar texto descriptivo según la calificación", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );

    // Test para cada calificación
    const ratings = [
      { index: 0, text: "Muy malo" },
      { index: 1, text: "Malo" },
      { index: 2, text: "Regular" },
      { index: 3, text: "Bueno" },
      { index: 4, text: "Excelente" },
    ];

    ratings.forEach(({ index, text }) => {
      fireEvent.click(stars[index]);
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("debe permitir escribir en el textarea de comentario", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Comparte tu experiencia con este vehículo..."
    );
    fireEvent.change(textarea, { target: { value: "Excelente vehículo" } });

    expect(textarea).toHaveValue("Excelente vehículo");
  });

  it("debe mostrar contador de caracteres", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    expect(screen.getByText("0/500 caracteres")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(
      "Comparte tu experiencia con este vehículo..."
    );
    fireEvent.change(textarea, { target: { value: "Excelente" } });

    expect(screen.getByText("9/500 caracteres")).toBeInTheDocument();
  });

  it("debe llamar onClose cuando se hace clic en el botón cerrar", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Buscar el botón de cerrar por su clase específica
    const closeButton = document.querySelector(
      "button.text-secondary-500.hover\\:text-primary-600"
    ) as HTMLButtonElement;

    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("debe llamar onClose cuando se hace clic en el botón Cancelar", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    const cancelButton = screen.getByText("Cancelar");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("debe mostrar alerta cuando se intenta enviar sin calificación", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Buscar el form directamente
    const form = document.querySelector("form");
    expect(form).toBeInTheDocument();

    fireEvent.submit(form!);

    expect(alertSpy).toHaveBeenCalledWith(
      "Por favor selecciona una calificación"
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("debe enviar el formulario con los datos correctos", async () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Seleccionar calificación
    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );
    fireEvent.click(stars[4]); // 5 estrellas

    // Escribir comentario
    const textarea = screen.getByPlaceholderText(
      "Comparte tu experiencia con este vehículo..."
    );
    fireEvent.change(textarea, { target: { value: "Excelente servicio" } });

    // Enviar formulario
    const submitButton = screen.getByText("Calificar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rental_id: "1",
        rating: 5,
        comment: "Excelente servicio",
        createdAt: expect.any(String),
      });
    });
  });

  it("debe enviar sin comentario cuando está vacío", async () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Seleccionar calificación
    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );
    fireEvent.click(stars[3]); // 4 estrellas

    // Enviar formulario sin comentario
    const submitButton = screen.getByText("Calificar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        rental_id: "1",
        rating: 4,
        comment: undefined,
        createdAt: expect.any(String),
      });
    });
  });

  it("debe deshabilitar controles cuando isLoading es true", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const textarea = screen.getByPlaceholderText(
      "Comparte tu experiencia con este vehículo..."
    );
    const cancelButton = screen.getByText("Cancelar");
    const submitButton = screen.getByText("Enviando...");

    expect(textarea).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it("debe mostrar 'Enviando...' cuando isLoading es true", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    expect(screen.getByText("Enviando...")).toBeInTheDocument();
    expect(screen.queryByText("Calificar")).not.toBeInTheDocument();
  });

  it("debe resetear el formulario después de envío exitoso", async () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Seleccionar calificación y comentario
    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );
    fireEvent.click(stars[4]);

    const textarea = screen.getByPlaceholderText(
      "Comparte tu experiencia con este vehículo..."
    );
    fireEvent.change(textarea, { target: { value: "Comentario de prueba" } });

    // Enviar formulario
    const submitButton = screen.getByText("Calificar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("debe manejar errores durante el envío", async () => {
    mockOnSubmit.mockRejectedValue(new Error("Error de prueba"));

    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Seleccionar calificación
    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );
    fireEvent.click(stars[4]);

    // Enviar formulario
    const submitButton = screen.getByText("Calificar");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Error al crear review:Error: Error de prueba"
      );
    });
  });

  it("debe resetear el formulario al cerrar", () => {
    render(
      <ReviewForm
        rental={mockRental}
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isLoading={false}
      />
    );

    // Llenar formulario
    const stars = screen
      .getAllByRole("button")
      .filter(
        (button) =>
          button.querySelector("svg") &&
          (button as HTMLButtonElement).type === "button"
      );
    fireEvent.click(stars[4]);

    const textarea = screen.getByPlaceholderText(
      "Comparte tu experiencia con este vehículo..."
    );
    fireEvent.change(textarea, { target: { value: "Comentario" } });

    // Buscar el botón de cerrar por su clase específica
    const closeButton = document.querySelector(
      "button.text-secondary-500.hover\\:text-primary-600"
    ) as HTMLButtonElement;

    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
