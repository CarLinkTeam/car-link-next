'use client';

import { DetailItem } from "@/components/ui/admin/DetailItemPage";
import EntityDetailPage from "@/components/ui/admin/entityDetailPage";
import { RentalService } from "@/lib/api/services/rental-service";
import { formatPrice } from "@/lib/utils/utils";


export default function UserDetailPage() {
    return (
        <EntityDetailPage
            title="Alquiler"
            getOne={RentalService.getById}
            onDelete={RentalService.delete}
            getEditPath={(id) => `/vehicles/${id}/edit`}
            deleteOption={false}
            editOption={false}
            renderDetails={(rental) => (
                <>
                    <DetailItem label="ID" value={rental.id} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Información básica de la renta */}
                        <DetailItem label="Fecha inicio" value={new Date(rental.initialDate).toLocaleDateString()} />
                        <DetailItem label="Fecha fin" value={new Date(rental.finalDate).toLocaleDateString()} />
                        <DetailItem label="Estado" value={rental.status.charAt(0).toUpperCase() + rental.status.slice(1)} />
                        <DetailItem label="Costo total" value={formatPrice(Number(rental.totalCost))} />

                        {/* Información del vehículo */}
                        <DetailItem label="Vehículo" value={`${rental.vehicle.make} ${rental.vehicle.vehicleModel}`} />
                        <DetailItem label="Color" value={rental.vehicle.color} />
                        <DetailItem label="Año" value={rental.vehicle.year.toString()} />
                        <DetailItem label="Placa" value={rental.vehicle.license_plate} />

                        
                        {/* Información del cliente (quien alquila) */}
                        <DetailItem label="Cliente" value={rental.client.fullName} />
                        <DetailItem label="Email cliente" value={rental.client.email} />
                        <DetailItem label="Teléfono cliente" value={rental.client.phone || '—'} />
                        <DetailItem label="Ubicación cliente" value={rental.client.location || '—'} />
                    </div>
                </>
            )}


        />
    );
}


