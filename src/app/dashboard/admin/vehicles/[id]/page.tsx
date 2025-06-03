'use client';

import { DetailItem } from "@/components/ui/admin/DetailItemPage";
import EntityDetailPage from "@/components/ui/admin/entityDetailPage";
import { VehicleService } from "@/lib/api/services/vehicle-service";
import { formatPrice } from "@/lib/utils/utils";


export default function UserDetailPage() {
    return (
        <EntityDetailPage
            title="Vehículo"
            getOne={VehicleService.getById}
            onDelete={VehicleService.delete}
            getEditPath={(id) => `/vehicles/${id}/edit`}
            renderDetails={(vehicle) => (
                <>
                    <DetailItem label="ID" value={vehicle.id} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem label="Modelo" value={vehicle.vehicleModel} />
                        <DetailItem label="Marca" value={vehicle.make} />
                        <DetailItem label="Color" value={vehicle.color} />
                        <DetailItem label="Año" value={vehicle.year.toString()} />
                        <DetailItem label="Placa" value={vehicle.license_plate} />
                        <DetailItem label="Precio diario" value={formatPrice(vehicle.daily_price)} />
                        <DetailItem label="Condiciones de renta" value={vehicle.rental_conditions || '—'} />
                        <DetailItem label="Clase" value={vehicle.class || '—'} />
                        <DetailItem label="Transmisión" value={vehicle.transmission || '—'} />
                        <DetailItem label="Tipo de combustible" value={vehicle.fuel_type || '—'} />
                        <DetailItem label="Tracción" value={vehicle.drive || '—'} />
                        <DetailItem label="Propietario" value={vehicle.owner.fullName} />
                         <DetailItem
                            label="Registrado el"
                            value={
                                vehicle.created_at
                                    ? new Date(vehicle.created_at).toLocaleDateString()
                                    : 'No disponible'
                            }
                        />
                        <DetailItem
                            label="Última actualización"
                            value={
                                vehicle.updated_at
                                    ? new Date(vehicle.updated_at).toLocaleDateString()
                                    : 'No disponible'
                            }
                        />
                    </div>

                    {/* Fotos */}
                    {vehicle.url_photos.length > 0 && (
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {vehicle.url_photos.map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt={`Foto ${idx + 1} de ${vehicle.vehicleModel}`}
                                    className="rounded-lg object-cover w-full h-32"
                                />
                            ))}
                        </div>
                    )}
                </>
            )}


        />
    );
}


