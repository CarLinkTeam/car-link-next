import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }
  private setupInterceptors() {
    // Interceptor para inyectar token
    this.instance.interceptors.request.use((config) => {
      // Intentar obtener el token del localStorage (donde Zustand lo persiste)
      let token = null;
      try {
        const authStore = localStorage.getItem("auth-store");
        if (authStore) {
          const parsedStore = JSON.parse(authStore);
          token = parsedStore.state?.token || parsedStore.token;
        }
      } catch (error) {
        console.warn("Error accessing auth store:", error);
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Puedes personalizar el manejo de errores aquí
          console.error(
            "API Error:",
            error.response.status,
            error.response.data
          );

          // Si es un error 401, limpiar la autenticación
          if (error.response.status === 401) {
            localStorage.removeItem("auth-store");
            // Opcional: redirigir al login
            if (typeof window !== "undefined") {
              window.location.href = "/auth/login";
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.put<T>(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config);
    return response.data;
  }
}

export const apiClient = new ApiClient();
