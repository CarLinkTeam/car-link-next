import { z } from 'zod'

const currentYear = new Date().getFullYear()

export const createVehicleSchema = z.object({
  vehicleModel: z
    .string()
    .min(1, 'El modelo del vehículo es requerido')
    .min(2, 'El modelo debe tener al menos 2 caracteres')
    .max(50, 'El modelo no puede exceder 50 caracteres'),
  make: z
    .string()
    .min(1, 'La marca del vehículo es requerida')
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(30, 'La marca no puede exceder 30 caracteres'),
  color: z
    .string()
    .min(1, 'El color del vehículo es requerido')
    .min(2, 'El color debe tener al menos 2 caracteres')
    .max(20, 'El color no puede exceder 20 caracteres'),
  year: z
    .number()
    .min(1900, 'El año debe ser mayor a 1900')
    .max(currentYear, `El año no puede ser mayor a ${currentYear}`)
    .int('El año debe ser un número entero'),
  license_plate: z
    .string()
    .min(1, 'La placa es requerida')
    .min(6, 'La placa debe tener al menos 6 caracteres')
    .max(10, 'La placa no puede exceder 10 caracteres')
    .regex(/^[A-Z0-9-]+$/, 'La placa solo puede contener letras mayúsculas, números y guiones'),
  daily_price: z
    .number()
    .min(1, 'El precio diario debe ser mayor a 0'),
  rental_conditions: z
    .string()
    .min(1, 'Las condiciones de renta son requeridas')
    .min(10, 'Las condiciones deben tener al menos 10 caracteres')
    .max(500, 'Las condiciones no pueden exceder 500 caracteres'),
  url_photos: z
    .array(z.string().url('URL de imagen inválida'))
    .min(1, 'Debe subir al menos una foto')
    .max(10, 'No puede subir más de 10 fotos'),
})

export const editVehicleSchema = createVehicleSchema.extend({
  class: z
    .string()
    .min(1, 'La clase debe tener al menos 1 caracteres')
    .max(30, 'La clase no puede exceder 30 caracteres')
    .optional(),
  drive: z
    .string()
    .min(1, 'El tipo de tracción debe tener al menos 1 caracteres')
    .max(20, 'El tipo de tracción no puede exceder 20 caracteres')
    .optional(),
  fuel_type: z
    .string()
    .min(1, 'El tipo de combustible debe tener al menos 1 caracteres')
    .max(20, 'El tipo de combustible no puede exceder 20 caracteres')
    .optional(),
  transmission: z
    .string()
    .min(1, 'El tipo de transmisión debe tener al menos 1 caracteres')
    .max(20, 'El tipo de transmisión no puede exceder 20 caracteres')
    .optional(),
})

export type CreateVehicleFormData = z.infer<typeof createVehicleSchema>
export type EditVehicleFormData = z.infer<typeof editVehicleSchema>
