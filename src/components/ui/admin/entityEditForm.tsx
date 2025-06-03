"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const editableFieldsByEntity: Record<string, string[]> = {
  users: ["fullName", "location", "phone"],
  vehicles: ["vehicleModel", "make", "color", "license_plate"],
  rentals: ["vehicle_id"],
};

interface EntityEditFormProps {
  entity: string;
  item: Record<string, any>;
  onSave: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
}

export default function EntityEditForm({
  entity,
  item,
  onSave,
  onCancel,
}: EntityEditFormProps) {
  const [formData, setFormData] = useState({ ...item });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editableFields = editableFieldsByEntity[entity] || [];

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([key]) => editableFields.includes(key))
      );
      await onSave(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.name : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(formData).map(([key, value]) => {
        if (!editableFields.includes(key)) return null;

        return (
          <div key={key}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {key}
            </label>
            <input
              type="text"
              value={value ?? ""}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2 border rounded shadow-sm"
            />
          </div>
        );
      })}

      {error && <p className="text-red-600">{error}</p>}

      <div className="flex gap-4 mt-6">
        <Button onClick={handleSubmit} disabled={isSaving} variant="primary">
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
