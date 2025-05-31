// Utilidad para configurar el token de autenticación en las cookies
// Esto es temporal para el desarrollo, en producción se gestionaría de forma segura

export function setAuthToken(token: string): void {
  // Establece la cookie con el token
  // maxAge = 30 días en segundos (para desarrollo)
  document.cookie = `auth_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  // Recupera el token de la cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth_token") {
      return value;
    }
  }
  return null;
}

export function removeAuthToken(): void {
  // Elimina la cookie del token
  document.cookie =
    "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

// Función para usar en un componente cliente que necesite configurar el token manualmente
// Por ejemplo, se puede llamar desde un botón en la interfaz de usuario durante el desarrollo
export function setupDevToken(token: string): void {
  setAuthToken(token);
  alert("Token configurado correctamente");
}
