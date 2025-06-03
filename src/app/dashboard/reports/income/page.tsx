"use client";

import React, { useState, useEffect, useRef } from "react";
import { useUserWithFullName } from "@/store/auth-store";
import { hasRole } from "@/lib/utils/utils";
import { User } from "@/lib/types";
import {
  ReportsService,
  OwnerIncomeReport,
} from "@/lib/services/reports-service";
import { PDFGenerator, formatCurrency } from "@/lib/utils/pdf-generator";

export default function OwnerIncomeReportPage() {
  const user = useUserWithFullName();
  const [report, setReport] = useState<OwnerIncomeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !hasRole(user as User, "OWNER")) {
      window.location.href = "/dashboard";
      return;
    }

    fetchReport();
  }, [user]);

  const fetchReport = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const reportData = await ReportsService.getOwnerIncomeReport();
      setReport(reportData);
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
      pdf.addTitle("Reporte de Ingresos - Propietario");
      yPosition += 20;

      // Información del propietario
      const userName =
        user?.fullName || user?.email?.split("@")[0] || "Propietario";
      yPosition = pdf.addSubtitle(`Propietario: ${userName}`, yPosition);
      yPosition = pdf.addText(
        `Email: ${user?.email || "No disponible"}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Fecha de generación: ${new Date().toLocaleDateString("es-ES")}`,
        yPosition
      );
      yPosition = pdf.addSeparator(yPosition);

      // Resumen financiero
      yPosition = pdf.addSubtitle("Resumen Financiero", yPosition);
      yPosition = pdf.addText(
        `Total de ingresos: ${formatCurrency(report.totalIncome)}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Total de alquileres: ${report.totalRentals}`,
        yPosition
      );
      yPosition = pdf.addText(
        `Valor promedio por alquiler: ${formatCurrency(
          report.averageRentalValue
        )}`,
        yPosition
      );
      yPosition = pdf.addSeparator(yPosition);

      // Ingresos mensuales
      if (report.monthlyIncome.length > 0) {
        yPosition = pdf.addSubtitle(
          "Ingresos Mensuales (Últimos 12 meses)",
          yPosition
        );

        const headers = ["Mes", "Ingresos"];
        const rows = report.monthlyIncome.map((item) => [
          item.month,
          formatCurrency(item.income),
        ]);

        yPosition = pdf.addTable(headers, rows, yPosition);
        yPosition = pdf.addSeparator(yPosition);
      }

      // Top vehículos
      if (report.topVehicles.length > 0) {
        yPosition = pdf.addSubtitle("Vehículos Más Rentables", yPosition);

        const headers = ["Vehículo", "Alquileres", "Ingresos"];
        const rows = report.topVehicles.map((item) => [
          `${item.vehicle.make} ${item.vehicle.vehicleModel} (${item.vehicle.year})`,
          item.rentals.toString(),
          formatCurrency(item.income),
        ]);

        pdf.addTable(headers, rows, yPosition);
      }

      const userNameForFile = user?.fullName
        ? user.fullName.replace(/\s+/g, "-")
        : user?.email?.split("@")[0]?.replace(/\s+/g, "-") || "propietario";
      const filename = `reporte-ingresos-${userNameForFile}-${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.download(filename);
    } catch (error) {
      alert("Error al generar el PDF. Por favor, intenta nuevamente. " + error);
    } finally {
      setGenerating(false);
    }
  };

  if (!user || !hasRole(user as User, "OWNER")) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-secondary-900 mb-2">
          Acceso Restringido
        </h3>
        <p className="text-secondary-500">
          Solo los propietarios pueden acceder a este reporte.
        </p>
      </div>
    );
  }

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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
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
            Reporte de Ingresos
          </h1>
          <p className="text-secondary-600 mt-2">
            Análisis detallado de tus ingresos como propietario de vehículos
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

      {/* Resumen financiero */}
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Ingresos Totales
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(report.totalIncome)}
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
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-secondary-600">
                Promedio por Alquiler
              </p>
              <p className="text-2xl font-bold text-secondary-900">
                {formatCurrency(report.averageRentalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de ingresos mensuales */}
      <div className="floating-card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Ingresos Mensuales
          </h2>
          <p className="text-sm text-secondary-500 mt-1">Últimos 12 meses</p>
        </div>

        <div className="p-6">
          {report.monthlyIncome.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary-500">
                No hay datos de ingresos mensuales disponibles.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {report.monthlyIncome.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-secondary-700">
                      {item.month}
                    </span>
                    <span className="text-lg font-bold text-secondary-900">
                      {formatCurrency(item.income)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top vehículos por ingresos */}
      <div ref={reportRef} className="floating-card">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Vehículos Más Rentables
          </h2>
          <p className="text-sm text-secondary-500 mt-1">
            Top 5 por ingresos generados
          </p>
        </div>

        {report.topVehicles.length === 0 ? (
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-16h14a2 2 0 012 2v14a2 2 0 01-2 2M7 7h10m-10 4h10m-10 4h7"
                />
              </svg>
            </div>
            <p className="text-secondary-500">
              No hay datos de vehículos disponibles.
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
                    Ingresos Totales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Precio Diario
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {report.topVehicles.map((item, index) => (
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
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                      {item.rentals} alquiler{item.rentals !== 1 ? "es" : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                      {formatCurrency(item.income)}
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
