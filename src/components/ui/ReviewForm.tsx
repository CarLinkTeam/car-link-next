"use client";

import { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { Rental, CreateReviewData } from "@/lib/types/entities/rental";

interface ReviewFormProps {
  rental: Rental;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewData) => Promise<void>;
  isLoading: boolean;
}

export default function ReviewForm({
  rental,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }

    const reviewData: CreateReviewData = {
      rental_id: rental.id,
      rating,
      comment: comment.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    try {
      await onSubmit(reviewData);
      // Resetear formulario
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      alert("Error al crear review:" + error);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-4xl max-w-md w-full mx-auto border-2 border-primary-200 shadow-glow-lg animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-primary-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold gradient-text">Calificar Renta</h2>
            <button
              onClick={handleClose}
              className="text-secondary-500 hover:text-primary-600 transition-colors p-1"
              disabled={isLoading}
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información del vehículo */}
          <div className="mb-6 p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <h3 className="font-bold text-primary-800 mb-1">
              {rental.vehicle.make} {rental.vehicle.vehicleModel}
            </h3>
            <p className="text-sm text-primary-600">
              {rental.vehicle.year} • {rental.vehicle.color}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sistema de estrellas */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Calificación *
              </label>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-3xl transition-all duration-200 transform hover:scale-110"
                    disabled={isLoading}
                  >
                    <FaStar
                      className={
                        star <= (hoveredRating || rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-secondary-600 mt-2">
                  {rating === 1 && "Muy malo"}
                  {rating === 2 && "Malo"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Bueno"}
                  {rating === 5 && "Excelente"}
                </p>
              )}
            </div>

            {/* Comentario */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Comentario (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia con este vehículo..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-colors resize-none"
                disabled={isLoading}
                maxLength={500}
              />
              <p className="text-xs text-secondary-500 mt-1">
                {comment.length}/500 caracteres
              </p>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 rounded-2xl border-2 border-secondary-300 text-secondary-700 font-medium hover:bg-secondary-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || rating === 0}
                className="flex-1 btn-gradient text-white px-6 py-3 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu disabled:opacity-50 disabled:transform-none"
              >
                {isLoading ? "Enviando..." : "Calificar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
