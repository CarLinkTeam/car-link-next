import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

class ApiClient {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }
  private setupInterceptors() {
    // Interceptor para inyectar token
    this.instance.interceptors.request.use((config) => {
      // Intentar obtener el token del localStorage (donde Zustand lo persiste)
      let token = null
      try {
        const authStore = localStorage.getItem('auth-store')
        if (authStore) {
          const parsedStore = JSON.parse(authStore)
          token = parsedStore.state?.token || parsedStore.token
        }
      } catch (error) {
        console.warn('Error accessing auth store:', error)
      }

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Interceptor para manejar errores
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Extraer mensaje específico del backend
          let userMessage = this.extractErrorMessage(error.response.data) || 'Ha ocurrido un error'

          // Sobreescribir mensajes para casos específicos más amigables
          userMessage = this.getCustomErrorMessage(error.response.status, error.config?.url, userMessage) || userMessage

          // Crear un nuevo error con el mensaje del backend o personalizado
          const userError = new Error(userMessage)
          userError.name = 'ApiError'
          return Promise.reject(userError)
        }

        // Error de red o timeout
        if (error.code === 'ECONNABORTED') {
          return Promise.reject(new Error('La solicitud tardó demasiado. Verifica tu conexión.'))
        }

        return Promise.reject(new Error('Error de conexión. Verifica tu red e intenta nuevamente.'))
      }
    )
  }

  /**
   * Extrae el mensaje de error específico del backend
   */
  private extractErrorMessage(responseData: unknown): string | null {
    if (!responseData || typeof responseData !== 'object') return null

    const errorData = responseData as {
      message?: string | string[]
      error?: string
      detail?: string
    }

    if (errorData.message) {
      // Si es un array de mensajes (validación), tomar el primero
      if (Array.isArray(errorData.message)) {
        return errorData.message[0]
      }
      // Si es un string, usarlo directamente
      if (typeof errorData.message === 'string') {
        return errorData.message
      }
    }

    // Otros formatos posibles
    if (errorData.error && typeof errorData.error === 'string') {
      return errorData.error
    }

    if (errorData.detail && typeof errorData.detail === 'string') {
      return errorData.detail
    }

    return null
  }

  /**
   * Personaliza mensajes para casos específicos donde necesitamos mayor claridad
   */
  private getCustomErrorMessage(status: number, url?: string, originalMessage?: string): string | null {
    // Register - Email ya en uso (error 400 con email duplicado)
    if (status === 400 && url?.includes('/auth/register')) {
      if (originalMessage?.toLowerCase().includes('email') || originalMessage?.toLowerCase().includes('duplicate')) {
        return 'Este email ya está registrado. Intenta con otro email diferente.'
      }
    }

    // Login - Credenciales inválidas (error 401)
    if (status === 401 && url?.includes('/auth/login')) {
      return 'Email o contraseña incorrectos. Verifica tus datos e intenta nuevamente.'
    }

    // Vehicle - Placa duplicada (error 400)
    if (status === 400 && url?.includes('/vehicles') && originalMessage?.toLowerCase().includes('license plate')) {
      return 'Ya existe un vehículo registrado con esta placa. Verifica el número de placa.'
    }

    // Errores de BD convertidos en 502 (Bad Gateway)
    if (status === 502 && originalMessage?.toLowerCase().includes('duplicate')) {
      return 'Ya existe un registro con estos datos. Verifica la información e intenta nuevamente.'
    }

    return null // No personalizar, usar mensaje original del backend
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.get<T>(url, config)
    return response.data
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.post<T>(url, data, config)
    return response.data
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.put<T>(url, data, config)
    return response.data
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.patch<T>(url, data, config)
    return response.data
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.instance.delete<T>(url, config)
    return response.data
  }
}

export const apiClient = new ApiClient()
