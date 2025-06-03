import { test, expect } from '@playwright/test'
import { USERS } from '../test-data'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login')
  })

  test('Login exitoso con credenciales correctas', async ({ page }) => {
    const user = USERS.admin

    // Usar credenciales válidas
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(user.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(user.password)
    await passwordField.blur() // Hacer que el campo pierda el foco para activar validación
    await page.waitForTimeout(200) // Esperar a que se estabilicen las animaciones

    // Esperar que el botón esté habilitado y hacer click
    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar redirección exitosa al dashboard/vehicles
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })

    // Verificar que estamos en dashboard/vehicles
    await expect(page).toHaveURL('/dashboard/vehicles')
  })

  test('Login fallido con credenciales incorrectas - debe mostrar alerta de error', async ({ page }) => {
    // Usar credenciales inválidas
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill('usuario_inexistente@carlink.com')
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill('password123')
    await passwordField.blur() // Hacer que el campo pierda el foco para activar validación
    await page.waitForTimeout(200) // Esperar a que se estabilicen las animaciones

    // Esperar que el botón esté habilitado y hacer click
    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar y verificar que aparezca la alerta de error
    await expect(page.getByText('Error de autenticación')).toBeVisible({ timeout: 15000 })

    // Verificar que aparece el mensaje específico de credenciales incorrectas
    await expect(page.getByText(/Email o contraseña incorrectos/i)).toBeVisible()

    // Verificar que seguimos en la página de login (no hubo redirección)
    await expect(page).toHaveURL('/auth/login')
  })
})
