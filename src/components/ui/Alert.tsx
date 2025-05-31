import React from 'react'
import { cn } from '@/lib/utils/utils'

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  title?: string
  onClose?: () => void
  className?: string
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ type, message, title, onClose, className }, ref) => {
    const icons = {
      success: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      ),
      error: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
      ),
      warning: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
      ),
      info: (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20' aria-hidden='true'>
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            clipRule='evenodd'
          />
        </svg>
      ),
    }

    return (
      <div
        ref={ref}
        role='alert'
        className={cn(
          // Base styles
          'rounded-xl p-4 border glass backdrop-blur-sm animate-fade-in',

          // Type variants usando los colores del config
          {
            // Success - usando colores verdes suaves
            'bg-green-50/80 border-green-200 text-green-800': type === 'success',

            // Error - usando colores primary (rojos) del config
            'bg-primary-50/80 border-primary-200 text-primary-800': type === 'error',

            // Warning - usando colores accent (naranjas) del config
            'bg-accent-50/80 border-accent-200 text-accent-800': type === 'warning',

            // Info - usando colores secondary (azules/grises) del config
            'bg-secondary-50/80 border-secondary-200 text-secondary-800': type === 'info',
          },

          className
        )}
      >
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-start gap-3 flex-1'>
            {/* Icon */}
            <div
              className={cn('flex-shrink-0 mt-0.5', {
                'text-green-600': type === 'success',
                'text-primary-600': type === 'error',
                'text-accent-600': type === 'warning',
                'text-secondary-600': type === 'info',
              })}
            >
              {icons[type]}
            </div>

            {/* Content */}
            <div className='flex-1 min-w-0'>
              {title && (
                <h3
                  className={cn('text-sm font-semibold mb-1', {
                    'text-green-800': type === 'success',
                    'text-primary-800': type === 'error',
                    'text-accent-800': type === 'warning',
                    'text-secondary-800': type === 'info',
                  })}
                >
                  {title}
                </h3>
              )}
              <p
                className={cn('text-sm', {
                  'text-green-700': type === 'success',
                  'text-primary-700': type === 'error',
                  'text-accent-700': type === 'warning',
                  'text-secondary-700': type === 'info',
                })}
              >
                {message}
              </p>
            </div>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className={cn('flex-shrink-0 p-1 rounded-lg transition-colors duration-200 hover:bg-white/50', {
                'text-green-500 hover:text-green-700': type === 'success',
                'text-primary-500 hover:text-primary-700': type === 'error',
                'text-accent-500 hover:text-accent-700': type === 'warning',
                'text-secondary-500 hover:text-secondary-700': type === 'info',
              })}
              aria-label='Cerrar alerta'
            >
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'
