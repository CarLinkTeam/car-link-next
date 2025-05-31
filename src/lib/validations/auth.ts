import { z } from 'zod'

// Esquema para login
export const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es requerido').email('Formato de correo inválido'),
  password: z.string().min(1, 'La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Esquema para registro
export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'El nombre completo es requerido')
      .min(4, 'El nombre debe tener al menos 4 caracteres')
      .max(20, 'El nombre no puede exceder 20 caracteres')
      .regex(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/, 'Solo se permiten letras y espacios'),
    email: z.string().min(1, 'El correo electrónico es requerido').email('Formato de correo inválido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(60, 'La contraseña no puede exceder 60 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
        'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
      ),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    location: z
      .string()
      .min(1, 'La ubicación es requerida')
      .min(3, 'La ubicación debe tener al menos 3 caracteres')
      .max(100, 'La ubicación no puede exceder 100 caracteres'),
    phone: z
      .string()
      .min(1, 'El teléfono es requerido')
      .regex(/^\+\d{1,3}\d{6,14}$/, 'El teléfono debe incluir código de país (ej: +57 300 123 4567)'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
