"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Vehicle } from "@/lib/types/entities/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Format price to show in Colombian pesos
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  // Effect to handle image cycling on hover
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isHovered && vehicle.url_photos.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % vehicle.url_photos.length
        );
      }, 800); // Change image every 800ms
    } else {
      setCurrentImageIndex(0); // Reset to first image when not hovered
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, vehicle.url_photos.length]);

  return (
    <div
      className="glass rounded-4xl overflow-hidden floating-card shadow-2xl border-2 border-primary-200 transition-all duration-500 hover:scale-105 hover:shadow-glow-lg transform-gpu cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vehicle Image */}
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src="/placeholder-car.svg"
          alt={`${vehicle.make} ${vehicle.vehicleModel} - Imagen ${
            currentImageIndex + 1
          }`}
          fill
          className="object-cover transition-all duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Vehicle class badge */}
        <div className="absolute top-4 left-4">
          <span className="btn-gradient text-white px-3 py-2 rounded-xl text-xs font-bold shadow-lg animate-float">
            {vehicle.class}
          </span>
        </div>

        {/* Image indicators */}
        {vehicle.url_photos.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {vehicle.url_photos.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Vehicle Info */}
      <div className="p-6">
        {/* Make and Model */}
        <div className="mb-4">
          <h3 className="text-xl font-bold gradient-text mb-1 group-hover:animate-glow transition-all duration-300">
            {vehicle.vehicleModel}
          </h3>
          <p className="text-sm text-secondary-600 font-medium">
            {vehicle.make} • {vehicle.year}
          </p>
        </div>

        {/* Vehicle details */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xs">🎨</span>
            </div>
            <span className="font-medium">{vehicle.color}</span>
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xs">⛽</span>
            </div>
            <span className="font-medium">{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xs">⚙️</span>
            </div>
            <span className="font-medium">{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-bold gradient-text">
              {formatPrice(vehicle.daily_price)}
            </p>
            <p className="text-sm text-secondary-500 font-medium">por día</p>
          </div>
          <button className="btn-gradient text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu">
            Ver detalles
          </button>
        </div>

        {/* Owner info */}
        <div className="pt-4 border-t-2 border-primary-100">
          <div className="flex items-center text-sm text-secondary-600">
            <div className="w-6 h-6 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white text-xs">📍</span>
            </div>
            <span className="font-medium">{vehicle.owner.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
