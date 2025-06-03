"use client";

import { useState, useEffect } from "react";
import { FaHistory, FaFilter, FaSearch } from "react-icons/fa";
import { useUserRentalsStore } from "@/store/user-rentals-store";
import {
  Rental,
  RentalStatus,
  CreateReviewData,
} from "@/lib/types/entities/rental";
import RentalCard from "@/components/ui/RentalCard";
import ReviewForm from "@/components/ui/ReviewForm";
import { Alert } from "@/components/ui/Alert";

export default function RentalsPage() {
  const {
    rentals,
    isLoading,
    error,
    isCreatingReview,
    reviewError,
    fetchRentals,
    createReview,
    clearError,
    clearReviewError,
  } = useUserRentalsStore();

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<RentalStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar rentas al montar el componente
  useEffect(() => {
    const loadRentals = async () => {
      await fetchRentals();
      setIsInitialLoad(false);
    };

    loadRentals();
  }, [fetchRentals]);

  // Filtrar rentas
  const filteredRentals = rentals.filter((rental) => {
    const matchesStatus =
      filterStatus === "all" || rental.status === filterStatus;
    const matchesSearch =
      rental.vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.vehicle.vehicleModel
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleReviewClick = (rental: Rental) => {
    setSelectedRental(rental);
    setIsReviewFormOpen(true);
  };

  const handleReviewSubmit = async (reviewData: CreateReviewData) => {
    const result = await createReview(reviewData);
    if (result) {
      setShowSuccessAlert(true);
      setIsReviewFormOpen(false);
      setSelectedRental(null);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    }
  };

  const getStatusCount = (status: RentalStatus) => {
    return rentals.filter((rental) => rental.status === status).length;
  };

  const handleCloseAlert = () => {
    clearError();
  };

  const handleCloseReviewAlert = () => {
    clearReviewError();
  };

  // Mostrar loading solo en la carga inicial cuando no hay rentas
  const shouldShowLoading = isInitialLoad && rentals.length === 0;

  if (shouldShowLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando rentas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-400 to-accent-500 rounded-2xl mb-4">
          <FaHistory className="text-white text-2xl" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">
          Mis Rentas
          {isLoading && rentals.length > 0 && (
            <span className="ml-2 inline-block">
              <div className="animate-spin w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            </span>
          )}
        </h1>
        <p className="text-secondary-600 max-w-2xl mx-auto">
          Gestiona todas tus rentas y deja reseñas sobre tu experiencia
        </p>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert
          type="success"
          message="¡Review creada exitosamente!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {/* Error Alerts */}
      {error && (
        <Alert type="error" message={error} onClose={handleCloseAlert} />
      )}

      {reviewError && (
        <Alert
          type="error"
          message={reviewError}
          onClose={handleCloseReviewAlert}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass p-6 rounded-3xl text-center border-2 border-primary-200 floating-card">
          <div className="text-3xl font-bold gradient-text">
            {rentals.length}
          </div>
          <div className="text-sm text-secondary-600 font-medium">
            Total rentas
          </div>
        </div>
        <div className="glass p-6 rounded-3xl text-center border-2 border-green-200 floating-card">
          <div className="text-3xl font-bold text-green-600">
            {getStatusCount("completed")}
          </div>
          <div className="text-sm text-secondary-600 font-medium">
            Completadas
          </div>
        </div>
        <div className="glass p-6 rounded-3xl text-center border-2 border-blue-200 floating-card">
          <div className="text-3xl font-bold text-blue-600">
            {getStatusCount("confirmed")}
          </div>
          <div className="text-sm text-secondary-600 font-medium">Activas</div>
        </div>
        <div className="glass p-6 rounded-3xl text-center border-2 border-yellow-200 floating-card">
          <div className="text-3xl font-bold text-yellow-600">
            {getStatusCount("pending")}
          </div>
          <div className="text-sm text-secondary-600 font-medium">
            Pendientes
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-3xl border-2 border-primary-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="Buscar por marca o modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="md:w-64">
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as RentalStatus | "all")
                }
                className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-colors appearance-none bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="completed">Completadas</option>
                <option value="confirmed">Confirmadas</option>
                <option value="pending">Pendientes</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Rentals Grid */}
      {filteredRentals.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🚗</div>
          <h3 className="text-xl font-bold text-secondary-700 mb-2">
            {rentals.length === 0
              ? "No tienes rentas aún"
              : "No se encontraron rentas con los filtros aplicados"}
          </h3>
          <p className="text-secondary-500">
            {rentals.length === 0
              ? "¡Explora nuestros vehículos disponibles y haz tu primera renta!"
              : "Prueba con diferentes filtros o términos de búsqueda"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              onReviewClick={handleReviewClick}
            />
          ))}
        </div>
      )}

      {/* Review Form Modal */}
      {selectedRental && (
        <ReviewForm
          rental={selectedRental}
          isOpen={isReviewFormOpen}
          onClose={() => {
            setIsReviewFormOpen(false);
            setSelectedRental(null);
          }}
          onSubmit={handleReviewSubmit}
          isLoading={isCreatingReview}
        />
      )}
    </div>
  );
}
