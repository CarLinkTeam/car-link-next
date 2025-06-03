import { test, expect } from '@playwright/test'
import { USERS, REGISTER_DATA } from '../test-data'

test.describe('Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/register')
  })

  test('Registro exitoso con datos válidos', async ({ page }) => {
    const newUser = REGISTER_DATA.newUser

    // Llenar formulario de registro
    await page.getByRole('textbox', { name: 'Nombre completo' }).fill(newUser.fullName)
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(newUser.email)
    await page.locator('input[name="password"]').fill(newUser.password)
    await page.locator('input[name="confirmPassword"]').fill(newUser.password)
    await page.getByRole('textbox', { name: 'Ubicación' }).fill(newUser.location)

    const phoneField = page.getByRole('textbox', { name: 'Teléfono' })
    await phoneField.fill(newUser.phone)
    await phoneField.blur() // Hacer que el último campo pierda el foco para activar validación
    await page.waitForTimeout(200) // Esperar a que se estabilicen las animaciones

    // Esperar que el botón esté habilitado y hacer click
    const registerButton = page.getByRole('button', { name: 'Crear cuenta' })
    await expect(registerButton).toBeEnabled()
    await registerButton.click({ force: true })

    // Esperar redirección exitosa al dashboard/vehicles
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })

    // Verificar que estamos en dashboard/vehicles
    await expect(page).toHaveURL('/dashboard/vehicles')
  })

  test('Registro fallido con email ya en uso - debe mostrar alerta de error', async ({ page }) => {
    const newUser = REGISTER_DATA.newUser
    const emailExists = USERS.admin.email

    // Llenar formulario con email duplicado
    await page.getByRole('textbox', { name: 'Nombre completo' }).fill(newUser.fullName)
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(emailExists)
    await page.locator('input[name="password"]').fill(newUser.password)
    await page.locator('input[name="confirmPassword"]').fill(newUser.password)
    await page.getByRole('textbox', { name: 'Ubicación' }).fill(newUser.location)

    const phoneField = page.getByRole('textbox', { name: 'Teléfono' })
    await phoneField.fill(newUser.phone)
    await phoneField.blur() // Hacer que el último campo pierda el foco para activar validación
    await page.waitForTimeout(200) // Esperar a que se estabilicen las animaciones

    // Esperar que el botón esté habilitado y hacer click
    const registerButton = page.getByRole('button', { name: 'Crear cuenta' })
    await expect(registerButton).toBeEnabled()
    await registerButton.click({ force: true })

    // Esperar y verificar que aparezca la alerta de error
    await expect(page.getByText('Email ya registrado')).toBeVisible({ timeout: 15000 })

    // Verificar que aparece el mensaje específico de email duplicado
    await expect(page.getByText(/Este email ya está registrado/i)).toBeVisible()

    // Verificar que seguimos en la página de registro (no hubo redirección)
    await expect(page).toHaveURL('/auth/register')
  })
})
