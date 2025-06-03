import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Alert } from "../Alert";

describe("Alert Component", () => {
  it("debe renderizar correctamente con props básicas", () => {
    render(<Alert type="info" message="Mensaje de prueba" />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Mensaje de prueba");
  });

  it("debe mostrar el título cuando se proporciona", () => {
    render(<Alert type="success" message="Mensaje" title="Título de prueba" />);

    const title = screen.getByText("Título de prueba");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H3");
  });

  it("debe aplicar estilos correctos para type success", () => {
    render(<Alert type="success" message="Éxito" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass(
      "bg-green-50/80",
      "border-green-200",
      "text-green-800"
    );
  });

  it("debe aplicar estilos correctos para type error", () => {
    render(<Alert type="error" message="Error" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass(
      "bg-primary-50/80",
      "border-primary-200",
      "text-primary-800"
    );
  });

  it("debe aplicar estilos correctos para type warning", () => {
    render(<Alert type="warning" message="Advertencia" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass(
      "bg-accent-50/80",
      "border-accent-200",
      "text-accent-800"
    );
  });

  it("debe aplicar estilos correctos para type info", () => {
    render(<Alert type="info" message="Información" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass(
      "bg-secondary-50/80",
      "border-secondary-200",
      "text-secondary-800"
    );
  });

  it("debe mostrar el icono correcto para cada tipo", () => {
    const { rerender } = render(<Alert type="success" message="Mensaje" />);
    let svg = screen.getByRole("alert").querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-5", "h-5");

    rerender(<Alert type="error" message="Mensaje" />);
    svg = screen.getByRole("alert").querySelector("svg");
    expect(svg).toBeInTheDocument();

    rerender(<Alert type="warning" message="Mensaje" />);
    svg = screen.getByRole("alert").querySelector("svg");
    expect(svg).toBeInTheDocument();

    rerender(<Alert type="info" message="Mensaje" />);
    svg = screen.getByRole("alert").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("debe mostrar el botón de cerrar cuando onClose está proporcionado", () => {
    const handleClose = jest.fn();
    render(<Alert type="info" message="Mensaje" onClose={handleClose} />);

    const closeButton = screen.getByLabelText("Cerrar alerta");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton.tagName).toBe("BUTTON");
  });

  it("debe llamar a onClose cuando se hace clic en el botón de cerrar", () => {
    const handleClose = jest.fn();
    render(<Alert type="info" message="Mensaje" onClose={handleClose} />);

    const closeButton = screen.getByLabelText("Cerrar alerta");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("no debe mostrar el botón de cerrar cuando onClose no está proporcionado", () => {
    render(<Alert type="info" message="Mensaje" />);

    const closeButton = screen.queryByLabelText("Cerrar alerta");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("debe aplicar clases personalizadas", () => {
    render(<Alert type="info" message="Mensaje" className="custom-class" />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("custom-class");
  });

  it("debe usar forwardRef correctamente", () => {
    const ref = { current: null };
    render(<Alert ref={ref} type="info" message="Mensaje" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("debe aplicar los colores de título correctos según el tipo", () => {
    const { rerender } = render(
      <Alert type="success" message="Mensaje" title="Título" />
    );
    let title = screen.getByText("Título");
    expect(title).toHaveClass("text-green-800");

    rerender(<Alert type="error" message="Mensaje" title="Título" />);
    title = screen.getByText("Título");
    expect(title).toHaveClass("text-primary-800");

    rerender(<Alert type="warning" message="Mensaje" title="Título" />);
    title = screen.getByText("Título");
    expect(title).toHaveClass("text-accent-800");

    rerender(<Alert type="info" message="Mensaje" title="Título" />);
    title = screen.getByText("Título");
    expect(title).toHaveClass("text-secondary-800");
  });

  it("debe aplicar los colores de mensaje correctos según el tipo", () => {
    const { rerender } = render(<Alert type="success" message="Mensaje" />);
    let message = screen.getByText("Mensaje");
    expect(message).toHaveClass("text-green-700");

    rerender(<Alert type="error" message="Mensaje" />);
    message = screen.getByText("Mensaje");
    expect(message).toHaveClass("text-primary-700");

    rerender(<Alert type="warning" message="Mensaje" />);
    message = screen.getByText("Mensaje");
    expect(message).toHaveClass("text-accent-700");

    rerender(<Alert type="info" message="Mensaje" />);
    message = screen.getByText("Mensaje");
    expect(message).toHaveClass("text-secondary-700");
  });
});
