"use client";

import Image from "next/image";
import { Rental } from "@/lib/types/entities/rental";
import { useUserRentalsStore } from "@/store/user-rentals-store";
import {
  FaStar,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

interface RentalCardProps {
  rental: Rental;
  onReviewClick: (rental: Rental) => void;
}

export default function RentalCard({ rental, onReviewClick }: RentalCardProps) {
  const { rentalReviews } = useUserRentalsStore();
  const hasReview = rentalReviews[rental.id] || false;

  // Formatear precio
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Obtener el icono del estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "active":
        return <FaClock className="text-blue-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  // Obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50 border-green-200";
      case "confirmed":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  // Traducir estado
  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      completed: "Completada",
      confirmed: "Aprovada",
      pending: "Pendiente",
      cancelled: "Cancelada",
    };
    return translations[status] || status;
  };

  return (
    <div className="glass rounded-4xl overflow-hidden floating-card shadow-2xl border-2 border-primary-200 transition-all duration-500 hover:scale-105 hover:shadow-glow-lg transform-gpu group">
      {/* Imagen del vehículo */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={
            rental.vehicle.url_photos && rental.vehicle.url_photos.length > 0
              ? rental.vehicle.url_photos[0]
              : "/placeholder-car.svg"
          }
          alt={`${rental.vehicle.make} ${rental.vehicle.vehicleModel}`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Badge de estado */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-2 rounded-xl text-xs font-bold border ${getStatusColor(
              rental.status
            )} flex items-center gap-2`}
          >
            {getStatusIcon(rental.status)}
            {translateStatus(rental.status)}
          </span>
        </div>
      </div>

      {/* Información de la renta */}
      <div className="p-6">
        {/* Nombre del vehículo */}
        <div className="mb-4">
          <h3 className="text-xl font-bold gradient-text mb-1">
            {rental.vehicle.make} {rental.vehicle.vehicleModel}
          </h3>
          <p className="text-sm text-secondary-600 font-medium">
            {rental.vehicle.year} • {rental.vehicle.color}
          </p>
        </div>

        {/* Fechas */}
        <div className="mb-4 space-y-3">
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <FaCalendarAlt className="text-white text-xs" />
            </div>
            <div>
              <span className="font-medium block">Fecha de inicio</span>
              <span className="text-xs text-secondary-500">
                {formatDate(rental.initialDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <FaCalendarAlt className="text-white text-xs" />
            </div>
            <div>
              <span className="font-medium block">Fecha final</span>
              <span className="text-xs text-secondary-500">
                {formatDate(rental.finalDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Costo total */}
        <div className="mb-4 text-center">
          <p className="text-2xl font-bold gradient-text">
            {formatPrice(rental.totalCost)}
          </p>
          <p className="text-sm text-secondary-500 font-medium">Costo total</p>
        </div>

        {/* Botón de review */}
        {rental.status === "completed" && (
          <div className="pt-4 border-t-2 border-primary-100">
            {hasReview ? (
              <div className="text-center">
                <span className="text-sm text-secondary-600 flex items-center justify-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Ya has calificado esta renta
                </span>
              </div>
            ) : (
              <button
                onClick={() => onReviewClick(rental)}
                className="w-full btn-gradient text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu flex items-center justify-center gap-2"
              >
                <FaStar className="text-yellow-300" />
                Calificar renta
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
