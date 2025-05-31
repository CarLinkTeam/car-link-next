import React from "react";
import { cn } from "@/lib/utils/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base classes
          "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          "active:scale-95",

          // Variantes usando los colores del config
          {
            // Primary - usando btn-gradient del config
            "btn-gradient text-white shadow-lg hover:shadow-xl focus:ring-primary-500":
              variant === "primary",

            // Secondary - usando colores secondary del config
            "bg-secondary-100 hover:bg-secondary-200 text-secondary-900 focus:ring-secondary-500 border border-secondary-200":
              variant === "secondary",

            // Outline - usando colores primary del config
            "border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500":
              variant === "outline",

            // Ghost - hover sutil
            "text-primary-600 hover:bg-primary-50 focus:ring-primary-500":
              variant === "ghost",

            // Destructive - usando colores primary pero más intensos
            "bg-primary-700 hover:bg-primary-800 text-white shadow-lg focus:ring-primary-500":
              variant === "destructive",
          },

          // Tamaños
          {
            "px-3 py-1.5 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },

          // Estados de loading
          {
            "cursor-wait": isLoading,
          },

          // Clases personalizadas (siempre al final)
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className={cn("animate-spin", {
              "h-4 w-4": size === "sm",
              "h-5 w-5": size === "md",
              "h-6 w-6": size === "lg",
            })}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <span className={cn({ "opacity-70": isLoading })}>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
