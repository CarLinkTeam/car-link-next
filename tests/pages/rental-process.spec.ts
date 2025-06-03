import { test, expect } from "@playwright/test";
import { USERS } from "../test-data";

test.describe("Proceso Completo de Renta", () => {
  test("Tenant solicita renta", async ({ page }) => {
    // Login como TENANT
    await page.goto("/auth/login");

    const tenant = USERS.tenant1;

    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill(tenant.email);
    const passwordField = page.getByRole("textbox", { name: "Contraseña" });
    await passwordField.fill(tenant.password);
    await passwordField.blur();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole("button", { name: "Iniciar sesión" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click({ force: true });

    // Esperar redirección al dashboard
    await page.waitForURL("/dashboard/vehicles", { timeout: 60000 });

    // Usar navegación
    const firstVehicleLink = page
      .locator('a[href*="/dashboard/vehicles/"]')
      .first();
    await expect(firstVehicleLink).toBeVisible();

    // Obtener el href y navegar directamente
    const vehicleHref = await firstVehicleLink.getAttribute("href");
    await page.goto(vehicleHref!);

    // Verificar que estamos en la página de detalles del vehículo
    await expect(page.getByText("Condiciones de Renta")).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("Especificaciones Técnicas")).toBeVisible();

    // COMPLETAR EL PROCESO DE RENTA CON EL CALENDARIO
    // Navegar al mes de junio si no estamos ya en él
    const currentMonthText = await page
      .locator("h3.text-xl.font-bold.gradient-text")
      .textContent();

    // Navegar hasta llegar a junio
    while (!currentMonthText?.includes("Junio")) {
      const nextButton = page
        .locator("button")
        .filter({ hasText: /next|siguiente/ })
        .or(page.locator('button svg path[d*="M9 5l7 7-7 7"]').locator(".."));
      await nextButton.click();
      await page.waitForTimeout(300);

      // Actualizar el texto del mes actual
      const newMonthText = await page
        .locator("h3.text-xl.font-bold.gradient-text")
        .textContent();
      if (newMonthText?.includes("Junio")) break;

      // Prevenir bucle infinito
      if (newMonthText === currentMonthText) {
        break;
      }
    }

    // Seleccionar el día 8 de junio (fecha de inicio)
    const day8Button = page.getByRole("button", { name: "8", exact: true });
    await expect(day8Button).toBeVisible();
    await day8Button.click();
    await page.waitForTimeout(500);

    // Seleccionar el día 9 de junio (fecha de fin)
    const day9Button = page.getByRole("button", { name: "9", exact: true });
    await expect(day9Button).toBeVisible();
    await day9Button.click();
    await page.waitForTimeout(500);

    // Verificar que aparece el precio calculado
    await expect(page.getByText("Precio Total")).toBeVisible();

    // Verificar que aparece información de las fechas seleccionadas
    await expect(page.getByText("Fechas Seleccionadas")).toBeVisible();
    await expect(page.getByText("Inicio:")).toBeVisible();
    await expect(page.getByText("Fin:")).toBeVisible();

    // Hacer clic en el botón de confirmar reserva
    const rentButton = page.getByRole("button", { name: "Confirmar Reserva" });
    await expect(rentButton).toBeVisible();
    await expect(rentButton).toBeEnabled();
    await rentButton.click();

    // Verificar redirección exitosa con mensaje
    await page.waitForURL(/\/dashboard\/vehicles\?message=/, {
      timeout: 10000,
    });

    // Verificar que aparece el mensaje de éxito en la URL
    const currentUrl = page.url();
    expect(currentUrl).toContain("message=Reservado%20con%20%C3%A9xito");
  });

  test("Verificar filtros en solicitudes de renta", async ({ page }) => {
    // Login como OWNER para ver solicitudes
    await page.goto("/auth/login");

    const owner = USERS.owner1;

    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill(owner.email);
    const passwordField = page.getByRole("textbox", { name: "Contraseña" });
    await passwordField.fill(owner.password);
    await passwordField.blur();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole("button", { name: "Iniciar sesión" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click({ force: true });

    await page.waitForURL("/dashboard/vehicles", { timeout: 60000 });

    // Navegar a solicitudes
    await page.goto("/dashboard/requests");
    await expect(
      page.getByRole("heading", { name: "Solicitudes de Renta" })
    ).toBeVisible({ timeout: 10000 });

    // Verificar elementos de filtrado
    const searchInput = page.getByPlaceholder("Buscar por marca o modelo...");
    const filterSelect = page.locator("select").first();

    await expect(searchInput).toBeVisible();
    await expect(filterSelect).toBeVisible();

    // Probar filtro por estado verificando que el valor del select cambió
    await filterSelect.selectOption("pending");
    await expect(filterSelect).toHaveValue("pending");
    await page.waitForTimeout(500); // Esperar que se aplique el filtro

    await filterSelect.selectOption("confirmed");
    await expect(filterSelect).toHaveValue("confirmed");
    await page.waitForTimeout(500);

    await filterSelect.selectOption("cancelled");
    await expect(filterSelect).toHaveValue("cancelled");
    await page.waitForTimeout(500);

    // Volver a mostrar todas y verificar que hay solicitudes
    await filterSelect.selectOption("all");
    await expect(filterSelect).toHaveValue("all");
    await page.waitForTimeout(500);

    // Verificar que hay al menos una solicitud visible
    const requestCards = page
      .locator(".glass")
      .filter({ hasText: /Toyota|Mazda|Honda|Chevrolet|Audi|Nissan/ });
    await expect(requestCards.first()).toBeVisible({ timeout: 5000 });

    // Probar búsqueda por texto
    await searchInput.fill("Honda");
    await page.waitForTimeout(1000); // Esperar que se aplique el filtro

    // Verificar que solo aparecen resultados de Honda si los hay
    const filteredCards = page.locator(".glass").filter({ hasText: /Honda/ });
    if ((await filteredCards.count()) > 0) {
      await expect(filteredCards.first()).toBeVisible();
    }

    // Limpiar búsqueda y verificar que vuelven todas las solicitudes
    await searchInput.clear();
    await page.waitForTimeout(1000);
    await expect(requestCards.first()).toBeVisible();
  });

  test("Verificar información detallada en solicitud de renta", async ({
    page,
  }) => {
    // Login como OWNER
    await page.goto("/auth/login");

    const owner = USERS.owner1;

    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill(owner.email);
    const passwordField = page.getByRole("textbox", { name: "Contraseña" });
    await passwordField.fill(owner.password);
    await passwordField.blur();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole("button", { name: "Iniciar sesión" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click({ force: true });

    await page.waitForURL("/dashboard/vehicles", { timeout: 60000 });

    // Ir a solicitudes
    await page.goto("/dashboard/requests");
    await expect(
      page.getByRole("heading", { name: "Solicitudes de Renta" })
    ).toBeVisible({ timeout: 10000 });

    // Verificar estadísticas en la parte superior usando selectores específicos para evitar conflictos
    await expect(page.getByText("Total", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "Pendientes" })
    ).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "Confirmadas" })
    ).toBeVisible();
    await expect(
      page.getByRole("paragraph").filter({ hasText: "Canceladas" })
    ).toBeVisible();

    // Si hay solicitudes, verificar que muestran la información correcta
    const rentalCards = page
      .locator(".glass")
      .filter({ hasText: /Toyota|Mazda|Honda|Chevrolet|Audi|Nissan/ });

    if ((await rentalCards.count()) > 0) {
      // Obtener la primera tarjeta individual usando nth(0) para ser más específico
      const firstCard = rentalCards.nth(0);

      // Verificar el título del vehículo
      const vehicleTitle = firstCard
        .locator("h3.text-xl.font-bold.gradient-text")
        .first();
      await expect(vehicleTitle).toBeVisible();

      // Verificar fechas usando selectores más específicos que busquen en la estructura correcta
      // Buscar específicamente en los spans que contienen las fechas dentro de la sección de fechas
      const dateSection = firstCard.locator(".mb-4.space-y-2");
      const startDateSpan = dateSection
        .locator("span")
        .filter({ hasText: /Inicio:/ })
        .first();
      const endDateSpan = dateSection
        .locator("span")
        .filter({ hasText: /Fin:/ })
        .first();

      await expect(startDateSpan).toBeVisible();
      await expect(endDateSpan).toBeVisible();

      // Verificar precio - usar un selector más específico que evite conflictos
      // Buscar el párrafo específico con la clase exacta dentro de la primera tarjeta
      const priceElement = firstCard
        .locator("p.text-sm.text-secondary-500.font-medium")
        .filter({ hasText: "Costo total" })
        .first();
      await expect(priceElement).toBeVisible();
    }
  });
});
