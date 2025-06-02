"use client";

import VehicleCard from "@/components/ui/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";
import { useState, useMemo } from "react";

export default function VehiclesPage() {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get("message");

  // Estados para búsqueda y paginación
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const {
    vehicles: allVehicles,
    isLoading,
    error,
    refreshVehicles,
  } = useVehicles();

  const filteredVehicles = useMemo(() => {
    if (!allVehicles) return [];

    return allVehicles.filter((vehicle) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [allVehicles, searchTerm]);

  // Calcular paginación
  const totalVehicles = filteredVehicles.length;
  const totalPages = Math.ceil(totalVehicles / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const vehicles = filteredVehicles.slice(startIndex, endIndex);

  // Reset página cuando se busca
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll hacia arriba cuando cambie la página
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    return buttons;
  };

  // Debug logging
  console.log("Debug - Page state:", {
    searchTerm,
    currentPage,
    allVehicles: allVehicles?.length,
    filteredVehicles: filteredVehicles?.length,
    vehicles: vehicles?.length,
    totalPages,
    totalVehicles,
    isLoading,
    error,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Alert type="success" message={successMessage} onClose={() => {}} />
        </div>
      )}

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
        {" "}
        {/* Search/Filter Section */}
        <div className="mb-12">
          <div className="glass rounded-4xl p-8 shadow-2xl border-2 border-primary-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
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
                  Buscar Vehículos
                </h2>
              </div>
              {error && (
                <Button
                  onClick={refreshVehicles}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reintentar
                </Button>
              )}
            </div>

            {/* Barra de búsqueda */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por marca o modelo..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-colors text-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-secondary-400"
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
                {searchTerm && (
                  <button
                    onClick={() => handleSearchChange("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Información de resultados */}
            {totalVehicles !== undefined && (
              <p className="text-secondary-600 text-lg">
                {searchTerm
                  ? `${totalVehicles} vehículo(s) encontrado(s) para "${searchTerm}"`
                  : `${totalVehicles} vehículo(s) disponible(s)`}
              </p>
            )}
          </div>
        </div>
        {/* Error Alert */}
        {error && (
          <div className="mb-8">
            <Alert
              type="error"
              message={`Error al cargar vehículos: ${error}`}
              onClose={() => {}}
            />
          </div>
        )}
        {/* Loading State */}{" "}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="glass rounded-4xl p-12 shadow-2xl border-2 border-primary-200">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                  <svg
                    className="w-8 h-8 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold gradient-text mb-2">
                  Cargando vehículos...
                </h3>
                <p className="text-secondary-600">
                  Por favor espera mientras obtenemos la información más
                  reciente
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Vehicle Grid */}
        {!isLoading && !error && vehicles && vehicles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* Paginación */}
            {(totalPages && totalPages > 1) ||
            (searchTerm.length > 0 && totalVehicles !== undefined) ? (
              <div className="mt-12 flex justify-center">
                <div className="glass rounded-4xl p-6 shadow-2xl border-2 border-primary-200">
                  {totalPages && totalPages > 1 && (
                    <div className="flex items-center gap-2 mb-4">
                      {/* Botón anterior */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-xl border-2 border-primary-200 text-secondary-700 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                      </button>

                      {/* Botones de páginas */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-4 py-2 rounded-xl border-2 border-primary-200 text-secondary-700 hover:bg-primary-50 transition-colors"
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className="px-2 text-secondary-400">...</span>
                          )}
                        </>
                      )}

                      {getPaginationButtons().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-xl border-2 transition-colors ${
                            pageNum === currentPage
                              ? "btn-gradient text-white border-transparent"
                              : "border-primary-200 text-secondary-700 hover:bg-primary-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="px-2 text-secondary-400">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-4 py-2 rounded-xl border-2 border-primary-200 text-secondary-700 hover:bg-primary-50 transition-colors"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}

                      {/* Botón siguiente */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-xl border-2 border-primary-200 text-secondary-700 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Información de página */}
                  <div className="text-center">
                    <p className="text-sm text-secondary-600">
                      {totalPages && totalPages > 1 ? (
                        <>
                          Página {currentPage} de {totalPages}
                        </>
                      ) : null}
                      {totalVehicles !== undefined && (
                        <>
                          {" "}
                          • {totalVehicles} vehículo(s){" "}
                          {searchTerm ? `encontrado(s)` : "total"}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
        {/* No vehicles fallback */}{" "}
        {!isLoading && !error && vehicles && vehicles.length === 0 && (
          <div className="text-center py-16">
            <div className="glass rounded-4xl p-12 shadow-2xl border-2 border-primary-200 max-w-md mx-auto">
              <div className="w-16 h-16 btn-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
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
              <p className="text-secondary-600 mb-6">
                No hay vehículos disponibles en este momento.
              </p>
              <Button onClick={refreshVehicles} variant="primary" size="md">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
