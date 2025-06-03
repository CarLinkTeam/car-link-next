'use client';
import EntityListPage from '@/components/ui/admin/entityListPage';
import { UserService } from '@/lib/api/services/user-service';
import { User } from '@/lib/types/entities/user';

export default function UsersPage() {
    return (
        <EntityListPage
            title="Usuarios"
            entityName="users"
            getAll={UserService.getAll}
            getId={user => user.id.toString()}
            renderItem={user => <span>{user.fullName} - {user.email}</span>}
            filterFn={user => `${user.fullName} ${user.email}`}
        />
    );
}