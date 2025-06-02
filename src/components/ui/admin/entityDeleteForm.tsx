'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface EntityDeleteFormProps {
  onDelete: () => Promise<void>;
  onCancel: () => void;
}

export default function EntityDeleteForm({
  onDelete,
  onCancel,
}: EntityDeleteFormProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onDelete();
    } catch (err) {
      setError('Error al eliminar el elemento.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <p className="mb-4 text-gray-700">
        ¿Estás seguro de este esta eliminación? Esta acción no se puede deshacer.
      </p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex justify-center gap-4">
        <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
