export default function Loading() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center auth-pattern'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-400 to-accent-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-400 to-primary-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow'></div>
      </div>

      <div className='relative text-center'>
        {/* Loading Card */}
        <div className='glass rounded-4xl shadow-2xl border border-white/20 p-12 floating-card'>
          {/* CarLink Logo/Icon */}
          <div className='mb-8'>
            <div className='inline-flex items-center justify-center w-20 h-20 btn-gradient rounded-2xl mb-4 animate-float'>
              <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
              </svg>
            </div>
          </div>

          {/* Loading Spinner */}
          <div className='relative mb-8'>
            <div className='w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto'></div>
            <div className='w-12 h-12 border-4 border-accent-200 border-t-accent-600 rounded-full animate-reverse-spin absolute top-2 left-1/2 transform -translate-x-1/2'></div>
          </div>

          {/* Loading Text */}
          <h2 className='text-2xl font-semibold gradient-text mb-2'>Cargando CarLink...</h2>
          <p className='text-secondary-600 mb-6'>Por favor espera un momento</p>

          {/* Loading dots animation */}
          <div className='flex justify-center space-x-2'>
            <div className='w-3 h-3 bg-primary-600 rounded-full animate-bounce'></div>
            <div className='w-3 h-3 bg-primary-600 rounded-full animate-bounce delay-100'></div>
            <div className='w-3 h-3 bg-primary-600 rounded-full animate-bounce delay-200'></div>
          </div>

          {/* Progress bar */}
          <div className='mt-8'>
            <div className='w-full bg-secondary-200 rounded-full h-2 overflow-hidden'>
              <div className='h-full btn-gradient rounded-full animate-pulse' style={{ width: '60%' }}></div>
            </div>
            <p className='text-sm text-secondary-500 mt-2'>Preparando tu experiencia...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
