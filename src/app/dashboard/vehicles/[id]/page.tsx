"use client";

import { useParams, useRouter } from "next/navigation";
import { useVehicleDetailsStore } from "@/store/vehicle-details-store";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRentalStore } from "@/store/rental-store";

export default function VehicleDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;

  const {
    vehicles,
    isLoading,
    isLoadingReviews,
    isLoadingUnavailability,
    error,
    reviewsError,
    unavailabilityError,
    fetchVehicleDetails,
    clearErrors,
  } = useVehicleDetailsStore();

  const vehicleDetails = vehicles[vehicleId];
  const vehicle = vehicleDetails?.data;
  const reviews = vehicleDetails?.reviews || [];
  const unavailableDates = vehicleDetails?.unavailableDates || [];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const rentalStore = useRentalStore();
  const {
    isLoading: isRentalLoading,
    error: rentalError,
    success: rentalSuccess,
    createRental,
    clearStatus,
  } = rentalStore;

  // Cargar detalles del vehículo al montar el componente
  useEffect(() => {
    if (vehicleId) {
      fetchVehicleDetails(vehicleId);
    }
  }, [vehicleId, fetchVehicleDetails]);

  // Format price to show in Colombian pesos
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDateRangeSelect = (
    startDate: Date | null,
    endDate: Date | null
  ) => {
    setSelectedDateRange({ startDate, endDate });
  };

  const calculateDays = () => {
    if (!selectedDateRange.startDate || !selectedDateRange.endDate) {
      return 0;
    }

    // Crear fechas normalizadas para asegurar el cálculo correcto
    const startDate = new Date(selectedDateRange.startDate);
    const endDate = new Date(selectedDateRange.endDate);

    // Normalizar las horas para el cálculo
    startDate.setHours(0, 0, 0, 0); // 12:00 AM del día de inicio
    endDate.setHours(23, 59, 59, 900); // 11:59 PM del día de fin

    // Calcular la diferencia en milisegundos y convertir a días
    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Asegurar que siempre sea al menos 1 día (cuando inicio y fin son el mismo día)
    return Math.max(1, days);
  };

  const calculateTotalPrice = () => {
    if (!vehicle) {
      return 0;
    }
    return parseFloat(vehicle.daily_price.toString()) * calculateDays();
  };

  const handleRental = async () => {
    if (!selectedDateRange.startDate || !selectedDateRange.endDate || !vehicle)
      return;

    const rentalData = {
      vehicle_id: vehicle.id,
      initialDate: selectedDateRange.startDate.toISOString(),
      finalDate: selectedDateRange.endDate.toISOString(),
      totalCost: calculateTotalPrice(),
      status: "pending" as const,
    };

    try {
      await createRental(rentalData);
      router.push(
        `/dashboard/vehicles?message=${encodeURIComponent(
          "Reservado con éxito. Se informará al dueño para la aprobación de la renta."
        )}`
      );
    } catch (error) {
      console.error("Error al crear la renta:", error);
    }
  };

  if (isLoading && !vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
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
                Cargando detalles del vehículo...
              </h3>
              <p className="text-secondary-600">
                Por favor espera mientras obtenemos la información
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="mb-4"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Volver
            </Button>
            <Alert
              type="error"
              message={`Error al cargar el vehículo: ${error}`}
              onClose={clearErrors}
            />
            <div className="mt-4">
              <Button
                onClick={() => fetchVehicleDetails(vehicleId, true)}
                variant="primary"
                size="md"
              >
                Reintentar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-secondary-900 mb-4">
              Vehículo no encontrado
            </h1>
            <Button onClick={() => router.back()} variant="primary" size="md">
              Volver a vehículos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 auth-pattern">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-200 to-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-accent-200 to-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-slow"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="glass"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a vehículos
          </Button>
        </div>

        {/* Vehicle Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery and Rental Conditions */}
          <div className="flex flex-col space-y-6">
            {/* Image Gallery */}
            <div className="glass rounded-4xl p-6 shadow-2xl border-2 border-primary-200">
              <div className="mb-6">
                <div className="relative h-96 w-full overflow-hidden rounded-3xl">
                  <Image
                    src={
                      vehicle.url_photos && vehicle.url_photos.length > 0
                        ? vehicle.url_photos[currentImageIndex]
                        : "/placeholder-car.svg"
                    }
                    alt={`${vehicle.make} ${vehicle.vehicleModel} - Imagen ${
                      currentImageIndex + 1
                    }`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />

                  {/* Vehicle class badge */}
                  <div className="absolute top-4 left-4">
                    <span className="btn-gradient text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
                      {vehicle.class}
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              {vehicle.url_photos.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {vehicle.url_photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative flex-shrink-0 h-20 w-28 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex
                          ? "border-primary-500 shadow-lg scale-105"
                          : "border-gray-200 hover:border-primary-300"
                      }`}
                    >
                      <Image
                        src={photo}
                        alt={`Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rental Conditions */}
            <div className="glass rounded-4xl p-8 shadow-2xl border-2 border-primary-200 flex flex-col justify-between h-full">
              <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center">
                <div className="w-8 h-8 btn-gradient rounded-xl flex items-center justify-center mr-3">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                Condiciones de Renta
              </h3>
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-6">
                <ul className="list-disc list-inside text-secondary-700 leading-relaxed text-lg space-y-2">
                  {vehicle.rental_conditions ? (
                    vehicle.rental_conditions
                      .split(".")
                      .filter((condition) => condition.trim() !== "")
                      .map((condition, index) => (
                        <li key={index}>{condition.trim()}.</li>
                      ))
                  ) : (
                    <li>No hay condiciones específicas disponibles.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="glass rounded-4xl p-8 shadow-2xl border-2 border-primary-200">
              <h1 className="text-4xl font-bold gradient-text mb-3">
                {vehicle.vehicleModel}
              </h1>
              <p className="text-xl text-secondary-600 mb-6">
                {vehicle.make} • {vehicle.year}
              </p>
              {/* Price */}
              <div className="text-center bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-6 mb-6">
                <p className="text-4xl font-bold gradient-text mb-2">
                  {formatPrice(vehicle.daily_price.toString())}
                </p>
                <p className="text-lg text-secondary-600 font-medium">
                  por día
                </p>{" "}
              </div>{" "}
              {/* Calendar */}
              <div className="mb-6">
                {isLoadingUnavailability && (
                  <div className="text-center py-4">
                    <p className="text-secondary-600">
                      Cargando disponibilidad...
                    </p>
                  </div>
                )}
                {unavailabilityError && (
                  <div className="mb-4">
                    <Alert
                      type="error"
                      message={`Error al cargar disponibilidad: ${unavailabilityError}`}
                      onClose={() => {}}
                    />
                  </div>
                )}
                <Calendar
                  mode="range"
                  onDateRangeSelect={handleDateRangeSelect}
                  selectedRange={selectedDateRange}
                  className="w-full"
                  unavailableDates={unavailableDates}
                />
              </div>{" "}
              {/* Action Button */}
              <div className="w-full">
                {selectedDateRange.startDate && selectedDateRange.endDate ? (
                  <div className="space-y-4">
                    {/* Total Price Display */}
                    <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-6 text-center">
                      <h4 className="text-lg font-semibold text-secondary-800 mb-2">
                        Precio Total
                      </h4>
                      <p className="text-3xl font-bold gradient-text mb-2">
                        {formatPrice(calculateTotalPrice().toString())}
                      </p>{" "}
                      <p className="text-sm text-secondary-600">
                        {calculateDays()} día(s) de alquiler
                      </p>
                    </div>

                    {/* Rent Button */}
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      onClick={handleRental}
                      disabled={isRentalLoading}
                    >
                      {isRentalLoading ? "Procesando..." : "Confirmar Reserva"}
                    </Button>

                    {/* Success or Error Message */}
                    {rentalSuccess && (
                      <Alert
                        type="success"
                        message="Reserva creada exitosamente."
                        onClose={clearStatus}
                      />
                    )}
                    {rentalError && (
                      <Alert
                        type="error"
                        message={`Error al crear la reserva: ${rentalError}`}
                        onClose={clearStatus}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center p-6 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-3xl">
                    <svg
                      className="w-12 h-12 text-secondary-400 mx-auto mb-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3a4 4 0 118 0v4m-4 8c0 4.5-3 8-8 8s-8-3.5-8-8c0-2.5 1-4 3-4h10c2 0 3 1.5 3 4z"
                      />
                    </svg>
                    <h4 className="text-lg font-semibold text-secondary-700 mb-2">
                      Selecciona las fechas
                    </h4>
                    <p className="text-sm text-secondary-500">
                      Elige las fechas de inicio y fin para ver el precio total
                      y confirmar tu reserva
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="glass rounded-4xl p-8 shadow-2xl border-2 border-primary-200 mb-12">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center">
            <div className="w-8 h-8 btn-gradient rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            Especificaciones Técnicas
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🎨</span>
                <span className="text-sm text-secondary-600 font-medium">
                  Color
                </span>
              </div>
              <p className="font-bold text-secondary-800">{vehicle.color}</p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">⛽</span>
                <span className="text-sm text-secondary-600 font-medium">
                  Combustible
                </span>
              </div>
              <p className="font-bold text-secondary-800">
                {vehicle.fuel_type}
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">⚙️</span>
                <span className="text-sm text-secondary-600 font-medium">
                  Transmisión
                </span>
              </div>
              <p className="font-bold text-secondary-800">
                {vehicle.transmission}
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🚗</span>
                <span className="text-sm text-secondary-600 font-medium">
                  Tracción
                </span>
              </div>
              <p className="font-bold text-secondary-800">{vehicle.drive}</p>
            </div>

            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-4 col-span-2">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🔢</span>
                <span className="text-sm text-secondary-600 font-medium">
                  Placa
                </span>
              </div>
              <p className="font-bold text-secondary-800">
                {vehicle.license_plate}
              </p>
            </div>
          </div>
        </div>

        {/* Owner Information */}
        <div className="glass rounded-4xl p-8 shadow-2xl border-2 border-primary-200">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center">
            <div className="w-8 h-8 btn-gradient rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            Información del Propietario
          </h3>

          <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-3xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 btn-gradient rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 font-medium">
                      Propietario
                    </p>
                    <p className="font-bold text-lg text-secondary-800">
                      {vehicle.owner.fullName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 btn-gradient rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-lg">📍</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 font-medium">
                      Ubicación
                    </p>
                    <p className="font-bold text-lg text-secondary-800">
                      {vehicle.owner.location}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 btn-gradient rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-lg">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 font-medium">
                      Teléfono
                    </p>
                    <p className="font-bold text-lg text-secondary-800">
                      {vehicle.owner.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 btn-gradient rounded-2xl flex items-center justify-center mr-4">
                    <span className="text-white text-lg">📅</span>
                  </div>
                  <div>
                    <p className="text-sm text-secondary-600 font-medium">
                      Miembro desde
                    </p>
                    <p className="font-bold text-lg text-secondary-800">
                      {formatDate(vehicle.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="glass rounded-4xl p-8 shadow-2xl border-2 border-primary-200">
          <h3 className="text-2xl font-bold gradient-text mb-6 flex items-center">
            <div className="w-8 h-8 btn-gradient rounded-xl flex items-center justify-center mr-3">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h8M8 14h4m-6 4h12a2 2 0 002-2V8a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
            Comentarios
          </h3>
          {isLoadingReviews ? (
            <p className="text-gray-500">Cargando comentarios...</p>
          ) : reviewsError ? (
            <p className="text-red-500">
              Error al cargar comentarios: {reviewsError}
            </p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">
              No hay comentarios para este vehículo.
            </p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 shadow rounded-2xl border border-primary-100"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {review.rental?.client?.fullName
                            ? review.rental.client.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "U"}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-secondary-800">
                          {review.rental?.client?.fullName || "Usuario anónimo"}
                        </h4>
                        <span className="text-xs text-secondary-500">
                          {new Date(review.createdAt).toLocaleDateString(
                            "es-CO"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-sm font-medium text-secondary-600 ml-1">
                        ({review.rating}/5)
                      </span>
                    </div>
                  </div>
                  <p className="text-secondary-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
