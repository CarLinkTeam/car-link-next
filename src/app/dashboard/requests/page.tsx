"use client";

import React, { useState, useMemo } from "react";
import { useOwnerRentals } from "@/hooks/useOwnerRentals";
import { FaFilter, FaSearch, FaChartBar } from "react-icons/fa";
import RentalRequestCard from "@/components/ui/RequestCard";

export default function OwnerRentalsPage() {
  const { rentals, isLoading, error , updateRentalStatus } = useOwnerRentals();

  const [filterStatus, setFilterStatus] = useState<
    "all" | "pending" | "confirmed" | "cancelled"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAccept = (id: string) => {
    updateRentalStatus(id, "confirmed");
  };

  const handleReject = (id: string) => {
    updateRentalStatus(id, "cancelled");
  };

  const filteredRentals = useMemo(() => {
    return rentals
      .filter((rental) => rental.status !== "completed")
      .filter((rental) => {
        const matchesStatus =
          filterStatus === "all" || rental.status === filterStatus;
        const matchesSearch =
          rental.vehicle?.make
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          rental.vehicle?.vehicleModel
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      });
  }, [rentals, filterStatus, searchTerm]);

  const getStatusCount = (status: string) =>
    rentals.filter((rental) => rental.status === status).length;

    if (isLoading && rentals.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-secondary-600">Cargando rentas...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error al cargar las solicitudes de renta</p>
          <p className="text-secondary-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <FaChartBar className="text-primary-600" />
        Solicitudes de Renta
      </h2>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold">
            {rentals.filter((r) => r.status !== "completed").length}
          </p>
          <p className="text-sm text-gray-500">Total</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">
            {getStatusCount("pending")}
          </p>
          <p className="text-sm text-gray-500">Pendientes</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {getStatusCount("confirmed")}
          </p>
          <p className="text-sm text-gray-500">Confirmadas</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-500">
            {getStatusCount("cancelled")}
          </p>
          <p className="text-sm text-gray-500">Canceladas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filter */}
        <div className="relative md:w-64">
          <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {filteredRentals.length === 0 ? (
        <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-secondary-600">No se encontraron solicitudes de renta</p>
        </div>
      </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map((rental) => (
            <RentalRequestCard
              key={rental.id}
              rental={rental}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
