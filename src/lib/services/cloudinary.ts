import { CloudinaryUploadWidgetResults } from 'next-cloudinary'

interface UploadProgress {
  loaded: number
  total: number
  percentage: number
}

export class CloudinaryService {
  /**
   * Valida que el archivo sea una imagen válida
   */
  static validateImageFile(file: File): string | null {
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos JPG, PNG y WebP'
    }

    if (file.size > maxSize) {
      return 'El archivo no puede ser mayor a 10MB'
    }

    return null
  }

  /**
   * Configuración del widget de subida de next-cloudinary
   */
  static getUploadOptions() {
    return {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      folder: 'carlink/vehicles',
      maxFiles: 10,
      maxFileSize: 10000000, // 10MB
      clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
      cropping: false,
      multiple: true,
      resourceType: 'image' as const,
      sources: ['local' as const, 'url' as const],
      showAdvancedOptions: false,
    }
  }

  /**
   * Extrae URLs de los resultados del widget de Cloudinary
   */
  static extractUrlsFromResults(results: CloudinaryUploadWidgetResults): string[] {
    if (!results.info || typeof results.info === 'string') {
      return []
    }

    // Usar unknown temporalmente para evitar errores de tipo
    const info = results.info as unknown as Record<string, unknown>

    // Si es un solo archivo
    if (typeof info.secure_url === 'string') {
      return [info.secure_url]
    }

    // Si son múltiples archivos
    if (Array.isArray(info.files)) {
      return info.files
        .filter((file: unknown) => {
          const f = file as Record<string, unknown>
          return f.uploadInfo && typeof (f.uploadInfo as Record<string, unknown>).secure_url === 'string'
        })
        .map((file: unknown) => {
          const f = file as Record<string, unknown>
          return (f.uploadInfo as Record<string, unknown>).secure_url as string
        })
    }

    return []
  }

  /**
   * Valida las URLs de Cloudinary
   */
  static validateCloudinaryUrls(urls: string[]): boolean {
    const cloudinaryPattern = /^https:\/\/res\.cloudinary\.com\/.+/
    return urls.every((url) => cloudinaryPattern.test(url))
  }
}

// Re-exportar tipos útiles
export type { UploadProgress }
