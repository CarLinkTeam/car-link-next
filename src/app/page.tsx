"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent-100 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 btn-gradient rounded-2xl flex items-center justify-center animate-float">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
              />
            </svg>
          </div>
          <span className="text-xl font-bold gradient-text">CarLink</span>
        </div>

        <div className="flex space-x-4">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button variant="primary" size="sm">
              Registrarse
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="mb-12">
            {/* Main Logo/Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 btn-gradient rounded-4xl mb-8 animate-float shadow-2xl">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6 animate-glow leading-tight">
              CarLink
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-secondary-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              La plataforma de{" "}
              <span className="gradient-text-orange font-semibold">
                renta de vehículos
              </span>{" "}
              más confiable y moderna. Encuentra el auto perfecto para tu
              próximo viaje.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-6 floating-card">
                <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                  Rápido y Fácil
                </h3>
                <p className="text-secondary-600 text-sm">
                  Reserva tu vehículo en menos de 3 minutos
                </p>
              </div>

              <div className="glass rounded-2xl p-6 floating-card">
                <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                  100% Seguro
                </h3>
                <p className="text-secondary-600 text-sm">
                  Vehículos verificados y seguros
                </p>
              </div>

              <div className="glass rounded-2xl p-6 floating-card">
                <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                  Mejor Precio
                </h3>
                <p className="text-secondary-600 text-sm">
                  Tarifas competitivas sin costos ocultos
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">

              <Link href="/auth/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto text-lg px-8 py-4"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Únete Ahora
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold gradient-text">500+</div>
              <div className="text-secondary-600 text-sm">
                Vehículos Disponibles
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">10K+</div>
              <div className="text-secondary-600 text-sm">
                Clientes Satisfechos
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">24/7</div>
              <div className="text-secondary-600 text-sm">
                Soporte al Cliente
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center p-6 text-secondary-500 text-sm">
        <p>&copy; 2025 CarLink. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
