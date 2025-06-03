"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import {
  ReportsService,
  UserRentalsReport,
} from "@/lib/services/reports-service";
import {
  PDFGenerator,
  formatCurrency,
  formatDateRange,
} from "@/lib/utils/pdf-generator";

export default function UserRentalsReportPage() {
  const { user } = useAuthStore();
  const [report, setReport] = useState<UserRentalsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const reportData = await ReportsService.getUserRentalsReport();
      setReport(reportData);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!report || !reportRef.current) return;

    try {
      setGenerating(true);

      const pdf = new PDFGenerator();
      let yPosition = 30;

      // Título
      pdf.addTitle("Reporte de Mis Alquileres");
      yPosition += 20;

      // Información del usuario
      yPosition = pdf.addSubtitle(
        `Usuario: ${user?.fullName || "Usuario"}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Email: ${user?.email || "No disponible"}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
        yPosition
      );
      yPosition = pdf.addSeparator(yPosition);

      // Resumen
      yPosition = pdf.addSubtitle("Resumen de Actividad", yPosition);
      yPosition = pdf.addText(
        `Total de alquileres: ${report.totalRentals}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Total gastado: ${formatCurrency(report.totalSpent)}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Duración promedio por alquiler: ${report.averageRentalDuration} días`,
        yPosition
      );
      yPosition = pdf.addText(
        `Tipo de vehículo favorito: ${report.favoriteVehicleType}`,
        yPosition
      );
      yPosition = pdf.addSeparator(yPosition);

      // Tabla de alquileres
      if (report.rentals.length > 0) {
        yPosition = pdf.addSubtitle("Historial de Alquileres", yPosition);

        const headers = ["Vehículo", "Fecha", "Duración", "Costo", "Estado"];
        const rows = report.rentals.map((rental) => [
          `${rental.vehicle.make} ${rental.vehicle.vehicleModel}`,
          formatDateRange(rental.initialDate, rental.finalDate),
          `${Math.ceil(
            (new Date(rental.finalDate).getTime() -
              new Date(rental.initialDate).getTime()) /
              (1000 * 60 * 60 * 24)
          )} días`,
          formatCurrency(rental.totalCost),
          rental.status === "completed"
            ? "Completado"
            : rental.status === "active"
            ? "Activo"
            : rental.status === "pending"
            ? "Pendiente"
            : rental.status === "confirmed"
            ? "Confirmado"
            : "Cancelado",
        ]);

        pdf.addTable(headers, rows, yPosition);
      }

      const userNameForFile = user?.fullName
        ? user.fullName.replace(/\s+/g, "-")
        : "usuario";
      const filename = `reporte-alquileres-${userNameForFile}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.download(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error al generar el PDF. Por favor, intenta nuevamente.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <div className="text-secondary-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          No se pudo cargar el reporte
        </h3>
        <p className="text-secondary-500 mb-4">
          Hubo un problema al obtener los datos del reporte.
        </p>
        <button onClick={fetchReport} className="btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            Reporte de Mis Alquileres
          </h1>
          <p className="text-secondary-600 mt-2">
            Resumen completo de tu actividad de alquiler de vehículos
          </p>
        </div>
        <button
          onClick={generatePDF}
          disabled={generating}
          className="btn-primary flex items-center gap-2"
        >
          {generating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Generando...
            </>
          ) : (
            <>
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
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar PDF
            </>
          )}
        </button>
      </div>

      {/* Resumen de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="floating-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
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
                    d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Total Alquileres
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {report.totalRentals}
              </p>
            </div>
          </div>
        </div>

        <div className="floating-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Total Gastado
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(report.totalSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="floating-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
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
                    d="M8 7V3a4 4 0 118 0v4m-4 12v-4m-4-4h8m-4 12a9 9 0 110-18m0 18a9 9 0 000-18"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Duración Promedio
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {report.averageRentalDuration} días
              </p>
            </div>
          </div>
        </div>

        <div className="floating-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Tipo Favorito
              </p>
              <p className="text-lg font-bold text-secondary-900">
                {report.favoriteVehicleType}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de alquileres */}
      <div ref={reportRef} className="floating-card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Historial de Alquileres
          </h2>
        </div>

        {report.rentals.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-secondary-500">
              No has realizado ningún alquiler aún.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Costo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {report.rentals.map((rental) => {
                  const days = Math.ceil(
                    (new Date(rental.finalDate).getTime() -
                      new Date(rental.initialDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  );

                  return (
                    <tr key={rental.id} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={
                                rental.vehicle.url_photos[0] ||
                                "/placeholder-car.jpg"
                              }
                              alt={`${rental.vehicle.make} ${rental.vehicle.vehicleModel}`}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-secondary-900">
                              {rental.vehicle.make}{" "}
                              {rental.vehicle.vehicleModel}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {rental.vehicle.year} • {rental.vehicle.color}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {formatDateRange(rental.initialDate, rental.finalDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                        {days} día{days !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {formatCurrency(rental.totalCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            rental.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : rental.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : rental.status === "confirmed"
                              ? "bg-yellow-100 text-yellow-800"
                              : rental.status === "pending"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {rental.status === "completed"
                            ? "Completado"
                            : rental.status === "active"
                            ? "Activo"
                            : rental.status === "confirmed"
                            ? "Confirmado"
                            : rental.status === "pending"
                            ? "Pendiente"
                            : "Cancelado"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
