'use client';

import EntityListPage from "@/components/ui/admin/entityListPage";
import { UserService, VehicleService, RentalService } from "@/lib/api/services/genericEntities-service";
import { useParams } from "next/navigation";

const entityServices: Record<string, any> = {
  "users": new UserService(),
  "vehicles": new VehicleService(),
  "rentals": new RentalService(),
};

const renderers: Record<string, (item: any) => React.ReactNode> = {
  users: (user: any) => (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h2 className="text-lg font-bold">{user.fullName}</h2>
      <p>{user.email}</p>
    </div>
  ),
  vehicles: (vehicle: any) => (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h2 className="text-lg font-bold">{vehicle.license_plate}</h2>
      <p>{vehicle.vehicleModel} - {vehicle.year}</p>
    </div>
  ),
  rentals: (rental: any) => (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h2 className="text-lg font-bold">{rental.id}</h2>
      <p>{new Date(rental.initialDate).toLocaleDateString()} -{new Date(rental.finalDate).toLocaleDateString()}</p>
    </div>
  ),
};

const getIds: Record<string, (item: any) => string> = {
  users: (user: any) => user.id,
  vehicles: (user: any) => user.id,
  rentals: (rental: any) => rental.id,

};
export default function EntityAdminPage() {
  const params = useParams();

  const entity = Array.isArray(params.entity) ? params.entity[0] : params.entity;

  if (!entity) {
    return <div className="p-10 text-center text-red-600">Entidad no especificada</div>;
  }

  const service = entityServices[entity];
  const renderItem = renderers[entity];
  const getId = getIds[entity];

  if (!service || !renderItem || !getId) {
    return <div className="p-10 text-center text-red-600">Entidad no soportada</div>;
  }

  return (
    <EntityListPage
      entityName={entity}
      service = {service} 
      getId={getId}
      renderItem={renderItem}
    />
  );
}