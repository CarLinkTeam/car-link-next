"use client";

import { useAuthStore } from '@/store/auth-store'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-secondary-800">Dashboard CarLink</h2>
            <p className="text-secondary-600 mt-1">Bienvenido de nuevo</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        {/* User Info */}
        {user && (
          <div className="bg-white rounded-xl border border-secondary-200 p-6 shadow-sm mb-8">
            <h3 className="text-xl font-semibold mb-4">Información del usuario</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Nombre:</strong> {user.fullName}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Ubicación:</strong> {user.location}
              </div>
              <div>
                <strong>Teléfono:</strong> {user.phone}
              </div>
            </div>
          </div>
        )}

        {/* Original Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-primary-200">
            <h3 className="font-semibold text-lg mb-2 text-primary-700">Your Vehicles</h3>
            <p className="text-secondary-600">Manage your vehicles and listings</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-accent-200">
            <h3 className="font-semibold text-lg mb-2 text-accent-700">Rental Requests</h3>
            <p className="text-secondary-600">View and manage rental requests</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow border border-secondary-200">
            <h3 className="font-semibold text-lg mb-2 text-secondary-700">Your Profile</h3>
            <p className="text-secondary-600">Update your profile information</p>
          </div>
        </div>
      </div>
    </div>
  );
}
