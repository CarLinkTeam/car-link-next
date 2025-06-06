"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { getInitials, hasRole } from "@/lib/utils/utils";
import { User } from "@/lib/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {" "}
      {/* Navigation Header */}
      <header className="glass border-b border-white/20 shadow-lg relative z-[1100]">
        <div className="mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/vehicles"
                className="w-10 h-10 btn-gradient rounded-xl flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold gradient-text">CarLink</h1>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-secondary-500">{user?.email}</p>
              </div>{" "}
              <div className="relative group z-[1200]">
                <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/50 transition-all duration-200 floating-card">
                  <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.fullName ? getInitials(user.fullName) : "U"}
                    </span>
                  </div>
                  <svg
                    className="w-4 h-4 text-secondary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1300] animate-fade-in">
                  <div className="p-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                    >
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Mi perfil
                    </Link>
                    <Link
                      href="/dashboard/vehicles"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                    >
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
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-4 0H3m2-16h14a2 2 0 012 2v14a2 2 0 01-2 2M7 7h10m-10 4h10m-10 4h7"
                        />
                      </svg>
                      Explorar vehículos
                    </Link>
                    <Link
                      href="/dashboard/rentals"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                    >
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
                          d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 5v6l6 6V7a2 2 0 00-2-2h-4z"
                        />
                      </svg>
                      Mis rentas
                    </Link>
                    {hasRole(user as User, "OWNER") && (
                      <Link
                        href="/dashboard/requests"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                      >
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
                            d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2H9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 5v6l6 6V7a2 2 0 00-2-2h-4z"
                          />
                        </svg>
                        Solicitudes (Mis autos)
                      </Link>
                    )}
                    {hasRole(user as User, "ADMIN") && (
                      <Link
                        href="/dashboard/admin"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                      >
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
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Panel de administración
                      </Link>
                    )}
                    {/* Reportes Section */}
                    <div className="px-3 py-2 text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                      Reportes
                    </div>
                    <Link
                      href="/dashboard/reports/rentals"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                    >
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Mis alquileres
                    </Link>
                    {hasRole(user as User, "OWNER") && (
                      <Link
                        href="/dashboard/reports/income"
                        className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                      >
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
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Ingresos (mis autos)
                      </Link>
                    )}
                    <Link
                      href="/dashboard/reports/popular-vehicles"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-secondary-700 hover:bg-white/50 rounded-lg transition-colors floating-card"
                    >
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Vehículos populares
                    </Link>
                    <div className="border-t border-secondary-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full text-left floating-card"
                    >
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="glass rounded-4xl p-6 min-h-[calc(100vh-200px)] relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
