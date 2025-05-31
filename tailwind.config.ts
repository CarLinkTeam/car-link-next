import type { Config } from 'tailwindcss'

type CSSRuleObject = Record<string, string | Record<string, string>>

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './store/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        secondary: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-out': 'fadeOut 0.3s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'reverse-spin': 'reverse-spin 0.8s linear infinite',
        float: 'float 1.5s ease-in-out infinite',
        glow: 'glow 1s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'reverse-spin': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(239, 68, 68, 0.5)' },
          '100%': { boxShadow: '0 0 15px rgba(239, 68, 68, 0.8), 0 0 25px rgba(220, 38, 38, 0.4)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'auth-pattern':
          'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '3rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 10px 15px -3px rgba(0, 0, 0, 0.1), inset 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        glow: '0 0 15px rgba(239, 68, 68, 0.3)',
        'glow-lg': '0 0 25px rgba(239, 68, 68, 0.4)',
        'red-glow': '0 0 20px rgba(220, 38, 38, 0.5)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [
    // Plugin personalizado para componentes de CarLink
    function ({ addComponents }: { addComponents: (components: Record<string, CSSRuleObject>) => void }) {
      addComponents({
        '.glass': {
          background: 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.3)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.gradient-text': {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.gradient-text-orange': {
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.btn-gradient': {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          border: 'none',
          color: 'white',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            transform: 'translateY(-1px)',
            'box-shadow': '0 8px 20px rgba(239, 68, 68, 0.3)',
          },
        },
        '.btn-gradient-orange': {
          background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
          border: 'none',
          color: 'white',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            transform: 'translateY(-1px)',
            'box-shadow': '0 8px 20px rgba(249, 115, 22, 0.3)',
          },
        },
        '.floating-card': {
          transform: 'translateY(0)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            'box-shadow': '0 15px 30px rgba(0, 0, 0, 0.1)',
          },
        },
        '.car-card': {
          background: 'rgba(255, 255, 255, 0.95)',
          'backdrop-filter': 'blur(8px)',
          border: '1px solid rgba(239, 68, 68, 0.1)',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': '0 12px 25px rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          },
        },
      })
    },
  ],
}

export default config
