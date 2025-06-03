import { test, expect } from "@playwright/test";
import { USERS } from "../test-data";

test.describe("Acceso al Panel de Administración", () => {
  test("Admin puede acceder al panel de administración desde el dropdown menu", async ({
    page,
  }) => {
    // Ir a la página de login
    await page.goto("/auth/login");

    const adminUser = USERS.admin;

    // Iniciar sesión como admin
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill(adminUser.email);
    const passwordField = page.getByRole("textbox", { name: "Contraseña" });
    await passwordField.fill(adminUser.password);
    await passwordField.blur();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole("button", { name: "Iniciar sesión" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click({ force: true });

    // Esperar redirección al dashboard
    await page.waitForURL("/dashboard/vehicles", { timeout: 80000 });
    await expect(page).toHaveURL("/dashboard/vehicles");

    // Hacer click en el dropdown del usuario para abrir el menú (botón con las iniciales)
    await page.locator("div.group > button").click();

    // Verificar que el enlace "Panel de administración" está visible en el dropdown
    const adminPanelLink = page.getByRole("link", {
      name: "Panel de administración",
    });
    await expect(adminPanelLink).toBeVisible();

    // Hacer click en el enlace del panel de administración
    await adminPanelLink.click();

    // Verificar redirección al panel admin
    await page.waitForURL("/dashboard/admin", { timeout: 30000 });
    await expect(page).toHaveURL("/dashboard/admin");

    // Verificar que estamos en el panel admin por el contenido
    await expect(
      page.getByText("Bienvenido al panel de administración")
    ).toBeVisible();
    await expect(page.getByText("Panel Admin")).toBeVisible();
  });

  test("Usuario tenant no puede acceder al panel de administración", async ({
    page,
  }) => {
    // Ir a la página de login
    await page.goto("/auth/login");

    const tenantUser = USERS.tenant1;

    // Iniciar sesión como tenant
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill(tenantUser.email);
    const passwordField = page.getByRole("textbox", { name: "Contraseña" });
    await passwordField.fill(tenantUser.password);
    await passwordField.blur();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole("button", { name: "Iniciar sesión" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click({ force: true });

    // Esperar redirección al dashboard
    await page.waitForURL("/dashboard/vehicles", { timeout: 60000 });
    await expect(page).toHaveURL("/dashboard/vehicles");

    // Hacer click en el dropdown del usuario para abrir el menú (botón con las iniciales)
    await page.locator("div.group > button").click();

    // Verificar que el enlace "Panel de administración" NO está visible
    const adminPanelLink = page.getByRole("link", {
      name: "Panel de administración",
    });
    await expect(adminPanelLink).not.toBeVisible();

    // Intentar acceder directamente por URL al panel admin
    await page.goto("/dashboard/admin");

    // Verificar que es redirigido a la página de acceso denegado
    await page.waitForURL("/access-denied?reason=insufficient-role", {
      timeout: 30000,
    });
    await expect(page).toHaveURL("/access-denied?reason=insufficient-role");

    // Verificar que aparece el mensaje de acceso denegado
    await expect(page.getByText("Acceso Denegado")).toBeVisible();
  });

  test("Usuario owner no puede acceder al panel de administración", async ({
    page,
  }) => {
    // Ir a la página de login
    await page.goto("/auth/login");

    const ownerUser = USERS.owner1;

    // Iniciar sesión como owner
    await page
      .getByRole("textbox", { name: "Correo electrónico" })
      .fill(ownerUser.email);
    const passwordField = page.getByRole("textbox", { name: "Contraseña" });
    await passwordField.fill(ownerUser.password);
    await passwordField.blur();
    await page.waitForTimeout(200);

    const loginButton = page.getByRole("button", { name: "Iniciar sesión" });
    await expect(loginButton).toBeEnabled();
    await loginButton.click({ force: true });

    // Esperar redirección al dashboard
    await page.waitForURL("/dashboard/vehicles", { timeout: 60000 });
    await expect(page).toHaveURL("/dashboard/vehicles");

    // Hacer click en el dropdown del usuario para abrir el menú (botón con las iniciales)
    await page.locator("div.group > button").click();

    // Verificar que el enlace "Panel de administración" NO está visible
    const adminPanelLink = page.getByRole("link", {
      name: "Panel de administración",
    });
    await expect(adminPanelLink).not.toBeVisible();

    // Intentar acceder directamente por URL al panel admin
    await page.goto("/dashboard/admin");

    // Verificar que es redirigido a la página de acceso denegado
    await page.waitForURL("/access-denied?reason=insufficient-role", {
      timeout: 30000,
    });
    await expect(page).toHaveURL("/access-denied?reason=insufficient-role");

    // Verificar que aparece el mensaje de acceso denegado
    await expect(page.getByText("Acceso Denegado")).toBeVisible();
  });
});
