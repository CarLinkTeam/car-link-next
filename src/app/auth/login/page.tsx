"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Limpiar errores cuando el usuario escriba
  const watchedFields = watch();
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [watchedFields, error, clearError]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      // AuthGuard se encarga automáticamente de la redirección
    } catch (err) {
      // El error se maneja en el store
      console.error("Login error:", err);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 btn-gradient rounded-2xl mb-3 animate-float shadow-lg">
          <svg
            className="w-7 h-7 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold gradient-text mb-1">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-secondary-700 font-medium">
          Inicia sesión en tu cuenta de CarLink
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 animate-fade-in">
          <Alert type="error" message={error} onClose={clearError} />
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email")}
          type="email"
          label="Correo electrónico"
          placeholder="tu@ejemplo.com"
          error={errors.email?.message}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
              />
            </svg>
          }
        />

        <Input
          {...register("password")}
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          error={errors.password?.message}
          icon={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        {/* Login Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-6"
          isLoading={isLoading}
          disabled={!isValid || isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-4 p-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-secondary-200"></div>
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-sm text-secondary-600">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-primary-600 hover:text-primary-800 transition-colors"
        >
          Regístrate aquí
        </Link>
      </p>
    </>
  );
}
