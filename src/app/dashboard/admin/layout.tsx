'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ReactNode } from "react";

const entities = ["users", "vehicles", "rentals"];

const entityLabels: Record<string, string> = {
  users: "Usuarios",
  vehicles: "Vehículos",
  rentals: "Alquileres",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md mb-8 border-b border-primary-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">Panel Admin</span>
          <div className="flex gap-6">
            {entities.map((entity) => (
              <Link
                key={entity}
                href={`/dashboard/admin/${entity}`}
                className={`text-lg capitalize transition-colors duration-200 hover:text-primary-600 ${
                  pathname.includes(entity)
                    ? "text-primary-600 font-semibold"
                    : "text-secondary-600"
                }`}
              >
                {entityLabels[entity]}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-12">
        {children}
      </main>
    </div>
  );
}
