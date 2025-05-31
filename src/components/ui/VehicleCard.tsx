import Image from "next/image";
import { Vehicle } from "@/lib/types/entities/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  // Format price to show in Colombian pesos
  const formatPrice = (price: string) => {
    const numPrice = parseFloat(price);
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {" "}
      {/* Vehicle Image */}
      <div className="relative h-48 w-full">
        <Image
          src="/placeholder-car.svg"
          alt={`${vehicle.make} ${vehicle.vehicleModel}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Vehicle class badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-md text-xs font-medium">
            {vehicle.class}
          </span>
        </div>
      </div>
      {/* Vehicle Info */}
      <div className="p-4">
        {/* Make and Model */}
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {vehicle.vehicleModel}
          </h3>
          <p className="text-sm text-gray-600">
            {vehicle.make} • {vehicle.year}
          </p>
        </div>

        {/* Vehicle details */}
        <div className="mb-3">
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span className="mr-2">🎨</span>
            <span>{vehicle.color}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <span className="mr-2">⛽</span>
            <span>{vehicle.fuel_type}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">⚙️</span>
            <span>{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(vehicle.daily_price)}
            </p>
            <p className="text-sm text-gray-500">por día</p>
          </div>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
            Ver detalles
          </button>
        </div>

        {/* Owner info */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>{vehicle.owner.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
