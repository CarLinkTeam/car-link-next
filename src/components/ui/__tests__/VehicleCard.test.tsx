import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import VehicleCard from "../VehicleCard";
import { Vehicle } from "@/lib/types/entities/vehicle";

// Mock de Next.js components
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

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockVehicle: Vehicle = {
  id: "v1",
  make: "Toyota",
  vehicleModel: "Corolla",
  year: 2022,
  color: "Blanco",
  license_plate: "ABC123",
  class: "Sedán",
  drive: "FWD",
  fuel_type: "Gasolina",
  transmission: "Manual",
  daily_price: 50000,
  rental_conditions: "Combustible lleno",
  url_photos: [
    "https://example.com/car1.jpg",
    "https://example.com/car2.jpg",
    "https://example.com/car3.jpg",
  ],
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
};

describe("VehicleCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it("debe renderizar correctamente con información del vehículo", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("Corolla")).toBeInTheDocument();
    expect(screen.getByText("Toyota • 2022")).toBeInTheDocument();
    expect(screen.getByText("$ 50.000")).toBeInTheDocument();
    expect(screen.getByText("por día")).toBeInTheDocument();
  });

  it("debe mostrar la imagen del vehículo", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const image = screen.getByAltText("Toyota Corolla - Imagen 1");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/car1.jpg");
  });

  it("debe usar imagen placeholder cuando no hay fotos", () => {
    const vehicleWithoutPhotos = {
      ...mockVehicle,
      url_photos: [],
    };

    render(<VehicleCard vehicle={vehicleWithoutPhotos} />);

    const image = screen.getByAltText("Toyota Corolla - Imagen 1");
    expect(image).toHaveAttribute("src", "/placeholder-car.svg");
  });

  it("debe mostrar la clase del vehículo como badge", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("Sedán")).toBeInTheDocument();
  });

  it("debe mostrar los detalles del vehículo", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("Blanco")).toBeInTheDocument();
    expect(screen.getByText("Gasolina")).toBeInTheDocument();
    expect(screen.getByText("Manual")).toBeInTheDocument();
  });

  it("debe mostrar la ubicación del propietario", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("Bogotá")).toBeInTheDocument();
  });

  it("debe formatear el precio correctamente", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("$ 50.000")).toBeInTheDocument();
  });

  it("debe renderizar como enlace al detalle del vehículo", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/dashboard/vehicles/v1");
  });

  it("debe mostrar el botón 'Ver detalles'", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    expect(screen.getByText("Ver detalles")).toBeInTheDocument();
  });

  it("debe mostrar indicadores de imagen cuando hay múltiples fotos", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    // Los indicadores aparecen al hacer hover
    const card = screen.getByRole("link");
    fireEvent.mouseEnter(card);

    // Verificar que hay indicadores (puntos)
    const indicators = card.querySelectorAll("div div div");
    const indicatorDots = Array.from(indicators).filter((el) =>
      el.className.includes("rounded-full")
    );

    expect(indicatorDots.length).toBeGreaterThan(0);
  });

  it("no debe mostrar indicadores cuando solo hay una foto", () => {
    const vehicleWithOnePhoto = {
      ...mockVehicle,
      url_photos: ["https://example.com/car1.jpg"],
    };

    render(<VehicleCard vehicle={vehicleWithOnePhoto} />);

    const card = screen.getByRole("link");
    fireEvent.mouseEnter(card);

    // No debería haber indicadores
    const indicators = card.querySelectorAll("div[class*='rounded-full']");
    expect(indicators.length).toBe(0);
  });

  it("debe manejar el hover para mostrar overlay y efectos", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const card = screen.getByRole("link");

    // Test mouseEnter
    fireEvent.mouseEnter(card);

    // Test mouseLeave
    fireEvent.mouseLeave(card);

    // El componente debe manejar estos eventos sin errores
    expect(card).toBeInTheDocument();
  });

  it("debe mostrar emojis en los iconos de características", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    // Verificar que hay elementos con emojis
    expect(screen.getByText("🎨")).toBeInTheDocument();
    expect(screen.getByText("⛽")).toBeInTheDocument();
    expect(screen.getByText("⚙️")).toBeInTheDocument();
    expect(screen.getByText("📍")).toBeInTheDocument();
  });

  it("debe aplicar clases de hover correctamente", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const card = screen.getByRole("link");
    const cardDiv = card.firstChild as HTMLElement;
    expect(cardDiv).toHaveClass("hover:scale-105", "hover:shadow-glow-lg");
  });

  it("debe mantener la primera imagen cuando no hay hover", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const image = screen.getByAltText("Toyota Corolla - Imagen 1");
    expect(image).toHaveAttribute("src", "https://example.com/car1.jpg");
  });

  it("debe tener la estructura correcta de precios", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const priceSection = screen.getByText("$ 50.000").closest("div");
    expect(priceSection).toBeInTheDocument();
    expect(screen.getByText("por día")).toBeInTheDocument();
  });

  it("debe manejar vehículos con precios altos correctamente", () => {
    const expensiveVehicle = {
      ...mockVehicle,
      daily_price: 150000,
    };

    render(<VehicleCard vehicle={expensiveVehicle} />);

    expect(screen.getByText("$ 150.000")).toBeInTheDocument();
  });

  it("debe aplicar gradientes a los elementos correctos", () => {
    render(<VehicleCard vehicle={mockVehicle} />);

    const title = screen.getByText("Corolla");
    expect(title).toHaveClass("gradient-text");

    const price = screen.getByText("$ 50.000");
    expect(price).toHaveClass("gradient-text");
  });
});
