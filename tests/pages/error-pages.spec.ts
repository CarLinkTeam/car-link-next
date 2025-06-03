import { test, expect } from '@playwright/test'
import { USERS } from '../test-data'

test.describe('Error Pages', () => {
  test('Página 404 - Ruta inexistente', async ({ page }) => {
    // Navegar a una ruta que no existe
    await page.goto('/ruta-inexistente-aleatoria-404')

    // Verificar que estamos en la página 404
    await expect(page.getByText('404')).toBeVisible()
    await expect(page.getByText('¡Oops! Página no encontrada')).toBeVisible()
    await expect(page.getByText('La página que estás buscando no existe o ha sido movida')).toBeVisible()

    // Verificar que hay botones de navegación
    await expect(page.getByRole('button', { name: 'Ir al inicio' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Volver atrás' })).toBeVisible()

    // Verificar enlaces útiles
    await expect(page.getByText('Enlaces útiles')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Iniciar sesión' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Registrarse' })).toBeVisible()
  })

  test('Acceso restringido - Usuario OWNER intentando acceder a dashboard/admin', async ({ page }) => {
    // Primero hacer login con usuario OWNER
    await page.goto('/auth/login')

    const user = USERS.owner1

    // Llenar formulario de login
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(user.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(user.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    // Hacer click en login
    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar redirección al dashboard
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })

    // Intentar navegar a una ruta de admin (restringida para OWNER)
    await page.goto('/dashboard/admin')

    // Verificar que se muestra la página de acceso denegado
    await expect(page.getByText('Acceso Denegado')).toBeVisible({ timeout: 60000 })
    await expect(page.getByText('No tienes permisos para acceder a esta página')).toBeVisible()

    // Verificar que hay botón para ir al dashboard
    await expect(page.getByRole('button', { name: 'Ir al Dashboard' })).toBeVisible()

    // Verificar que la URL cambió a access-denied
    await expect(page).toHaveURL(/access-denied/)
  })
})
