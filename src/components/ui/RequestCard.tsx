"use client";

import Image from "next/image";
import { Rental } from "@/lib/types/entities/rental";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCarSide,
} from "react-icons/fa";

interface RentalRequestCardProps {
  rental: Rental;
  onAccept: (rentalId: string) => void;
  onReject: (rentalId: string) => void;
}

export default function RentalRequestCard({
  rental,
  onAccept,
  onReject,
}: RentalRequestCardProps) {
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "confirmed":
        return <FaClock className="text-blue-500" />;
      case "pending":
        return <FaClock className="text-yellow-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const translateStatus = (status: string) => {
    const translations: Record<string, string> = {
      completed: "Completada",
      confirmed: "Aprobada",
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
        />
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

      <div className="p-6">
        {/* Vehículo */}
        <div className="mb-3">
          <h3 className="text-xl font-bold gradient-text mb-1 flex items-center gap-2">
            <FaCarSide />
            {rental.vehicle.make} {rental.vehicle.vehicleModel}
          </h3>
          <p className="text-sm text-secondary-600">
            {rental.vehicle.year} • {rental.vehicle.color}
          </p>
        </div>

        {/* Fechas */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-2">
              <FaCalendarAlt className="text-white text-xs" />
            </div>
            <span className="text-xs">
              <strong>Inicio:</strong> {formatDate(rental.initialDate)}
            </span>
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-2">
              <FaCalendarAlt className="text-white text-xs" />
            </div>
            <span className="text-xs">
              <strong>Fin:</strong> {formatDate(rental.finalDate)}
            </span>
          </div>
        </div>

        {/* Precio */}
        <div className="text-center mb-4">
          <p className="text-2xl font-bold gradient-text">
            {formatPrice(rental.totalCost)}
          </p>
          <p className="text-sm text-secondary-500 font-medium">Costo total</p>
        </div>

        {/* Botones si está pendiente */}
        {rental.status === "pending" && (
          <div className="flex gap-3 pt-4 border-t-2 border-primary-100">
            <button
              onClick={() => onAccept(rental.id)}
              className="w-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
            >
              Aceptar
            </button>
            <button
              onClick={() => onReject(rental.id)}
              className="w-1/2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold text-sm transition"
            >
              Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
