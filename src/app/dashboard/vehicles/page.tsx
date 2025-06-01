"use client";

import VehicleCard from "@/components/ui/VehicleCard";
import { vehiclesData } from "@/lib/data/static-vehicles";

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent-100 to-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b-2 border-primary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 btn-gradient rounded-2xl mb-4 animate-float shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3 animate-glow">
              Vehículos Disponibles
            </h1>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Explora nuestra colección exclusiva de vehículos listos para tu
              próxima aventura
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search/Filter Section */}
        <div className="mb-12">
          <div className="glass rounded-4xl p-8 floating-card shadow-2xl border-2 border-primary-200">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 btn-gradient rounded-xl flex items-center justify-center mr-4">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold gradient-text">
                Filtros y Búsqueda
              </h2>
            </div>
            <p className="text-secondary-600 text-lg">
              Utiliza los filtros para encontrar el vehículo perfecto que se
              adapte a tus necesidades
            </p>
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {vehiclesData.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>

        {/* No vehicles fallback */}
        {vehiclesData.length === 0 && (
          <div className="text-center py-16">
            <div className="glass rounded-4xl p-12 floating-card shadow-2xl border-2 border-primary-200 max-w-md mx-auto">
              <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-4">
                No hay vehículos disponibles
              </h3>
              <p className="text-secondary-600">
                No hay vehículos disponibles en este momento. Inténtalo más
                tarde.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
