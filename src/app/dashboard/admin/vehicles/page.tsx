'use client';
import EntityListPage from '@/components/ui/admin/entityListPage';
import { VehicleService } from '@/lib/api/services/vehicle-service';

export default function VehiclesPage() {
    return (
        <EntityListPage
            title="Vehículos"
            entityName="vehicles"
            getAll={VehicleService.getAll}
            getId={vehicle => vehicle.id.toString()}
            renderItem={vehicle => <span>{vehicle.license_plate} - {vehicle.vehicleModel}</span>}
            filterFn={vehicle => `${vehicle.license_plate} ${vehicle.vehicleModel}`}
        />
    );
}