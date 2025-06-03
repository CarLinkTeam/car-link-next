import { test, expect } from '@playwright/test'
import { USERS } from '../test-data'

test.describe('Profile Page', () => {
  test('Usuario OWNER - Ver información personal y vehículos', async ({ page }) => {
    // Login con usuario OWNER
    await page.goto('/auth/login')

    const user = USERS.owner1

    // Hacer login
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(user.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(user.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar redirección y navegar al perfil
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })
    await page.goto('/dashboard/profile')

    // Verificar que estamos en la página de perfil usando heading específico
    await expect(page.getByRole('heading', { name: 'Mi Perfil' })).toBeVisible()
    await expect(page.getByText('Gestiona tu información personal y vehículos')).toBeVisible()

    // Verificar información personal del usuario (excluyendo sección de vehículos)
    await expect(page.getByRole('heading', { name: user.fullName })).toBeVisible()
    await expect(page.locator('main').getByText(user.email)).toBeVisible()

    // Ubicar información personal por labels específicos
    const phoneSection = page.getByText('Teléfono').locator('..')
    const locationSection = page.getByText('Ubicación').locator('..')

    await expect(phoneSection.getByText(user.phone)).toBeVisible()
    await expect(locationSection.getByText(user.location)).toBeVisible()

    // Verificar que muestra el rol OWNER en la sección de roles específicamente
    const rolesSection = page.getByText('Roles').locator('..')
    await expect(rolesSection.getByText('OWNER')).toBeVisible()

    // Verificar que tiene acceso a la sección de vehículos usando heading específico
    await expect(page.getByRole('heading', { name: 'Mis Vehículos' })).toBeVisible()

    // Verificar botón para agregar vehículo (solo visible para OWNER)
    await expect(page.getByRole('button', { name: 'Agregar Vehículo' })).toBeVisible()

    // Verificar botón de editar perfil (ser más específico)
    await expect(page.locator('[data-testid="edit-profile-btn"], button:has-text("Editar")').first()).toBeVisible()

    // Contar vehículos de manera más robusta
    const vehicleLinks = page.locator('a[href*="/dashboard/vehicles/"]')
    const vehicleCount = await vehicleLinks.count()

    if (vehicleCount > 0) {
      // Verificar contador de vehículos (badge específico, no paginación)
      const vehicleHeader = page.getByRole('heading', { name: 'Mis Vehículos' }).locator('..')
      await expect(vehicleHeader.locator('text=/\\d+ vehículo[s]?/').first()).toBeVisible()

      // Verificar botones de acción específicos para vehículos
      const editButtons = page.locator('button:has-text("Editar")')
      const deleteButtons = page.locator('button:has-text("Eliminar")')

      await expect(editButtons.first()).toBeVisible()
      await expect(deleteButtons.first()).toBeVisible()
    } else {
      // Si no hay vehículos, verificar mensaje correspondiente
      await expect(page.getByText('No tienes vehículos')).toBeVisible()
      await expect(page.getByText('Agregar mi primer vehículo')).toBeVisible()
    }
  })

  test('Usuario TENANT - Promoción a OWNER y verificar estado sin vehículos', async ({ page }) => {
    // Login con usuario TENANT
    await page.goto('/auth/login')

    const user = USERS.tenant1

    // Hacer login
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(user.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(user.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Esperar redirección y navegar al perfil
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })
    await page.goto('/dashboard/profile')

    // Verificar información personal del usuario TENANT en el área principal
    await expect(page.getByRole('heading', { name: user.fullName })).toBeVisible()
    await expect(page.locator('main').getByText(user.email)).toBeVisible()

    // Verificar rol inicial (puede ser TENANT o TENANT OWNER si ya fue promovido)
    const rolesSection = page.getByText('Roles').locator('..')
    const hasOwnerRole = await rolesSection.getByText('OWNER').isVisible()

    if (!hasOwnerRole) {
      // Usuario aún no promovido - verificar acceso restringido
      await expect(rolesSection.getByText('TENANT')).toBeVisible()
      await expect(page.getByText('Acceso restringido')).toBeVisible()
      await expect(page.getByText('Necesitas ser OWNER para ver y gestionar vehículos')).toBeVisible()

      // Verificar que existe el botón de promoción
      const promoteButton = page.getByRole('button', { name: 'Convertirse en OWNER' })
      await expect(promoteButton).toBeVisible()
      await expect(
        page.getByText('Conviértete en OWNER para poder registrar y gestionar tus propios vehículos')
      ).toBeVisible()

      // Hacer click en el botón de promoción
      await promoteButton.click()

      // Esperar mensaje de éxito
      await expect(page.getByText('¡Promoción exitosa!')).toBeVisible({ timeout: 15000 })
      await expect(page.getByText('Ahora eres un OWNER y puedes registrar vehículos.')).toBeVisible()

      // Verificar que ahora tiene rol OWNER en la sección específica de roles
      await expect(rolesSection.getByText('OWNER')).toBeVisible()

      // Verificar que ya no aparece el botón de promoción
      await expect(promoteButton).not.toBeVisible()
    } else {
      // Usuario ya promovido - verificar que tiene ambos roles
      await expect(rolesSection.getByText('TENANT')).toBeVisible()
      await expect(rolesSection.getByText('OWNER')).toBeVisible()
    }

    // Verificar que ahora puede acceder a la sección de vehículos usando heading específico
    await expect(page.getByRole('heading', { name: 'Mis Vehículos' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Agregar Vehículo' })).toBeVisible()

    // Verificar que muestra mensaje de no tener vehículos (usuario recién promovido o sin vehículos)
    await expect(page.getByText('No tienes vehículos')).toBeVisible()
    await expect(page.getByText('Comienza agregando tu primer vehículo para comenzar a generar ingresos')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Agregar mi primer vehículo' })).toBeVisible()

    // Solo verificar desaparición del mensaje si se mostró (usuario recién promovido)
    if (!hasOwnerRole) {
      await page.waitForTimeout(4000) // Esperar más de los 3 segundos configurados
      await expect(page.getByText('¡Promoción exitosa!')).not.toBeVisible()
    }
  })

  test('Usuario TENANT - Verificar elementos de interfaz antes de promoción', async ({ page }) => {
    // Login con usuario TENANT
    await page.goto('/auth/login')

    const user = USERS.tenant2

    // Hacer login
    await page.getByRole('textbox', { name: 'Correo electrónico' }).fill(user.email)
    const passwordField = page.getByRole('textbox', { name: 'Contraseña' })
    await passwordField.fill(user.password)
    await passwordField.blur()
    await page.waitForTimeout(200)

    const loginButton = page.getByRole('button', { name: 'Iniciar sesión' })
    await expect(loginButton).toBeEnabled()
    await loginButton.click({ force: true })

    // Navegar al perfil
    await page.waitForURL('/dashboard/vehicles', { timeout: 60000 })
    await page.goto('/dashboard/profile')

    // Verificar información del perfil usando heading específico y área principal
    await expect(page.getByRole('heading', { name: 'Mi Perfil' })).toBeVisible()
    await expect(page.getByRole('heading', { name: user.fullName })).toBeVisible()
    await expect(page.locator('main').getByText(user.email)).toBeVisible()

    // Verificar botones de perfil disponibles
    await expect(page.locator('button:has-text("Editar")').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Eliminar cuenta' })).toBeVisible()

    // Verificar zona de peligro
    await expect(page.getByText('Zona de peligro')).toBeVisible()

    // Verificar estado según si ya fue promovido o no
    const rolesSection = page.getByText('Roles').locator('..')
    const hasOwnerRole = await rolesSection.getByText('OWNER').isVisible()

    if (!hasOwnerRole) {
      // Usuario no promovido - verificar acceso restringido
      await expect(rolesSection.getByText('TENANT')).toBeVisible()
      await expect(page.getByText('Acceso restringido')).toBeVisible()
      await expect(page.getByText('Necesitas ser OWNER para ver y gestionar vehículos')).toBeVisible()

      // Verificar que NO hay botón de agregar vehículo
      await expect(page.getByRole('button', { name: 'Agregar Vehículo' })).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'Agregar mi primer vehículo' })).not.toBeVisible()
    } else {
      // Usuario ya promovido - verificar que tiene acceso
      await expect(rolesSection.getByText('TENANT')).toBeVisible()
      await expect(rolesSection.getByText('OWNER')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Mis Vehículos' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'Agregar Vehículo' })).toBeVisible()
    }
  })
})
