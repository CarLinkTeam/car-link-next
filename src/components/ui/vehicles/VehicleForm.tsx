"use client";

import React, { useState, useEffect } from "react";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget } from "next-cloudinary";
import type { CloudinaryUploadWidgetResults } from "next-cloudinary";
import {
  createVehicleSchema,
  editVehicleSchema,
  CreateVehicleFormData,
  EditVehicleFormData,
} from "@/lib/validations/vehicle";
import { useCreateVehicle } from "@/hooks/vehicles/useCreateVehicle";
import { useUpdateVehicle } from "@/hooks/vehicles/useUpdateVehicle";
import { CloudinaryService } from "@/lib/services/cloudinary";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Vehicle } from "@/lib/types/entities/vehicle";
import Image from "next/image";

interface VehicleFormProps {
  mode: "create" | "edit";
  vehicle?: Vehicle;
  onSuccess: () => void;
  onCancel: () => void;
}

type FormData = CreateVehicleFormData | EditVehicleFormData;

export const VehicleForm: React.FC<VehicleFormProps> = ({
  mode,
  vehicle,
  onSuccess,
  onCancel,
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    createVehicle,
    isLoading: isCreating,
    error: createError,
    success: createSuccess,
    clearMessages: clearCreateMessages,
  } = useCreateVehicle();
  const {
    updateVehicle,
    isLoading: isUpdating,
    error: updateError,
    success: updateSuccess,
    clearMessages: clearUpdateMessages,
  } = useUpdateVehicle();

  const isLoading = isCreating || isUpdating;
  const error = createError || updateError;
  const success = createSuccess || updateSuccess;
  const clearMessages = () => {
    clearCreateMessages();
    clearUpdateMessages();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(
      mode === "edit" ? editVehicleSchema : createVehicleSchema
    ),
    defaultValues:
      mode === "edit" && vehicle
        ? {
            vehicleModel: vehicle.vehicleModel,
            make: vehicle.make,
            color: vehicle.color,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
            daily_price: vehicle.daily_price,
            rental_conditions: vehicle.rental_conditions,
            url_photos: vehicle.url_photos,
            // Campos opcionales para edición
            class: vehicle.class || "",
            drive: vehicle.drive || "",
            fuel_type: vehicle.fuel_type || "",
            transmission: vehicle.transmission || "",
          }
        : {
            vehicleModel: "",
            make: "",
            color: "",
            year: new Date().getFullYear(),
            license_plate: "",
            daily_price: 0,
            rental_conditions: "",
            url_photos: [],
          },
  });

  // Tipos específicos para errores de campos opcionales
  const editErrors = errors as FieldErrors<EditVehicleFormData>;

  // Inicializar imágenes si estamos editando
  useEffect(() => {
    if (mode === "edit" && vehicle?.url_photos) {
      setUploadedImages(vehicle.url_photos);
    }
  }, [mode, vehicle]);

  // Manejar resultado de subida exitosa
  const handleUploadSuccess = (results: CloudinaryUploadWidgetResults) => {
    const urls = CloudinaryService.extractUrlsFromResults(results);
    if (urls.length > 0) {
      const newImages = [...uploadedImages, ...urls];
      setUploadedImages(newImages);
      setValue("url_photos", newImages);
    }
    setIsUploading(false);
  };

  const handleUploadError = () => {
    setIsUploading(false);
  };

  // Eliminar imagen subida
  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    setValue("url_photos", newImages);
  };

  // Enviar formulario
  const onSubmit = async (data: FormData) => {
    try {
      const vehicleData = {
        ...data,
        url_photos: uploadedImages,
      };

      let success = false;
      if (mode === "create") {
        const result = await createVehicle(
          vehicleData as CreateVehicleFormData
        );
        success = result !== null;
      } else if (mode === "edit" && vehicle) {
        success = await updateVehicle(
          vehicle.id,
          vehicleData as EditVehicleFormData
        );
      }

      if (success) {
        onSuccess();
      }
    } catch (error) {
      alert("Error saving vehicle:" + error);
    }
  };

  const handleCancel = () => {
    reset();
    setUploadedImages([]);
    clearMessages();
    onCancel();
  };

  return (
    <div className="glass rounded-4xl p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">
          {mode === "create" ? "Agregar Nuevo Vehículo" : "Editar Vehículo"}
        </h2>
        <button
          onClick={handleCancel}
          className="p-2 hover:bg-secondary-100 rounded-xl transition-colors"
          disabled={isLoading}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Alerts */}
        {error && (
          <Alert
            type="error"
            title={
              error.toLowerCase().includes("placa") ||
              error.toLowerCase().includes("license plate")
                ? "Placa duplicada"
                : "Error"
            }
            message={error}
            onClose={clearMessages}
          />
        )}

        {success && (
          <Alert
            type="success"
            title={
              mode === "create"
                ? "¡Vehículo creado exitosamente!"
                : "¡Vehículo actualizado exitosamente!"
            }
            message={
              mode === "create"
                ? "Tu vehículo ha sido registrado y está disponible para renta."
                : "Los cambios se han guardado correctamente."
            }
            onClose={clearMessages}
          />
        )}

        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Modelo del Vehículo *
            </label>
            <input
              {...register("vehicleModel")}
              type="text"
              className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
              placeholder="Ej: Corolla, Civic, Sentra"
            />
            {errors.vehicleModel && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vehicleModel.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Marca *
            </label>
            <input
              {...register("make")}
              type="text"
              className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
              placeholder="Ej: Toyota, Honda, Nissan"
            />
            {errors.make && (
              <p className="text-red-500 text-sm mt-1">{errors.make.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Color *
            </label>
            <input
              {...register("color")}
              type="text"
              className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
              placeholder="Ej: Blanco, Negro, Azul"
            />
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">
                {errors.color.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Año *
            </label>
            <input
              {...register("year", { valueAsNumber: true })}
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
              placeholder="2020"
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Placa *
            </label>
            <input
              {...register("license_plate")}
              type="text"
              className={`glass w-full rounded-xl p-3 border transition-colors ${
                error &&
                (error.toLowerCase().includes("placa") ||
                  error.toLowerCase().includes("license plate"))
                  ? "border-red-400 focus:border-red-500 bg-red-50"
                  : "border-secondary-200 focus:border-primary-400"
              } focus:outline-none`}
              placeholder="ABC123"
              style={{ textTransform: "uppercase" }}
            />
            {errors.license_plate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.license_plate.message}
              </p>
            )}
            {error &&
              (error.toLowerCase().includes("placa") ||
                error.toLowerCase().includes("license plate")) && (
                <p className="text-red-500 text-sm mt-1">
                  ⚠️ Esta placa ya está registrada en el sistema
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Precio por Día (COP) *
            </label>
            <input
              {...register("daily_price", { valueAsNumber: true })}
              type="number"
              min="1"
              className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
              placeholder="150000"
            />
            {errors.daily_price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.daily_price.message}
              </p>
            )}
          </div>
        </div>

        {/* Campos adicionales para edición */}
        {mode === "edit" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Clase
              </label>
              <input
                {...register("class")}
                type="text"
                className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
                placeholder="Ej: Sedán, SUV, Hatchback"
              />
              {mode === "edit" && editErrors.class && (
                <p className="text-red-500 text-sm mt-1">
                  {editErrors.class.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tracción
              </label>
              <input
                {...register("drive")}
                type="text"
                className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
                placeholder="Ej: FWD, AWD, RWD"
              />
              {mode === "edit" && editErrors.drive && (
                <p className="text-red-500 text-sm mt-1">
                  {editErrors.drive.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tipo de Combustible
              </label>
              <input
                {...register("fuel_type")}
                type="text"
                className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
                placeholder="Ej: Gasolina, Diésel, Híbrido"
              />
              {mode === "edit" && editErrors.fuel_type && (
                <p className="text-red-500 text-sm mt-1">
                  {editErrors.fuel_type.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Transmisión
              </label>
              <input
                {...register("transmission")}
                type="text"
                className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors"
                placeholder="Ej: Manual, Automática, CVT"
              />
              {mode === "edit" && editErrors.transmission && (
                <p className="text-red-500 text-sm mt-1">
                  {editErrors.transmission.message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Condiciones de renta */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Condiciones de Renta *
          </label>
          <textarea
            {...register("rental_conditions")}
            rows={4}
            className="glass w-full rounded-xl p-3 border border-secondary-200 focus:border-primary-400 focus:outline-none transition-colors resize-none"
            placeholder="Describe las condiciones, requisitos y reglas para rentar tu vehículo..."
          />
          {errors.rental_conditions && (
            <p className="text-red-500 text-sm mt-1">
              {errors.rental_conditions.message}
            </p>
          )}
        </div>

        {/* Subida de fotos */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Fotos del Vehículo * (Máximo 10 fotos)
          </label>

          <div className="space-y-4">
            {/* Widget de subida */}
            <CldUploadWidget
              options={CloudinaryService.getUploadOptions()}
              onSuccess={handleUploadSuccess}
              onError={handleUploadError}
              onOpen={() => setIsUploading(true)}
              onClose={() => setIsUploading(false)}
            >
              {({ open }) => (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => open()}
                  disabled={isUploading || uploadedImages.length >= 10}
                  className="w-full"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  {isUploading
                    ? "Subiendo..."
                    : "Seleccionar Fotos del Vehículo"}
                </Button>
              )}
            </CldUploadWidget>

            <div className="flex items-center justify-between text-sm text-secondary-600">
              <span>{uploadedImages.length}/10 fotos subidas</span>
              {uploadedImages.length > 0 && (
                <span className="text-green-600">✓ Listo para continuar</span>
              )}
            </div>

            {/* Preview de imágenes subidas */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={url}
                      alt={`Vehículo ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded-lg border border-secondary-200"
                      unoptimized={true}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.url_photos && (
              <p className="text-red-500 text-sm">
                {errors.url_photos.message}
              </p>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-6 border-t border-secondary-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading || uploadedImages.length === 0}
            className="flex-1 btn-gradient"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {mode === "create" ? "Creando..." : "Actualizando..."}
              </>
            ) : mode === "create" ? (
              "Crear Vehículo"
            ) : (
              "Actualizar Vehículo"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
