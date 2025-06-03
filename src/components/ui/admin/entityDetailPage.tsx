'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../Button";
import EntityDeleteForm from "./entityDeleteForm";

interface EntityDetailPageProps<T> {
  title: string;
  getOne: (id: string) => Promise<T | null>;
  renderDetails: (item: T) => React.ReactNode;
  onDelete: (id: string) => Promise<void>;
  deleteOption?: boolean;
  editOption?: boolean;
  getEditPath: (id: string) => string;
}

export default function EntityDetailPage<T>({
  title,
  getOne,
  renderDetails,
  onDelete,
  deleteOption = true,
  editOption = true,
  getEditPath,
}: EntityDetailPageProps<T>) {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    getOne(id)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [id, getOne]);

  const handleDelete = async (): Promise<boolean> => {
    if (!id || typeof id !== "string") return false;

    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete(id);
      router.back();
      return true;
    } catch (err) {
      setDeleteError("Error al eliminar.");
      setDeleting(false);
      return false;
    }
  };

  const handleEdit = () => {
    if (!id || typeof id !== "string") return;
    router.push(getEditPath(id));
  };

  return (



    <div className="max-w-4xl mx-auto py-12 px-6 relative">

      <div className="text-left mb-6">
        <Button onClick={() => router.back()} variant="ghost">
          ← Regresar al listado
        </Button>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold capitalize gradient-text">
          {title}
        </h1>
        <p className="text-secondary-600 mt-2 max-w-lg mx-auto">
          Detalles del {(title || "elemento").toLowerCase()} seleccionado.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      )}

      {!loading && !data && (
        <div className="text-center py-16 text-secondary-600">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold mb-2">
            No se encontró el {title}
          </h3>
          <p>Revisa la URL o intenta con otro ID.</p>
        </div>
      )}

      {!loading && data && (
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
          {renderDetails(data)}

          <div className="flex justify-end space-x-4">
            {editOption && (
            <Button onClick={handleEdit} variant="outline">
              Editar
            </Button>
            )}
            {deleteOption && (
            <Button onClick={() => setShowDeleteForm(true)} variant="destructive" disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </Button>
            )}
          </div>
        </div>
      )}

      {showDeleteForm && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative space-y-4">
            <EntityDeleteForm
              onDelete={async () => {
                const success = await handleDelete();
                if (success) {
                  setShowDeleteForm(false);
                }
              }}
              onCancel={() => setShowDeleteForm(false)}
            />
            {deleteError && (
              <p className="text-red-600 font-semibold text-center">
                {deleteError}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
