import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { User, UserRole } from "../types/entities/user";

// Combina y optimiza clases de Tailwind CSS de forma condicional.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility para generar iniciales
export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Utility para truncar texto
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}

// Utility para calcular días de renta de forma inclusiva
export function calculateRentalDays(
  startDate: Date | null,
  endDate: Date | null
): number {
  if (!startDate || !endDate) {
    return 0;
  }

  // Crear fechas normalizadas para asegurar el cálculo correcto
  const normalizedStartDate = new Date(startDate);
  const normalizedEndDate = new Date(endDate);

  // Normalizar las horas para el cálculo
  normalizedStartDate.setHours(0, 0, 0, 0); // 12:00 AM del día de inicio
  normalizedEndDate.setHours(23, 59, 59, 999); // 11:59 PM del día de fin

  // Calcular la diferencia en milisegundos y convertir a días
  const timeDifference =
    normalizedEndDate.getTime() - normalizedStartDate.getTime();
  const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  // Asegurar que siempre sea al menos 1 día (cuando inicio y fin son el mismo día)
  return Math.max(1, days);
}


export function hasRole(user: User | null, role: UserRole): boolean {
  if (!user || !user.roles) {
    return false;
  }
  return Array.isArray(user.roles) && user.roles.includes(role);
}