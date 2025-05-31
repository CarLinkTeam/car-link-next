import { Vehicle } from "@/lib/types";

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    // La API requiere autorización
    // Las cookies se envían automáticamente en las solicitudes al mismo dominio
    const response = await fetch("http://localhost:3000/api/vehicles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // No es necesario especificar el encabezado de cookie, el navegador lo hace automáticamente
        // La cookie auth_token se establecerá mediante el componente DevTokenSetter
      },
      // Importante para que Next.js no cache la respuesta
      cache: "no-store",
      // Necesario para incluir cookies en la solicitud
      credentials: "include",
    });

    if (!response.ok) {
      console.error(
        `Error en la solicitud: ${response.status} - ${response.statusText}`
      );
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    return [];
  }
}
