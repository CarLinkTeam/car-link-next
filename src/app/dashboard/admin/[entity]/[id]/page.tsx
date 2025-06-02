'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { UserService, VehicleService, RentalService } from "@/lib/api/services/genericEntities-service";
import EntityEditForm from "@/components/ui/admin/entityEditForm";
import EntityDeleteForm from "@/components/ui/admin/entityDeleteForm";
import { rentalStatusLabels } from "@/lib/types/entities/rental";

const entityServices: Record<string, any> = {
  "users": new UserService(),
  "vehicles": new VehicleService(),
  "rentals": new RentalService(),
};

export default function EntityDetailPage() {
  const params = useParams();
  const entity = Array.isArray(params.entity) ? params.entity[0] : params.entity;
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const service = entityServices[entity as string];
  const [item, setItem] = useState<any | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!entity || !id) {
      setError("Entidad o ID no especificados");
      setLoading(false);
      return;
    }

    if (!service || !service.getById) {
      setError("Entidad no soportada");
      setLoading(false);
      return;
    }

    setLoading(true);
    service
      .getById(id)
      .then((data: any) => {
        setItem(data);
        setError(null);
      })
      .catch((e: any) => {
        setError("Error cargando datos");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [entity, id]);

  if (isLoading) return <p className="p-10 text-center">Cargando...</p>;
  if (error) return <p className="p-10 text-center text-red-600">{error}</p>;
  if (!item) return <p className="p-10 text-center">Elemento no encontrado</p>;

  const renderDetail = () => {
    switch (entity) {
      case "users":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">{item.fullName}</h2>
            <p><strong>Email:</strong> {item.email}</p>
            <p><strong>Ubicación:</strong> {item.location}</p>
            <p><strong>Teléfono:</strong> {item.phone}</p>
            <p><strong>Roles:</strong> {item.roles?.join(", ")}</p>
            <p><strong>Activo:</strong> {item.isActive ? "Sí" : "No"}</p>
          </>
        );

      case "vehicles":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">{item.make} {item.vehicleModel}</h2>
            <p><strong>Año:</strong> {item.year}</p>
            <p><strong>Color:</strong> {item.color}</p>
            <p><strong>Placa:</strong> {item.license_plate}</p>
            <p><strong>Precio diario:</strong> ${item.daily_price}</p>
            <p><strong>Condiciones de renta:</strong> {item.rental_conditions}</p>
            <p><strong>Clase:</strong> {item.class}</p>
            <p><strong>Tracción:</strong> {item.drive}</p>
            <p><strong>Combustible:</strong> {item.fuel_type}</p>
            <p><strong>Transmisión:</strong> {item.transmission}</p>
            <p><strong>Propietario:</strong> {item.owner?.fullName}</p>
          </>
        );

      case "rentals":
        return (
          <>
          {console.log(item)}
            <h2 className="text-2xl font-bold mb-4">Renta de {item.vehicle?.vehicleModel}</h2>
            <p><strong>Fecha inicio:</strong> {new Date(item.initialDate).toLocaleDateString()}</p>
            <p><strong>Fecha fin:</strong> {new Date(item.finalDate).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> {rentalStatusLabels[item.status as keyof typeof rentalStatusLabels]}</p>
            <p><strong>Precio total:</strong> ${item.totalCost}</p>
            {item.notes && <p><strong>Notas:</strong> {item.notes}</p>}
            {item.cancellationReason && <p><strong>Motivo de cancelación:</strong> {item.cancellationReason}</p>}
          </>
        );

      default:
        return <p>No hay vista previa disponible para esta entidad.</p>;
    }

  };

  return ( 
    <div className="p-10">
      
      {editing ? (
        <EntityEditForm
          entity={entity as string}
          item={item}
          onSave={async (data) => {
            await service.updateById(id, data);
            setItem((prev: any) => ({ ...prev, ...data }));
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : deleting ? (
        <EntityDeleteForm
          onDelete={async () => {
            await service.deleteById(id);
            window.location.href = `/dashboard/admin/${entity}`;
          }}
          onCancel={() => setDeleting(false)}
        />
      ) : (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow">
          {renderDetail()}
          <div className="mt-8 flex gap-4">
            <Button onClick={() => setEditing(true)} variant="primary">Editar</Button>
            <Button onClick={() => setDeleting(true)} variant="destructive">Eliminar</Button>
          </div>
        </div>
      )}
    </div>
  );

}
