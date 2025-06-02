// app/admin/layout.tsx
'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { ReactNode } from "react";

const entities = ["users", "vehicles", "rentals"];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow mb-6">
        <div className="max-w-6xl mx-auto px-4 py-4 flex space-x-6">
          <span className="text-xl font-bold">Admin</span>
          {entities.map((entity) => (
            <Link
              key={entity}
              href={`/dashboard/admin/${entity}`}
              className={`text-lg capitalize hover:text-blue-600 ${
                pathname.includes(entity) ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              {entity}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4">
        {children}
      </main>
    </div>
  );
}
