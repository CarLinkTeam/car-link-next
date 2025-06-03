import { useState } from "react";
import { UserService, UpdateUserDto } from "@/lib/api/services/user-service";
import { useAuthStore } from "@/store/auth-store";

interface UseUpdateProfileReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  updateProfile: (data: UpdateUserDto) => Promise<boolean>;
  clearMessages: () => void;
}

export const useUpdateProfile = (): UseUpdateProfileReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user, updateUser } = useAuthStore();

  const updateProfile = async (data: UpdateUserDto): Promise<boolean> => {
    if (!user?.id) {
      setError("No se encontró información del usuario");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      setSuccess(false);

      const updatedUser = await UserService.update(user.id, data);

      // Actualizar el usuario en el store
      updateUser(updatedUser);
      setSuccess(true);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar el perfil";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    isLoading,
    error,
    success,
    updateProfile,
    clearMessages,
  };
};
