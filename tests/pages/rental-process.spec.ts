import { test, expect } from '@playwright/test'
import { USERS } from '../test-data'

test.describe('Proceso Completo de Renta', () => {
  test('Tenant solicita renta', async ({ page }) => {
    // Login como TENANT
    await page.goto('/auth/login')

    const tenant = USERS.tenant1

    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(tenant.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(tenant.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar redirección al dashboard
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })
    await expect(page.getByRole('heading', { name: 'Vehículos Disponibles' })).toBeVisible()

    // Esperar a que carguen los vehículos
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // Esperar animaciones

    // Usar navegación directa en lugar de click - más confiable para Links de Next.js
    const firstVehicleLink = page.locator('a[href*="/dashboard/vehicles/"]').first()
    await expect(firstVehicleLink).toBeVisible()

    // Obtener el href y navegar directamente
    const vehicleHref = await firstVehicleLink.getAttribute('href')
    await page.goto(vehicleHref!)

    // Verificar que estamos en la página de detalles del vehículo
    await expect(page.getByText('Condiciones de Renta')).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('Especificaciones Técnicas')).toBeVisible()
  })

  test('Verificar filtros en solicitudes de renta', async ({ page }) => {
    // Login como OWNER para ver solicitudes
    await page.goto('/auth/login')

    const owner = USERS.owner1

    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(owner.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(owner.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })

    // Navegar a solicitudes
    await page.goto('/dashboard/requests')
    await expect(page.getByRole('heading', { name: 'Solicitudes de Renta' })).toBeVisible({ timeout: 10000 })

    // Verificar elementos de filtrado
    const searchInput = page.getByPlaceholder('Buscar por marca o modelo...')
    const filterSelect = page.locator('select').first()

    await expect(searchInput).toBeVisible()
    await expect(filterSelect).toBeVisible()

    // Probar filtro por estado verificando que el valor del select cambió
    await filterSelect.selectOption('pending')
    await expect(filterSelect).toHaveValue('pending')

    await filterSelect.selectOption('confirmed')
    await expect(filterSelect).toHaveValue('confirmed')

    await filterSelect.selectOption('cancelled')
    await expect(filterSelect).toHaveValue('cancelled')

    // Volver a mostrar todas
    await filterSelect.selectOption('all')
    await expect(filterSelect).toHaveValue('all')

    // Probar búsqueda por texto
    await searchInput.fill('Toyota')
    await page.waitForTimeout(500) // Esperar que se aplique el filtro

    // Limpiar búsqueda
    await searchInput.clear()
    await page.waitForTimeout(500)
  })

  test('Verificar información detallada en solicitud de renta', async ({ page }) => {
    // Login como OWNER
    await page.goto('/auth/login')

    const owner = USERS.owner1

    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(owner.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(owner.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })

    // Ir a solicitudes
    await page.goto('/dashboard/requests')
    await expect(page.getByRole('heading', { name: 'Solicitudes de Renta' })).toBeVisible({ timeout: 10000 })

    // Verificar estadísticas en la parte superior usando selectores específicos para evitar conflictos
    await expect(page.getByText('Total', { exact: true })).toBeVisible()
    await expect(page.getByRole('paragraph').filter({ hasText: 'Pendientes' })).toBeVisible()
    await expect(page.getByRole('paragraph').filter({ hasText: 'Confirmadas' })).toBeVisible()
    await expect(page.getByRole('paragraph').filter({ hasText: 'Canceladas' })).toBeVisible()

    // Si hay solicitudes, verificar que muestran la información correcta
    const rentalCards = page.locator('.glass').filter({ hasText: /Toyota|Mazda|Honda|Chevrolet/ })

    if ((await rentalCards.count()) > 0) {
      const firstCard = rentalCards.first()

      // Verificar que muestra información del vehículo
      await expect(firstCard.locator('h3')).toBeVisible()

      // Verificar fechas
      await expect(firstCard.getByText('Inicio:')).toBeVisible()
      await expect(firstCard.getByText('Fin:')).toBeVisible()

      // Verificar precio
      await expect(firstCard.getByText('Costo total')).toBeVisible()

      // Verificar estado
      await expect(
        firstCard.locator(
          '[class*="rounded-xl"]:has-text("Pendiente"), [class*="rounded-xl"]:has-text("Aprobada"), [class*="rounded-xl"]:has-text("Cancelada")'
        )
      ).toBeVisible()
    }
  })
})
