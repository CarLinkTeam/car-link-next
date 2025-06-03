import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EntityListPage from "../entityListPage";

// Mock de Next.js Link
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = "MockLink";
  return MockLink;
});

interface TestItem {
  id: string;
  name: string;
}

describe("EntityListPage", () => {
  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateById: jest.fn(),
    delete: jest.fn(),
    deleteById: jest.fn(),
  };

  const mockData: TestItem[] = [
    { id: "1", name: "Usuario 1" },
    { id: "2", name: "Usuario 2" },
    { id: "3", name: "Test Usuario" },
  ];

  const mockRenderItem = (item: TestItem) => <span>{item.name}</span>;
  const mockGetId = (item: TestItem) => item.id;

  beforeEach(() => {
    jest.clearAllMocks();
    mockService.getAll.mockResolvedValue(mockData);
  });

  it("debe renderizar correctamente con datos", async () => {
    render(
      <EntityListPage
        entityName="users"
        service={mockService}
        renderItem={mockRenderItem}
        getId={mockGetId}
      />
    );

    expect(screen.getByText(/users.*list/i)).toBeInTheDocument();
    expect(screen.getByText("Cargando...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Usuario 1")).toBeInTheDocument();
      expect(screen.getByText("Usuario 2")).toBeInTheDocument();
      expect(screen.getByText("Test Usuario")).toBeInTheDocument();
    });
  });

  it("debe mostrar campo de búsqueda", async () => {
    render(
      <EntityListPage
        entityName="users"
        service={mockService}
        renderItem={mockRenderItem}
        getId={mockGetId}
      />
    );

    const searchInput = screen.getByPlaceholderText("Buscar users...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(searchInput).toHaveValue("test");
  });

  it("debe mostrar mensaje cuando no hay resultados", async () => {
    mockService.getAll.mockResolvedValue([]);
    render(
      <EntityListPage
        entityName="users"
        service={mockService}
        renderItem={mockRenderItem}
        getId={mockGetId}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No se encontraron resultados")
      ).toBeInTheDocument();
    });
  });
});
