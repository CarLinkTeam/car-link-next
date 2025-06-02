"use client";

import { useState, useEffect } from "react";
import { FaHistory, FaFilter, FaSearch } from "react-icons/fa";
import { useUserRentals } from "@/hooks/useUserRentals";
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
    createReview,
    checkHasReview,
  } = useUserRentals();

  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [rentalReviews, setRentalReviews] = useState<Record<string, boolean>>(
    {}
  );
  const [filterStatus, setFilterStatus] = useState<RentalStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Verificar qué rentas ya tienen review
  useEffect(() => {
    const checkReviews = async () => {
      const reviewsMap: Record<string, boolean> = {};
      for (const rental of rentals) {
        if (rental.status === "completed") {
          const hasReview = await checkHasReview(rental.id);
          reviewsMap[rental.id] = hasReview;
        }
      }
      console.log("Este es el estado de reviews:", reviewsMap);
      setRentalReviews(reviewsMap);
    };

    if (rentals.length > 0) {
      checkReviews();
    }
  }, [rentals, checkHasReview]);

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
    try {
      const result = await createReview(reviewData);
      if (result) {
        setShowSuccessAlert(true);
        setIsReviewFormOpen(false);
        setSelectedRental(null);
        // Actualizar el estado de reviews
        setRentalReviews((prev) => ({
          ...prev,
          [reviewData.rental_id]: true,
        }));
        setTimeout(() => setShowSuccessAlert(false), 5000);
      }
    } catch (error) {
      console.error("Error al crear review:", error);
    }
  };

  const getStatusCount = (status: RentalStatus) => {
    return rentals.filter((rental) => rental.status === status).length;
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Success Alert */}
        {showSuccessAlert && (
          <div className="mb-6">
            <Alert
              type="success"
              title="Review creada exitosamente"
              message="Gracias por compartir tu experiencia. Tu calificación ayuda a otros usuarios."
              onClose={() => setShowSuccessAlert(false)}
            />
          </div>
        )}

        {/* Error Alert */}
        {(error || reviewError) && (
          <div className="mb-6">
            <Alert
              type="error"
              title="Error"
              message={error || reviewError || "Ha ocurrido un error"}
              onClose={() => {
                // Clear errors would need to be implemented in the hook
              }}
            />
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl">
              <FaHistory className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">
              Historial de Rentas
            </h1>
          </div>
          <p className="text-secondary-600 text-lg">
            Revisa tus rentas anteriores y comparte tu experiencia
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass p-4 rounded-2xl border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold gradient-text">
                {rentals.length}
              </div>
              <div className="text-sm text-secondary-600">Total</div>
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getStatusCount("completed")}
              </div>
              <div className="text-sm text-secondary-600">Completadas</div>
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {getStatusCount("confirmed")}
              </div>
              <div className="text-sm text-secondary-600">Activas</div>
            </div>
          </div>
          <div className="glass p-4 rounded-2xl border border-primary-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {getStatusCount("pending")}
              </div>
              <div className="text-sm text-secondary-600">Pendientes</div>
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
                  <option value="active">Activas</option>
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
                hasReview={rentalReviews[rental.id] || false}
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
    </div>
  );
}
