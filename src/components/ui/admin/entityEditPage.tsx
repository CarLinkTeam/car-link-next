'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../Button";

interface EntityEditPageProps<T> {
  title: string;
  getOne: (id: string) => Promise<T | null>;
  onUpdate: (id: string, data: Partial<T>) => Promise<T>;
  renderForm: (item: T, onSubmit: (values: Partial<T>) => void, submitting: boolean) => React.ReactNode;
}

export default function EntityEditPage<T>({
  title,
  getOne,
  onUpdate,
  renderForm,
}: EntityEditPageProps<T>) {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    getOne(id)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [id, getOne]);

  const handleSubmit = async (updated: Partial<T>) => {
    if (!id || typeof id !== "string") return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await onUpdate(id, updated);

      console.log(response); router.back();
    } catch (err) {
      setError("Error al guardar los cambios.");
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 relative">
      <div className="text-left mb-6">
        <Button onClick={() => router.back()} variant="ghost">
          ← Regresar
        </Button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold capitalize gradient-text">
          Editar {title}
        </h1>
        <p className="text-secondary-600 mt-2 max-w-lg mx-auto">
          Modifica los campos del {(title || "elemento").toLowerCase()}.
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
          {renderForm(data, handleSubmit, submitting)}
          {error && (
            <p className="text-red-600 font-semibold text-center">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
