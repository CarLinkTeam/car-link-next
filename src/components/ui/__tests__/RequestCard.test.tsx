import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RentalRequestCard from "../RequestCard";
import { Rental } from "@/lib/types/entities/rental";

// Mock de Next.js Image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} {...props} />,
}));

const mockRental: Rental = {
  id: "1",
  initialDate: "2024-01-10",
  finalDate: "2024-01-15",
  totalCost: "250000",
  status: "pending",
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

describe("RentalRequestCard Component", () => {
  const mockOnAccept = jest.fn();
  const mockOnReject = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar correctamente con información del rental", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("2022 • Blanco")).toBeInTheDocument();
    expect(screen.getByText("$ 250.000")).toBeInTheDocument();
  });

  it("debe mostrar la imagen del vehículo", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const image = screen.getByAltText("Toyota Corolla");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/car1.jpg");
  });

  it("debe usar imagen placeholder cuando no hay foto", () => {
    const rentalWithoutPhoto = {
      ...mockRental,
      vehicle: {
        ...mockRental.vehicle,
        url_photos: [],
      },
    };

    render(
      <RentalRequestCard
        rental={rentalWithoutPhoto}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const image = screen.getByAltText("Toyota Corolla");
    expect(image).toHaveAttribute("src", "/placeholder-car.svg");
  });

  it("debe mostrar las fechas correctamente formateadas", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText(/Inicio:/)).toBeInTheDocument();
    expect(screen.getByText(/Fin:/)).toBeInTheDocument();
  });

  it("debe formatear el precio correctamente", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("$ 250.000")).toBeInTheDocument();
    expect(screen.getByText("Costo total")).toBeInTheDocument();
  });

  it("debe mostrar el estado correcto con su icono", () => {
    const { rerender } = render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    expect(screen.getByText("Pendiente")).toBeInTheDocument();

    // Test con estado completado
    const completedRental = { ...mockRental, status: "completed" as const };
    rerender(
      <RentalRequestCard
        rental={completedRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );
    expect(screen.getByText("Completada")).toBeInTheDocument();

    // Test con estado confirmado
    const confirmedRental = { ...mockRental, status: "confirmed" as const };
    rerender(
      <RentalRequestCard
        rental={confirmedRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );
    expect(screen.getByText("Aprobada")).toBeInTheDocument();

    // Test con estado cancelado
    const cancelledRental = { ...mockRental, status: "cancelled" as const };
    rerender(
      <RentalRequestCard
        rental={cancelledRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("debe mostrar botones de aceptar y rechazar cuando el estado es pending", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const acceptButton = screen.getByText("Aceptar");
    const rejectButton = screen.getByText("Rechazar");

    expect(acceptButton).toBeInTheDocument();
    expect(rejectButton).toBeInTheDocument();
  });

  it("no debe mostrar botones cuando el estado no es pending", () => {
    const completedRental = { ...mockRental, status: "completed" as const };
    render(
      <RentalRequestCard
        rental={completedRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    expect(screen.queryByText("Aceptar")).not.toBeInTheDocument();
    expect(screen.queryByText("Rechazar")).not.toBeInTheDocument();
  });

  it("debe llamar onAccept cuando se hace clic en el botón Aceptar", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const acceptButton = screen.getByText("Aceptar");
    fireEvent.click(acceptButton);

    expect(mockOnAccept).toHaveBeenCalledTimes(1);
    expect(mockOnAccept).toHaveBeenCalledWith("1");
  });

  it("debe llamar onReject cuando se hace clic en el botón Rechazar", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const rejectButton = screen.getByText("Rechazar");
    fireEvent.click(rejectButton);

    expect(mockOnReject).toHaveBeenCalledTimes(1);
    expect(mockOnReject).toHaveBeenCalledWith("1");
  });

  it("debe aplicar la clase correcta para el estado", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const statusBadge = screen.getByText("Pendiente").closest("span");
    expect(statusBadge).toHaveClass(
      "text-yellow-600",
      "bg-yellow-50",
      "border-yellow-200"
    );
  });

  it("debe mostrar el ícono de carro en el título", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    const carIcon = screen.getByRole("heading").querySelector("svg");
    expect(carIcon).toBeInTheDocument();
  });

  it("debe mostrar íconos de calendario para las fechas", () => {
    render(
      <RentalRequestCard
        rental={mockRental}
        onAccept={mockOnAccept}
        onReject={mockOnReject}
      />
    );

    // Verificar que las secciones de fechas están presentes
    expect(screen.getByText(/Inicio:/)).toBeInTheDocument();
    expect(screen.getByText(/Fin:/)).toBeInTheDocument();

    // Verificar que hay elementos con la clase de gradiente (contenedores de los íconos)
    const gradientElements = document.querySelectorAll(".bg-gradient-to-br");
    expect(gradientElements.length).toBeGreaterThanOrEqual(2);
  });
});
