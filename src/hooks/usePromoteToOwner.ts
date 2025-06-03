import { useState } from "react";
import { AuthService } from "@/lib/api/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

interface UsePromoteToOwnerReturn {
  isLoading: boolean;
  error: string | null;
  promoteToOwner: () => Promise<boolean>;
}

export const usePromoteToOwner = (): UsePromoteToOwnerReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUser } = useAuthStore();

  const promoteToOwner = async (): Promise<boolean> => {
    if (!user?.id) {
      setError("No se encontró información del usuario");
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await AuthService.promoteToOwner(user.id);

      // Actualizar el usuario en el store con los nuevos roles
      updateUser(response.user);

      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al promover a OWNER";
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    promoteToOwner,
  };
};
