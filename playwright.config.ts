import { defineConfig, devices } from '@playwright/test'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Timeout por prueba (en milisegundos) */
  timeout: 300 * 1000, // 5 minutos por prueba
  /* Ejecutar tests en paralelo */
  fullyParallel: true,
  /* Fallar el build si dejaste test.only en el código fuente */
  forbidOnly: !!process.env.CI,
  /* Reintentar en CI solamente */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests en CI */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter a usar */
  reporter: 'html',
  /* Configuración compartida para todos los proyectos */
  use: {
    /* URL base para usar en acciones como `await page.goto('/')` */
    baseURL: 'http://localhost:3001',
    /* Trace cuando se retry un test */
    trace: 'on-first-retry',
    /* Screenshots al fallar */
    screenshot: 'only-on-failure',
    /* Videos al fallar */
    video: 'retain-on-failure',
    /* Timeout para acciones individuales */
    actionTimeout: 30 * 1000, // 30 segundos para acciones individuales
  },

  /* Configuración para diferentes navegadores */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Ejecutar servidor de desarrollo antes de iniciar tests */
  /* NOTA: El backend (puerto 3000) debe estar ejecutándose por separado */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 300 * 1000,
  },
})
