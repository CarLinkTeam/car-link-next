'use client';

import EntityEditPage from "@/components/ui/admin/entityEditPage";
import UserForm from "@/components/ui/admin/UserForm";
import { UserService } from "@/lib/api/services/user-service";

export default function UserEditPage() {
    return (
        <EntityEditPage
            title="Usuario"
            getOne={UserService.getByIdUser}
            onUpdate={UserService.updatePartial}
            renderForm={(user, onSubmit, submitting) => (
                <UserForm user={user} onSubmit={onSubmit} submitting={submitting} />
            )}
        />
    );
}


