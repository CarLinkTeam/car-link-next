'use client';

import { DetailItem } from "@/components/ui/admin/DetailItemPage";
import EntityDetailPage from "@/components/ui/admin/entityDetailPage";
import { UserService } from "@/lib/api/services/user-service";

export default function UserDetailPage() {
    return (
        <EntityDetailPage
            title="Usuario"
            getOne={UserService.getById}
            onDelete={UserService.delete}
            getEditPath={(id) => `${id}/edit`}
            renderDetails={(user) => (
                <>
                    <DetailItem label="ID" value={user.id} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <DetailItem label="Nombre completo" value={user.fullName} />
                        <DetailItem label="Email" value={user.email} />
                        <DetailItem label="Teléfono" value={user.phone || '—'} />
                        <DetailItem label="Ubicación" value={user.location || '—'} />
                        <DetailItem
                            label="Rol"
                            value={user.roles.map((role) => role.charAt(0) + role.slice(1).toLowerCase()).join(', ')}
                        />
                        <DetailItem label="Estado" value={user.isActive ? 'Activo' : 'Inactivo'} />
                        <DetailItem
                            label="Registrado el"
                            value={
                                user.createdAt
                                    ? new Date(user.createdAt).toLocaleDateString()
                                    : 'No disponible'
                            }
                        />
                        <DetailItem
                            label="Última actualización"
                            value={
                                user.updatedAt
                                    ? new Date(user.updatedAt).toLocaleDateString()
                                    : 'No disponible'
                            }
                        />
                    </div>
                </>

            )}

        />
    );
}


