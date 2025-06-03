// DetailItem.test.tsx
import { render, screen } from "@testing-library/react";
import { DetailItem } from "../DetailItemPage";

describe("DetailItem", () => {
  it("debe renderizar el label y el value correctamente", () => {
    render(<DetailItem label="Nombre" value="Alejandro" />);

    expect(screen.getByText("Nombre")).toBeInTheDocument();
    expect(screen.getByText("Alejandro")).toBeInTheDocument();
  });

  it("debe renderizar valores con nodos React", () => {
    render(<DetailItem label="Estado" value={<strong>Activo</strong>} />);

    expect(screen.getByText("Estado")).toBeInTheDocument();
    expect(screen.getByText("Activo")).toBeInTheDocument();
    expect(screen.getByText("Activo").tagName).toBe("STRONG");
  });

  it("aplica las clases correctamente", () => {
    render(<DetailItem label="Edad" value="30" />);

    const label = screen.getByText("Edad");
    const value = screen.getByText("30");

    expect(label).toHaveClass("text-gray-500", "font-medium");
    expect(value).toHaveClass("text-gray-800");
  });
});
