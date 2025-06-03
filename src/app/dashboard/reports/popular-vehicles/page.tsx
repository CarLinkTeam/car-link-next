"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ReportsService,
  PopularVehiclesReport,
} from "@/lib/services/reports-service";
import { PDFGenerator, formatCurrency } from "@/lib/utils/pdf-generator";

export default function PopularVehiclesReportPage() {
  const [report, setReport] = useState<PopularVehiclesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const reportData = await ReportsService.getPopularVehiclesReport();
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
      pdf.addTitle("Reporte de Vehículos Más Populares");
      yPosition += 20;

      // Información del período
      yPosition = pdf.addSubtitle(`Período: ${report.period}`, yPosition);
      yPosition = pdf.addText(
        `Total de alquileres en el período: ${report.totalRentals}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
        yPosition
      );
      yPosition = pdf.addSeparator(yPosition);

      // Ranking de vehículos
      if (report.vehicles.length > 0) {
        yPosition = pdf.addSubtitle(
          "Ranking de Vehículos Más Alquilados",
          yPosition
        );

        const headers = [
          "Posición",
          "Vehículo",
          "Alquileres",
          "Ingresos",
          "Rating",
        ];
        const rows = report.vehicles
          .slice(0, 10)
          .map((item, index) => [
            (index + 1).toString(),
            `${item.vehicle.make} ${item.vehicle.vehicleModel} (${item.vehicle.year})`,
            item.rentalCount.toString(),
            formatCurrency(item.totalIncome),
            `${item.averageRating.toFixed(1)}/5`,
          ]);

        pdf.addTable(headers, rows, yPosition);
      }

      const filename = `reporte-vehiculos-populares-${
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
            Vehículos Más Populares
          </h1>
          <p className="text-secondary-600 mt-2">
            Ranking de los vehículos más alquilados en{" "}
            {report.period.toLowerCase()}
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

      {/* Resumen general */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-16h14a2 2 0 012 2v14a2 2 0 01-2 2M7 7h10m-10 4h10m-10 4h7"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Vehículos Activos
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {report.vehicles.length}
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
                Período de Análisis
              </p>
              <p className="text-lg font-bold text-secondary-900">
                {report.period}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Podio */}
      {report.vehicles.length >= 3 && (
        <div className="floating-card p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">
              🏆 Top 3 Vehículos Más Populares
            </h2>
            <p className="text-secondary-500">
              Los vehículos con mayor número de alquileres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Segundo lugar */}
            {report.vehicles[1] && (
              <div className="order-2 md:order-1">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-4">
                    <img
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      src={
                        report.vehicles[1].vehicle.url_photos[0] ||
                        "/placeholder-car.jpg"
                      }
                      alt={`${report.vehicles[1].vehicle.make} ${report.vehicles[1].vehicle.vehicleModel}`}
                    />
                    <h3 className="font-bold text-lg text-secondary-900">
                      {report.vehicles[1].vehicle.make}{" "}
                      {report.vehicles[1].vehicle.vehicleModel}
                    </h3>
                    <p className="text-secondary-500 text-sm mb-2">
                      {report.vehicles[1].vehicle.year}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Alquileres:</span>{" "}
                        {report.vehicles[1].rentalCount}
                      </p>
                      <p>
                        <span className="font-medium">Ingresos:</span>{" "}
                        {formatCurrency(report.vehicles[1].totalIncome)}
                      </p>
                      <p>
                        <span className="font-medium">Rating:</span> ⭐{" "}
                        {report.vehicles[1].averageRating.toFixed(1)}/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Primer lugar */}
            {report.vehicles[0] && (
              <div className="order-1 md:order-2">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-2xl">1</span>
                  </div>
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <img
                      className="w-full h-36 object-cover rounded-lg mb-3"
                      src={
                        report.vehicles[0].vehicle.url_photos[0] ||
                        "/placeholder-car.jpg"
                      }
                      alt={`${report.vehicles[0].vehicle.make} ${report.vehicles[0].vehicle.vehicleModel}`}
                    />
                    <h3 className="font-bold text-xl text-secondary-900">
                      {report.vehicles[0].vehicle.make}{" "}
                      {report.vehicles[0].vehicle.vehicleModel}
                    </h3>
                    <p className="text-secondary-500 mb-3">
                      {report.vehicles[0].vehicle.year}
                    </p>
                    <div className="space-y-2">
                      <p className="text-lg">
                        <span className="font-medium">Alquileres:</span>{" "}
                        {report.vehicles[0].rentalCount}
                      </p>
                      <p className="text-lg">
                        <span className="font-medium">Ingresos:</span>{" "}
                        {formatCurrency(report.vehicles[0].totalIncome)}
                      </p>
                      <p>
                        <span className="font-medium">Rating:</span> ⭐{" "}
                        {report.vehicles[0].averageRating.toFixed(1)}/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tercer lugar */}
            {report.vehicles[2] && (
              <div className="order-3">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-yellow-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <img
                      className="w-full h-32 object-cover rounded-lg mb-3"
                      src={
                        report.vehicles[2].vehicle.url_photos[0] ||
                        "/placeholder-car.jpg"
                      }
                      alt={`${report.vehicles[2].vehicle.make} ${report.vehicles[2].vehicle.vehicleModel}`}
                    />
                    <h3 className="font-bold text-lg text-secondary-900">
                      {report.vehicles[2].vehicle.make}{" "}
                      {report.vehicles[2].vehicle.vehicleModel}
                    </h3>
                    <p className="text-secondary-500 text-sm mb-2">
                      {report.vehicles[2].vehicle.year}
                    </p>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Alquileres:</span>{" "}
                        {report.vehicles[2].rentalCount}
                      </p>
                      <p>
                        <span className="font-medium">Ingresos:</span>{" "}
                        {formatCurrency(report.vehicles[2].totalIncome)}
                      </p>
                      <p>
                        <span className="font-medium">Rating:</span> ⭐{" "}
                        {report.vehicles[2].averageRating.toFixed(1)}/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla completa de ranking */}
      <div ref={reportRef} className="floating-card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Ranking Completo
          </h2>
          <p className="text-sm text-secondary-500 mt-1">
            Todos los vehículos ordenados por popularidad
          </p>
        </div>

        {report.vehicles.length === 0 ? (
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <p className="text-secondary-500">
              No hay datos de vehículos disponibles para este período.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Posición
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Alquileres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Ingresos Generados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Rating Promedio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Precio Diario
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {report.vehicles.map((item, index) => (
                  <tr key={item.vehicle.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0
                            ? "bg-yellow-500"
                            : index === 1
                            ? "bg-gray-400"
                            : index === 2
                            ? "bg-yellow-700"
                            : "bg-primary-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={
                              item.vehicle.url_photos[0] ||
                              "/placeholder-car.jpg"
                            }
                            alt={`${item.vehicle.make} ${item.vehicle.vehicleModel}`}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {item.vehicle.make} {item.vehicle.vehicleModel}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {item.vehicle.year} • {item.vehicle.color}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {item.rentalCount}
                      </div>
                      <div className="text-sm text-secondary-500">
                        alquiler{item.rentalCount !== 1 ? "es" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      {formatCurrency(item.totalIncome)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-secondary-900">
                          {item.averageRating.toFixed(1)}
                        </span>
                        <span className="ml-1 text-yellow-400">⭐</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {formatCurrency(item.vehicle.daily_price)}/día
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
