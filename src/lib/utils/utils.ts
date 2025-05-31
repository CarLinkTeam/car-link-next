import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combina y optimiza clases de Tailwind CSS de forma condicional.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility para generar iniciales
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Utility para truncar texto
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
