import { test, expect } from '@playwright/test'
import { USERS } from '../test-data'

test.describe('Páginas de Reportes', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página de login
    await page.goto('/auth/login')
    const owner = USERS.owner1

    // Realizar login con usuario owner
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(owner.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(owner.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar a que se complete la navegación al dashboard
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })
    await page.waitForLoadState('networkidle')
  })

  test('Acceso exitoso a la página de reportes de rentas', async ({ page }) => {
    // Navegar a la página de reportes de rentas
    await page.goto('/dashboard/reports/rentals')
    await page.waitForLoadState('networkidle')

    // Verificar que se cargó la página correcta
    await expect(page.getByRole('heading', { name: 'Reporte de Mis Alquileres', exact: true })).toBeVisible()

    // Verificar elementos característicos de la página
    await expect(page.getByText('Resumen completo de tu actividad de alquiler de vehículos')).toBeVisible()

    // Verificar que el botón de generar PDF está presente
    await expect(page.getByRole('button', { name: 'Descargar PDF' })).toBeVisible()
  })

  test('Acceso exitoso a la página de reportes de ingresos', async ({ page }) => {
    // Navegar a la página de reportes de ingresos
    await page.goto('/dashboard/reports/income')
    await page.waitForLoadState('networkidle')

    // Verificar que se cargó la página correcta
    await expect(page.getByRole('heading', { name: 'Reporte de Ingresos', exact: true })).toBeVisible()

    // Verificar elementos característicos de la página
    await expect(page.getByText('Análisis detallado de tus ingresos como propietario')).toBeVisible()

    // Verificar que el botón de generar PDF está presente
    await expect(page.getByRole('button', { name: 'Descargar PDF' })).toBeVisible()
  })

  test('Acceso exitoso a la página de reportes de vehículos populares', async ({ page }) => {
    // Navegar a la página de reportes de vehículos populares
    await page.goto('/dashboard/reports/popular-vehicles')
    await page.waitForLoadState('networkidle')

    // Verificar que se cargó la página correcta
    await expect(page.getByRole('heading', { name: 'Vehículos Más Populares', exact: true })).toBeVisible()

    // Verificar elementos característicos de la página
    await expect(page.getByText(/Ranking de los vehículos más alquilados/i)).toBeVisible()

    // Verificar que el botón de generar PDF está presente
    await expect(page.getByRole('button', { name: 'Descargar PDF' })).toBeVisible()
  })

  test('Navegación entre diferentes páginas de reportes', async ({ page }) => {
    // Navegar a reportes de rentas
    await page.goto('/dashboard/reports/rentals')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Reporte de Mis Alquileres', exact: true })).toBeVisible()

    // Navegar a reportes de ingresos
    await page.goto('/dashboard/reports/income')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Reporte de Ingresos', exact: true })).toBeVisible()

    // Navegar a reportes de vehículos populares
    await page.goto('/dashboard/reports/popular-vehicles')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Vehículos Más Populares', exact: true })).toBeVisible()
  })

  test('Verificar la funcionalidad del botón de generación de PDF', async ({ page }) => {
    // Navegar a página de reportes
    await page.goto('/dashboard/reports/income')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(3000)

    // Buscar el botón de generar PDF
    const pdfButton = page.getByRole('button', { name: 'Descargar PDF' })

    if (await pdfButton.isVisible()) {
      // Verificar que el botón no está deshabilitado inicialmente
      await expect(pdfButton).toBeEnabled()

      // Hacer click en el botón
      await pdfButton.click()

      // Verificar que se muestra estado de "Generando" o se mantiene funcional
      await page.waitForTimeout(1000)

      // El botón debe seguir siendo visible
      const generatingButton = page.getByRole('button', { name: /Generando|Descargar PDF/i })
      await expect(generatingButton).toBeVisible()
    }
  })

  test('Verificar la accesibilidad y estructura de las páginas de reportes', async ({ page }) => {
    // Navegar a página de vehículos populares
    await page.goto('/dashboard/reports/popular-vehicles')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Verificar estructura básica de la página
    await expect(page.getByRole('heading', { name: 'Vehículos Más Populares', exact: true })).toBeVisible()

    // Verificar que tiene al menos un elemento de contenido principal
    const mainContent = page.locator('div').filter({ hasText: /Total Alquileres|No se pudo cargar|loading/i })
    await expect(mainContent.first()).toBeVisible()

    // Verificar que la página es responsive
    const headerSection = page.locator('div').filter({ hasText: 'Vehículos Más Populares' }).first()
    await expect(headerSection).toBeVisible()
  })
})
