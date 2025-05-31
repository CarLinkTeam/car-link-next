import { getVehicles } from "@/lib/api/vehicles";
import { Vehicle } from "@/lib/types";
import DevTokenSetter from "./components/ui/DevTokenSetter";

// Indicamos que esta es una página con renderizado dinámico para que
// Next.js la refresque en cada solicitud
export const dynamic = "force-dynamic";

export default async function Home() {
  // Obtener los vehículos desde la API
  const vehicles: Vehicle[] = await getVehicles();

  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-center">
          Car Link - Vehículos Disponibles
        </h1>

        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Nota:</strong> Esta es una vista en texto plano de los datos
            para desarrollo.
          </p>

          {/* Si no hay vehículos, mostrar un mensaje */}
          {vehicles.length === 0 ? (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
              No hay vehículos disponibles o hubo un error al cargar los datos.
            </div>
          ) : (
            // Mostrar los vehículos en formato pre para mantener el formato JSON
            <pre className="bg-white p-4 rounded overflow-auto max-h-[70vh] text-sm">
              {JSON.stringify(vehicles, null, 2)}
            </pre>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Esta es una página de desarrollo para mostrar los datos de vehículos
            desde la API.
          </p>
        </div>
      </main>

      {/* Componente para establecer el token de autorización durante el desarrollo */}
      <DevTokenSetter />
    </div>
  );
}
