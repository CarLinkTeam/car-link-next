import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import RentalCard from "../RentalCard";
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

// Mock del store
jest.mock("@/store/user-rentals-store", () => ({
  useUserRentalsStore: jest.fn(),
}));

import { useUserRentalsStore } from "@/store/user-rentals-store";

const mockUseUserRentalsStore = useUserRentalsStore as jest.MockedFunction<
  typeof useUserRentalsStore
>;

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

describe("RentalCard Component", () => {
  const mockOnReviewClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUserRentalsStore.mockReturnValue({
      rentalReviews: {},
      addRentalReview: jest.fn(),
      removeRentalReview: jest.fn(),
    });
  });

  it("debe renderizar correctamente con información del rental", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
    expect(screen.getByText("2022 • Blanco")).toBeInTheDocument();
    expect(screen.getByText("$ 250.000")).toBeInTheDocument();
    expect(screen.getByText("Costo total")).toBeInTheDocument();
  });

  it("debe mostrar la imagen del vehículo", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
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
      <RentalCard
        rental={rentalWithoutPhoto}
        onReviewClick={mockOnReviewClick}
      />
    );

    const image = screen.getByAltText("Toyota Corolla");
    expect(image).toHaveAttribute("src", "/placeholder-car.svg");
  });

  it("debe mostrar las fechas correctamente formateadas", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    expect(screen.getByText("Fecha de inicio")).toBeInTheDocument();
    expect(screen.getByText("Fecha final")).toBeInTheDocument();
  });

  it("debe mostrar el estado correcto con su icono", () => {
    const { rerender } = render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    expect(screen.getByText("Completada")).toBeInTheDocument();

    // Test con estado confirmado - limpiar antes de re-renderizar
    const confirmedRental = { ...mockRental, status: "confirmed" as const };
    rerender(
      <RentalCard rental={confirmedRental} onReviewClick={mockOnReviewClick} />
    );
    expect(screen.getByText("Aprovada")).toBeInTheDocument();

    // Test con estado pendiente
    const pendingRental = { ...mockRental, status: "pending" as const };
    rerender(
      <RentalCard rental={pendingRental} onReviewClick={mockOnReviewClick} />
    );
    expect(screen.getByText("Pendiente")).toBeInTheDocument();

    // Test con estado cancelado
    const cancelledRental = { ...mockRental, status: "cancelled" as const };
    rerender(
      <RentalCard rental={cancelledRental} onReviewClick={mockOnReviewClick} />
    );
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("debe mostrar el botón de calificar cuando el estado es completed y no hay review", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    const reviewButton = screen.getByText("Calificar renta");
    expect(reviewButton).toBeInTheDocument();
  });

  it("debe mostrar mensaje cuando ya hay review", () => {
    mockUseUserRentalsStore.mockReturnValue({
      rentalReviews: { "1": true },
      addRentalReview: jest.fn(),
      removeRentalReview: jest.fn(),
    });

    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    expect(
      screen.getByText("Ya has calificado esta renta")
    ).toBeInTheDocument();
    expect(screen.queryByText("Calificar renta")).not.toBeInTheDocument();
  });

  it("no debe mostrar botón de review cuando el estado no es completed", () => {
    const pendingRental = { ...mockRental, status: "pending" as const };
    render(
      <RentalCard rental={pendingRental} onReviewClick={mockOnReviewClick} />
    );

    expect(screen.queryByText("Calificar renta")).not.toBeInTheDocument();
  });

  it("debe llamar onReviewClick cuando se hace clic en el botón de calificar", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    const reviewButton = screen.getByText("Calificar renta");
    fireEvent.click(reviewButton);

    expect(mockOnReviewClick).toHaveBeenCalledTimes(1);
    expect(mockOnReviewClick).toHaveBeenCalledWith(mockRental);
  });

  it("debe formatear el precio correctamente", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    expect(screen.getByText("$ 250.000")).toBeInTheDocument();
  });

  it("debe aplicar la clase correcta para el estado", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    const statusBadge = screen.getByText("Completada").closest("span");
    expect(statusBadge).toHaveClass(
      "text-green-600",
      "bg-green-50",
      "border-green-200"
    );
  });

  it("debe mostrar íconos de calendario para las fechas", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    // Verificar que las secciones de fechas están presentes
    expect(screen.getByText("Fecha de inicio")).toBeInTheDocument();
    expect(screen.getByText("Fecha final")).toBeInTheDocument();

    // Verificar que hay elementos con la clase de gradiente (contenedores de los íconos)
    const gradientElements = document.querySelectorAll(".bg-gradient-to-br");
    expect(gradientElements.length).toBeGreaterThanOrEqual(2);
  });

  it("debe aplicar gradientes a los elementos de precio", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    const price = screen.getByText("$ 250.000");
    expect(price).toHaveClass("gradient-text");

    const title = screen.getByText("Toyota Corolla");
    expect(title).toHaveClass("gradient-text");
  });

  it("debe mostrar estrella en el botón de calificar", () => {
    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    const reviewButton = screen.getByText("Calificar renta");
    const starIcon = reviewButton.querySelector("svg");
    expect(starIcon).toBeInTheDocument();
  });

  it("debe mostrar estrella en el mensaje de review completado", () => {
    mockUseUserRentalsStore.mockReturnValue({
      rentalReviews: { "1": true },
      addRentalReview: jest.fn(),
      removeRentalReview: jest.fn(),
    });

    render(
      <RentalCard rental={mockRental} onReviewClick={mockOnReviewClick} />
    );

    const reviewMessage = screen.getByText("Ya has calificado esta renta");
    const starIcon = reviewMessage.closest("span")?.querySelector("svg");
    expect(starIcon).toBeInTheDocument();
  });

  it("debe manejar estados de rental correctamente", () => {
    const states = ["completed", "confirmed", "pending", "cancelled"] as const;
    const expectedTexts = ["Completada", "Aprovada", "Pendiente", "Cancelada"];

    states.forEach((status, index) => {
      const testRental = { ...mockRental, status };
      const { unmount } = render(
        <RentalCard rental={testRental} onReviewClick={mockOnReviewClick} />
      );

      expect(screen.getByText(expectedTexts[index])).toBeInTheDocument();

      // Limpiar el componente después de cada test
      unmount();
    });
  });
});
