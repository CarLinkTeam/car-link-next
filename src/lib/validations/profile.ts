import { z } from 'zod'

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre completo es requerido')
    .min(4, 'El nombre debe tener al menos 4 caracteres')
    .max(20, 'El nombre no puede exceder 20 caracteres')
    .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'Solo se permiten letras y espacios'),
  phone: z
    .string()
    .min(1, 'El teléfono es requerido')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .max(20, 'El teléfono no puede exceder 20 caracteres')
    .regex(/^\+\d{1,3}\d{6,14}$/, 'El teléfono debe incluir código de país (ej: +57 300 123 4567)'),
  location: z
    .string()
    .min(1, 'La ubicación es requerida')
    .min(3, 'La ubicación debe tener al menos 3 caracteres')
    .max(100, 'La ubicación no puede exceder 100 caracteres'),
  password: z
    .string()
    .optional()
    .refine((val) => !val || (val.length >= 6 && val.length <= 50), {
      message: 'La contraseña debe tener entre 6 y 50 caracteres',
    }),
})

export type EditProfileFormData = z.infer<typeof editProfileSchema>
