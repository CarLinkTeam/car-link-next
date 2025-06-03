import * as apiExports from '../index'

describe('API Index Exports', () => {
  it('debe exportar auth service', () => {
    expect(apiExports.auth).toBeDefined()
    expect(typeof apiExports.auth).toBe('object')
  })

  it('debe exportar vehicles service', () => {
    expect(apiExports.vehicles).toBeDefined()
    expect(typeof apiExports.vehicles).toBe('object')
  })

  it('debe exportar users service', () => {
    expect(apiExports.users).toBeDefined()
    expect(typeof apiExports.users).toBe('object')
  })

  it('debe exportar unavailability service', () => {
    expect(apiExports.unavailability).toBeDefined()
    expect(typeof apiExports.unavailability).toBe('object')
  })

  it('debe exportar rentals service', () => {
    expect(apiExports.rentals).toBeDefined()
    expect(typeof apiExports.rentals).toBe('object')
  })

  it('debe exportar apiClient', () => {
    expect(apiExports.apiClient).toBeDefined()
    expect(typeof apiExports.apiClient).toBe('object')
  })

  it('debe exportar todos los servicios esperados', () => {
    const expectedExports = ['auth', 'vehicles', 'users', 'unavailability', 'rentals', 'apiClient']
    const actualExports = Object.keys(apiExports)

    expectedExports.forEach((exportName) => {
      expect(actualExports).toContain(exportName)
    })
  })
})
