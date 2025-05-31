"use client";

import { useState } from "react";
import { setupDevToken } from "@/lib/utils/auth";

export default function DevTokenSetter() {
  const [token, setToken] = useState("");

  const handleSetToken = () => {
    if (token.trim()) {
      setupDevToken(token);
    } else {
      alert("Por favor, ingrese un token válido");
    }
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-black/80 text-white rounded-lg z-50 shadow-lg">
      <h3 className="text-sm font-bold mb-2">Configuración de desarrollo</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ingrese token de autorización"
          className="px-2 py-1 text-sm text-white rounded-md"
        />
        <button
          onClick={handleSetToken}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-sm rounded-md"
        >
          Establecer
        </button>
      </div>
      <p className="text-xs mt-2 text-gray-300">
        Solo para desarrollo. El token se guardará en una cookie.
      </p>
    </div>
  );
}
