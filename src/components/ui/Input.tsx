import React from 'react'
import { cn } from '@/lib/utils/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
  description?: string
  variant?: 'default' | 'filled' | 'underlined'
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, description, variant = 'default', className, id, ...props }, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className='space-y-2'>
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
            className={cn(
              // Base styles
              'w-full transition-all duration-200 placeholder-secondary-400',
              'focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',

              // Variant styles
              {
                // Default variant
                'px-4 py-3 border border-secondary-300 rounded-xl glass backdrop-blur-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent':
                  variant === 'default',

                // Filled variant
                'px-4 py-3 bg-secondary-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500':
                  variant === 'filled',

                // Underlined variant
                'px-0 py-2 bg-transparent border-0 border-b-2 border-secondary-300 rounded-none focus:ring-0 focus:border-primary-500':
                  variant === 'underlined',
              },

              // Icon padding
              {
                'pl-12': icon && variant !== 'underlined',
                'pl-8': icon && variant === 'underlined',
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
        </div>

        {/* Description */}
        {description && !error && (
          <p id={`${inputId}-description`} className='text-sm text-secondary-500'>
            {description}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <div
            id={`${inputId}-error`}
            className='flex items-center gap-2 text-sm text-primary-600 animate-fade-in'
            role='alert'
          >
            <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
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
