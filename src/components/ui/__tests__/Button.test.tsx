import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";

describe("Button Component", () => {
  it("debe renderizar correctamente con props por defecto", () => {
    render(<Button>Texto del botón</Button>);

    const button = screen.getByRole("button", { name: /texto del botón/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Texto del botón");
  });

  it("debe aplicar la variante primary por defecto", () => {
    render(<Button>Botón</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("btn-gradient");
  });

  it("debe aplicar diferentes variantes correctamente", () => {
    const { rerender } = render(<Button variant="secondary">Botón</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary-100");

    rerender(<Button variant="outline">Botón</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("border-2", "border-primary-600");

    rerender(<Button variant="ghost">Botón</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary-600");

    rerender(<Button variant="destructive">Botón</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-700");
  });

  it("debe aplicar diferentes tamaños correctamente", () => {
    const { rerender } = render(<Button size="sm">Botón</Button>);
    let button = screen.getByRole("button");
    expect(button).toHaveClass("px-3", "py-1.5", "text-sm");

    rerender(<Button size="md">Botón</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-6", "py-3", "text-base");

    rerender(<Button size="lg">Botón</Button>);
    button = screen.getByRole("button");
    expect(button).toHaveClass("px-8", "py-4", "text-lg");
  });

  it("debe mostrar el spinner de loading cuando isLoading es true", () => {
    render(<Button isLoading>Botón</Button>);

    const button = screen.getByRole("button");
    const spinner = button.querySelector("svg");

    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");
    expect(button).toHaveClass("cursor-wait");
  });

  it("debe estar deshabilitado cuando isLoading es true", () => {
    render(<Button isLoading>Botón</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("debe estar deshabilitado cuando disabled es true", () => {
    render(<Button disabled>Botón</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
  });

  it("debe aplicar clases personalizadas", () => {
    render(<Button className="custom-class">Botón</Button>);

    const button = screen.getByRole("button");
    expect(button).toHaveClass("custom-class");
  });

  it("debe manejar eventos onClick correctamente", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Botón</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("no debe ejecutar onClick cuando está disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Botón
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("no debe ejecutar onClick cuando está loading", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Botón
      </Button>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("debe mostrar el spinner con el tamaño correcto según el size", () => {
    const { rerender } = render(
      <Button isLoading size="sm">
        Botón
      </Button>
    );
    let button = screen.getByRole("button");
    let spinner = button.querySelector("svg");
    expect(spinner).toHaveClass("h-4", "w-4");

    rerender(
      <Button isLoading size="md">
        Botón
      </Button>
    );
    button = screen.getByRole("button");
    spinner = button.querySelector("svg");
    expect(spinner).toHaveClass("h-5", "w-5");

    rerender(
      <Button isLoading size="lg">
        Botón
      </Button>
    );
    button = screen.getByRole("button");
    spinner = button.querySelector("svg");
    expect(spinner).toHaveClass("h-6", "w-6");
  });

  it("debe aplicar opacidad al texto cuando está loading", () => {
    render(<Button isLoading>Texto del botón</Button>);

    const button = screen.getByRole("button");
    const textSpan = button.querySelector("span");

    expect(textSpan).toHaveClass("opacity-70");
    expect(textSpan).toHaveTextContent("Texto del botón");
  });

  it("debe pasar propiedades HTML adicionales al elemento button", () => {
    render(
      <Button type="submit" data-testid="test-button">
        Botón
      </Button>
    );

    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("debe usar forwardRef correctamente", () => {
    const ref = { current: null };
    render(<Button ref={ref}>Botón</Button>);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
