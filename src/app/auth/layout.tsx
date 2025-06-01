'use client'

import React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-4 auth-pattern'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse'></div>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-slow'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent-100 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500'></div>
      </div>

      {/* Main Content Container */}
      <div className='relative w-full max-w-lg'>
        {/* Main Card */}
        <div className='glass rounded-4xl shadow-2xl border-2 border-primary-200 p-6 floating-card'>{children}</div>
      </div>
    </div>
  )
}
