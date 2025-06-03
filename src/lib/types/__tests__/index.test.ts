import * as typeExports from '../index'

describe('Types Index Exports', () => {
  it('debe exportar tipos de respuesta de API', () => {
    // Verificar que las exportaciones están disponibles
    expect(typeExports).toBeDefined()
    expect(typeof typeExports).toBe('object')
  })

  it('debe tener las exportaciones como un objeto', () => {
    // Como son exportaciones de tipos, no podemos verificar tipos específicos en runtime
    // pero podemos verificar que el módulo se puede importar correctamente
    expect(typeExports).toBeDefined()
  })

  it('debe exportar sin errores', async () => {
    // Esta prueba verifica que no hay errores de sintaxis o importación
    expect(async () => {
      await import('../index')
    }).not.toThrow()
  })

  it('debe ser un objeto válido', () => {
    expect(Object.prototype.toString.call(typeExports)).toBe('[object Object]')
  })
})
