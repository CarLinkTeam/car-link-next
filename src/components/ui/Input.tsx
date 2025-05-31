import React from 'react'
import { cn } from '@/lib/utils/utils'
import { useToggle } from '@/hooks/useToggle'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  description?: string
  variant?: 'default' | 'filled' | 'underlined'
  showPasswordToggle?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, icon, description, variant = 'default', className, id, type, showPasswordToggle = true, ...props },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
    const [showPassword, toggleShowPassword] = useToggle(false)
    const isPasswordField = type === 'password'
    const actualType = isPasswordField && showPassword ? 'text' : type

    return (
      <div className='space-y-1.5'>
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className='block text-sm font-medium text-secondary-700'>
            {label}
            {props.required && <span className='text-primary-500 ml-1'>*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className='relative'>
          {/* Icon */}
          {icon && (
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
              <div
                className={cn('text-secondary-400', {
                  'text-primary-500': error,
                })}
              >
                {icon}
              </div>
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            className={cn(
              // Base styles
              'w-full transition-all duration-200 placeholder-secondary-400',
              'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',

              // Variant styles
              {
                // Default variant
                'px-4 py-2.5 border border-secondary-300 rounded-xl glass backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent':
                  variant === 'default',

                // Filled variant
                'px-4 py-2.5 bg-secondary-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500':
                  variant === 'filled',

                // Underlined variant
                'px-0 py-2 bg-transparent border-0 border-b-2 border-secondary-300 rounded-none focus:ring-0 focus:border-primary-500':
                  variant === 'underlined',
              },

              // Icon padding
              {
                'pl-11': icon && variant !== 'underlined',
                'pl-8': icon && variant === 'underlined',
              },

              // Password toggle padding (derecha)
              {
                'pr-11': isPasswordField && showPasswordToggle && variant !== 'underlined',
                'pr-8': isPasswordField && showPasswordToggle && variant === 'underlined',
              },

              // Error states usando colores primary (rojos) del config
              {
                'border-primary-500 focus:ring-primary-500': error && variant === 'default',
                'bg-primary-50 border-primary-300 focus:ring-primary-500': error && variant === 'filled',
                'border-primary-500 focus:border-primary-600': error && variant === 'underlined',
              },

              className
            )}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : description ? `${inputId}-description` : undefined}
            {...props}
          />

          {/* Password Toggle Button */}
          {isPasswordField && showPasswordToggle && (
            <button
              type='button'
              onClick={toggleShowPassword}
              className='absolute inset-y-0 right-0 pr-3 flex items-center text-secondary-400 hover:text-primary-600 transition-colors duration-200 z-10'
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                // Icono de ojo cerrado (ocultar)
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21'
                  />
                </svg>
              ) : (
                // Icono de ojo abierto (mostrar)
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  />
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Description */}
        {description && !error && (
          <p id={`${inputId}-description`} className='text-xs text-secondary-500'>
            {description}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div
            id={`${inputId}-error`}
            className='flex items-center gap-1.5 text-xs text-primary-600 animate-fade-in'
            role='alert'
          >
            <svg className='w-3 h-3 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
