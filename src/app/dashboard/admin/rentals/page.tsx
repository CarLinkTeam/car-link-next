'use client';
import EntityListPage from '@/components/ui/admin/entityListPage';
import { RentalService } from '@/lib/api/services/rental-service';
import { formatDate } from '@/lib/utils/utils';

export default function RentalsPage() {
    return (
        <EntityListPage
            title="Alquileres"
            entityName="rentals"
            getAll={RentalService.getAll}
            getId={rental => rental.id.toString()}
            renderItem={rentals => <div> <span>{rentals.id}</span> <br /> <span>{formatDate(rentals.initialDate)} - {formatDate(rentals.finalDate)}</span></div>}
            filterFn={rentals => `${rentals.id} ${rentals.initialDate} ${rentals.finalDate}`}
        />
    );
}