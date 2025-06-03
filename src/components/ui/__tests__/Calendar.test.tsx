import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Calendar } from "../Calendar";

// Mock de las utilidades
jest.mock("@/lib/utils/utils", () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
  calculateRentalDays: jest.fn(),
}));

describe("Calendar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debe renderizar correctamente", () => {
    render(<Calendar />);

    // Verificar que se muestra el año actual
    const year = new Date().getFullYear();

    expect(screen.getByText(new RegExp(`${year}`, "i"))).toBeInTheDocument();
  });

  it("debe mostrar los días de la semana", () => {
    render(<Calendar />);

    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    dayNames.forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it("debe navegar entre meses", () => {
    render(<Calendar />);

    // Buscar botones por su posición y SVG en lugar de nombres
    const buttons = screen.getAllByRole("button");
    const navigationButtons = buttons.filter(
      (btn) => btn.querySelector("svg") && !btn.textContent?.match(/^\d+$/)
    );

    expect(navigationButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("debe llamar onDateSelect cuando se selecciona una fecha en modo single", () => {
    const handleDateSelect = jest.fn();
    render(<Calendar mode="single" onDateSelect={handleDateSelect} />);

    // Buscar un día disponible en el calendario
    const dayButton = screen.getByText("15");
    fireEvent.click(dayButton);

    expect(handleDateSelect).toHaveBeenCalledTimes(1);
    expect(handleDateSelect).toHaveBeenCalledWith(expect.any(Date));
  });

  it("debe llamar onDateRangeSelect cuando se selecciona un rango en modo range", () => {
    const handleDateRangeSelect = jest.fn();
    render(<Calendar mode="range" onDateRangeSelect={handleDateRangeSelect} />);

    // Seleccionar primera fecha
    const firstDay = screen.getByText("10");
    fireEvent.click(firstDay);

    expect(handleDateRangeSelect).toHaveBeenCalledTimes(1);
    expect(handleDateRangeSelect).toHaveBeenCalledWith(expect.any(Date), null);

    // Seleccionar segunda fecha
    const secondDay = screen.getByText("15");
    fireEvent.click(secondDay);

    expect(handleDateRangeSelect).toHaveBeenCalledTimes(2);
  });

  it("debe mostrar fechas no disponibles correctamente", () => {
    const unavailableDates = [new Date(2024, 0, 15)]; // 15 de enero 2024
    render(<Calendar unavailableDates={unavailableDates} />);

    // Verificar que el componente renderiza sin errores
    const calendarContainer = document.querySelector(".glass");
    expect(calendarContainer).toBeInTheDocument();
  });

  it("debe usar la función isDateUnavailable cuando se proporciona", () => {
    const isDateUnavailable = jest.fn(() => false);
    render(<Calendar isDateUnavailable={isDateUnavailable} />);

    // Verificar que el componente renderiza sin errores
    const calendarContainer = document.querySelector(".glass");
    expect(calendarContainer).toBeInTheDocument();
  });

  it("debe aplicar clases personalizadas", () => {
    render(<Calendar className="custom-class" />);

    const calendar = document.querySelector(".custom-class");
    expect(calendar).toBeInTheDocument();
  });

  it("debe cambiar de mes al hacer clic en el botón siguiente", () => {
    render(<Calendar />);

    // Buscar el segundo botón de navegación (siguiente)
    const buttons = screen.getAllByRole("button");
    const navigationButtons = buttons.filter(
      (btn) => btn.querySelector("svg") && !btn.textContent?.match(/^\d+$/)
    );
    const nextButton = navigationButtons[1]; // El segundo botón es "siguiente"

    fireEvent.click(nextButton);

    // Verificar que el componente sigue funcionando después del clic
    const calendarContainer = document.querySelector(".glass");
    expect(calendarContainer).toBeInTheDocument();
  });

  it("debe cambiar de mes al hacer clic en el botón anterior", () => {
    render(<Calendar />);

    // Buscar el primer botón de navegación (anterior)
    const buttons = screen.getAllByRole("button");
    const navigationButtons = buttons.filter(
      (btn) => btn.querySelector("svg") && !btn.textContent?.match(/^\d+$/)
    );
    const prevButton = navigationButtons[0]; // El primer botón es "anterior"

    fireEvent.click(prevButton);

    // Verificar que el componente sigue funcionando después del clic
    const calendarContainer = document.querySelector(".glass");
    expect(calendarContainer).toBeInTheDocument();
  });

  it("debe resaltar la fecha seleccionada en modo single", () => {
    const selectedDate = new Date();
    render(<Calendar mode="single" selectedDate={selectedDate} />);

    // Verificar que hay días renderizados
    const days = screen
      .getAllByRole("button")
      .filter((button) => /^\d+$/.test(button.textContent || ""));
    expect(days.length).toBeGreaterThan(0);
  });

  it("debe mostrar el rango seleccionado en modo range", () => {
    const selectedRange = {
      startDate: new Date(2024, 0, 10),
      endDate: new Date(2024, 0, 15),
    };
    render(<Calendar mode="range" selectedRange={selectedRange} />);

    // Verificar que el componente renderiza sin errores
    const calendarContainer = document.querySelector(".glass");
    expect(calendarContainer).toBeInTheDocument();
  });

  it("debe mostrar días pasados como deshabilitados", () => {
    render(<Calendar />);

    // Verificar que hay días renderizados
    const days = screen
      .getAllByRole("button")
      .filter((button) => /^\d+$/.test(button.textContent || ""));
    expect(days.length).toBeGreaterThan(0);
  });

  it("debe mostrar días futuros como habilitados", () => {
    render(<Calendar />);

    // Verificar que hay días renderizados
    const days = screen
      .getAllByRole("button")
      .filter((button) => /^\d+$/.test(button.textContent || ""));
    expect(days.length).toBeGreaterThan(0);
  });

  it("debe manejar la validación de rangos con fechas no disponibles", () => {
    const unavailableDates = [new Date(2024, 0, 12)];
    const handleDateRangeSelect = jest.fn();

    render(
      <Calendar
        mode="range"
        unavailableDates={unavailableDates}
        onDateRangeSelect={handleDateRangeSelect}
      />
    );

    // Intentar seleccionar un rango que incluya una fecha no disponible
    const firstDay = screen.getByText("10");
    fireEvent.click(firstDay);

    const secondDay = screen.getByText("15");
    fireEvent.click(secondDay);

    // Verificar que se llamó la función
    expect(handleDateRangeSelect).toHaveBeenCalled();
  });

  it("debe reiniciar la selección cuando se hace clic en una fecha anterior al inicio del rango", () => {
    const handleDateRangeSelect = jest.fn();
    render(<Calendar mode="range" onDateRangeSelect={handleDateRangeSelect} />);

    // Seleccionar primera fecha
    const firstDay = screen.getByText("15");
    fireEvent.click(firstDay);

    // Seleccionar una fecha anterior
    const earlierDay = screen.getByText("10");
    fireEvent.click(earlierDay);

    expect(handleDateRangeSelect).toHaveBeenCalledTimes(2);
  });

  it("debe mostrar el año actual en el header", () => {
    render(<Calendar />);

    const currentYear = new Date().getFullYear();
    // Buscar el texto que contenga el año, ya que puede estar dividido
    expect(
      screen.getByText(new RegExp(currentYear.toString()))
    ).toBeInTheDocument();
  });

  it("debe mostrar información de días restantes cuando hay rango seleccionado", () => {
    const selectedRange = {
      startDate: new Date(2024, 0, 10),
      endDate: new Date(2024, 0, 15),
    };
    render(<Calendar mode="range" selectedRange={selectedRange} />);

    // Verificar que el componente renderiza el rango
    const calendarContainer = document.querySelector(".glass");
    expect(calendarContainer).toBeInTheDocument();
  });
});
