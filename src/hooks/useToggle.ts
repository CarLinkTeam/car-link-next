import { useState, useCallback } from 'react'

/**
 * Hook para alternar (toggle) entre true y false
 * @param initialValue Valor inicial (opcional, por defecto false)
 * @returns [valorActual, funcionParaAlternar]
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void] {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    setValue((prev) => !prev)
  }, [])

  return [value, toggle]
}
