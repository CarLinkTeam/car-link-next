import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input } from "../Input";

// Mock del hook useToggle
jest.mock("@/hooks/useToggle", () => ({
  useToggle: jest.fn(),
}));

// Import del mock después de la declaración
import { useToggle } from "@/hooks/useToggle";

const mockUseToggle = useToggle as jest.MockedFunction<typeof useToggle>;

describe("Input Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock por defecto: showPassword = false, toggle function
    mockUseToggle.mockReturnValue([false, jest.fn()]);
  });

  it("debe renderizar correctamente con props básicas", () => {
    render(<Input placeholder="Ingrese texto" />);

    const input = screen.getByPlaceholderText("Ingrese texto");
    expect(input).toBeInTheDocument();
  });

  it("debe mostrar el label cuando se proporciona", () => {
    render(<Input label="Nombre" />);

    const label = screen.getByText("Nombre");
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe("LABEL");
  });

  it("debe mostrar asterisco cuando el campo es requerido", () => {
    render(<Input label="Email" required />);

    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass("text-primary-500");
  });

  it("debe aplicar la variante default por defecto", () => {
    render(<Input data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border", "border-secondary-300", "rounded-xl");
  });

  it("debe aplicar diferentes variantes correctamente", () => {
    const { rerender } = render(<Input variant="filled" data-testid="input" />);
    let input = screen.getByTestId("input");
    expect(input).toHaveClass("bg-secondary-100", "border-transparent");

    rerender(<Input variant="underlined" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveClass(
      "border-b-2",
      "border-secondary-300",
      "rounded-none"
    );
  });

  it("debe mostrar el icono cuando se proporciona", () => {
    const icon = <span data-testid="icon">📧</span>;
    render(<Input icon={icon} />);

    const iconElement = screen.getByTestId("icon");
    expect(iconElement).toBeInTheDocument();
  });

  it("debe ajustar el padding cuando hay icono", () => {
    const icon = <span>📧</span>;
    render(<Input icon={icon} data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("pl-11");
  });

  it("debe mostrar el mensaje de error", () => {
    render(<Input error="Este campo es requerido" />);

    const errorMessage = screen.getByText("Este campo es requerido");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.closest("div")).toHaveAttribute("role", "alert");
  });

  it("debe aplicar estilos de error al input", () => {
    render(<Input error="Error" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("border-primary-500");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("debe mostrar la descripción cuando no hay error", () => {
    render(<Input description="Ayuda para el campo" />);

    const description = screen.getByText("Ayuda para el campo");
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-xs", "text-secondary-500");
  });

  it("no debe mostrar la descripción cuando hay error", () => {
    render(<Input description="Ayuda" error="Error" />);

    expect(screen.queryByText("Ayuda")).not.toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("debe generar un ID automático si no se proporciona", () => {
    render(<Input label="Test" />);

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test");

    expect(input).toHaveAttribute("id");
    expect(label).toHaveAttribute("for", input.getAttribute("id"));
  });

  it("debe usar el ID proporcionado", () => {
    render(<Input id="custom-id" label="Test" />);

    const input = screen.getByRole("textbox");
    const label = screen.getByText("Test");

    expect(input).toHaveAttribute("id", "custom-id");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  describe("Campo de contraseña", () => {
    it("debe mostrar el botón de toggle para contraseñas", () => {
      render(<Input type="password" />);

      const toggleButton = screen.getByRole("button", {
        name: /mostrar contraseña/i,
      });
      expect(toggleButton).toBeInTheDocument();
    });

    it("debe llamar a toggle cuando se hace clic en el botón", () => {
      const mockToggle = jest.fn();
      mockUseToggle.mockReturnValue([false, mockToggle]);

      render(<Input type="password" />);

      const toggleButton = screen.getByRole("button", {
        name: /mostrar contraseña/i,
      });
      fireEvent.click(toggleButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it("debe ajustar el padding cuando hay toggle de contraseña", () => {
      render(<Input type="password" data-testid="input" />);

      const input = screen.getByTestId("input");
      expect(input).toHaveClass("pr-11");
    });

    it("no debe mostrar toggle si showPasswordToggle es false", () => {
      render(<Input type="password" showPasswordToggle={false} />);

      const toggleButton = screen.queryByRole("button");
      expect(toggleButton).not.toBeInTheDocument();
    });

    it("debe cambiar el tipo de input cuando se activa el toggle", () => {
      // Mock para simular que showPassword es true
      mockUseToggle.mockReturnValueOnce([true, jest.fn()]);

      render(<Input type="password" data-testid="input" />);

      const input = screen.getByTestId("input");
      expect(input).toHaveAttribute("type", "text");
    });
  });

  it("debe estar deshabilitado cuando disabled es true", () => {
    render(<Input disabled data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
  });

  it("debe aplicar clases personalizadas", () => {
    render(<Input className="custom-class" data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  it("debe manejar eventos onChange correctamente", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "test" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("debe pasar propiedades HTML adicionales", () => {
    render(<Input maxLength={10} data-testid="input" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("maxLength", "10");
  });

  it("debe usar forwardRef correctamente", () => {
    const ref = { current: null };
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
