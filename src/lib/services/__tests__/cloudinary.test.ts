import { CloudinaryService } from "../cloudinary";

describe("CloudinaryService", () => {
  describe("validateImageFile", () => {
    it("debe retornar null para archivos válidos", () => {
      const validFile = new File([""], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(validFile, "size", { value: 1024 * 1024 }); // 1MB

      const result = CloudinaryService.validateImageFile(validFile);
      expect(result).toBeNull();
    });

    it("debe retornar error para tipos de archivo no válidos", () => {
      const invalidFile = new File([""], "test.pdf", {
        type: "application/pdf",
      });

      const result = CloudinaryService.validateImageFile(invalidFile);
      expect(result).toBe("Solo se permiten archivos JPG, PNG y WebP");
    });

    it("debe retornar error para archivos demasiado grandes", () => {
      const largeFile = new File([""], "test.jpg", { type: "image/jpeg" });
      Object.defineProperty(largeFile, "size", { value: 11 * 1024 * 1024 }); // 11MB

      const result = CloudinaryService.validateImageFile(largeFile);
      expect(result).toBe("El archivo no puede ser mayor a 10MB");
    });

    it("debe aceptar diferentes tipos de imagen válidos", () => {
      const jpegFile = new File([""], "test.jpeg", { type: "image/jpeg" });
      const pngFile = new File([""], "test.png", { type: "image/png" });
      const webpFile = new File([""], "test.webp", { type: "image/webp" });
      const jpgFile = new File([""], "test.jpg", { type: "image/jpg" });

      Object.defineProperty(jpegFile, "size", { value: 1024 });
      Object.defineProperty(pngFile, "size", { value: 1024 });
      Object.defineProperty(webpFile, "size", { value: 1024 });
      Object.defineProperty(jpgFile, "size", { value: 1024 });

      expect(CloudinaryService.validateImageFile(jpegFile)).toBeNull();
      expect(CloudinaryService.validateImageFile(pngFile)).toBeNull();
      expect(CloudinaryService.validateImageFile(webpFile)).toBeNull();
      expect(CloudinaryService.validateImageFile(jpgFile)).toBeNull();
    });
  });

  describe("getUploadOptions", () => {
    it("debe retornar opciones de configuración válidas", () => {
      const options = CloudinaryService.getUploadOptions();

      expect(options).toEqual({
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        folder: "carlink/vehicles",
        maxFiles: 10,
        maxFileSize: 10000000,
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        cropping: false,
        multiple: true,
        resourceType: "image",
        sources: ["local", "url"],
        showAdvancedOptions: false,
      });
    });
  });

  describe("extractUrlsFromResults", () => {
    it("debe extraer URL de un solo archivo", () => {
      const mockResults = {
        info: {
          secure_url:
            "https://res.cloudinary.com/test/image/upload/v123/sample.jpg",
        },
      } as Record<string, unknown>;

      const urls = CloudinaryService.extractUrlsFromResults(mockResults);
      expect(urls).toEqual([
        "https://res.cloudinary.com/test/image/upload/v123/sample.jpg",
      ]);
    });

    it("debe extraer URLs de múltiples archivos", () => {
      const mockResults = {
        info: {
          files: [
            {
              uploadInfo: {
                secure_url:
                  "https://res.cloudinary.com/test/image/upload/v123/sample1.jpg",
              },
            },
            {
              uploadInfo: {
                secure_url:
                  "https://res.cloudinary.com/test/image/upload/v123/sample2.jpg",
              },
            },
          ],
        },
      } as Record<string, unknown>;

      const urls = CloudinaryService.extractUrlsFromResults(mockResults);
      expect(urls).toEqual([
        "https://res.cloudinary.com/test/image/upload/v123/sample1.jpg",
        "https://res.cloudinary.com/test/image/upload/v123/sample2.jpg",
      ]);
    });

    it("debe retornar array vacío para resultados inválidos", () => {
      const mockResults = {
        info: "string-info",
      } as Record<string, unknown>;

      const urls = CloudinaryService.extractUrlsFromResults(mockResults);
      expect(urls).toEqual([]);
    });

    it("debe filtrar archivos sin uploadInfo válido", () => {
      const mockResults = {
        info: {
          files: [
            {
              uploadInfo: {
                secure_url:
                  "https://res.cloudinary.com/test/image/upload/v123/sample1.jpg",
              },
            },
            {
              // Archivo sin uploadInfo válido
              otherData: "some data",
            },
          ],
        },
      } as Record<string, unknown>;

      const urls = CloudinaryService.extractUrlsFromResults(mockResults);
      expect(urls).toEqual([
        "https://res.cloudinary.com/test/image/upload/v123/sample1.jpg",
      ]);
    });
  });

  describe("validateCloudinaryUrls", () => {
    it("debe validar URLs de Cloudinary válidas", () => {
      const validUrls = [
        "https://res.cloudinary.com/test/image/upload/v123/sample.jpg",
        "https://res.cloudinary.com/another/video/upload/v456/video.mp4",
      ];

      const result = CloudinaryService.validateCloudinaryUrls(validUrls);
      expect(result).toBe(true);
    });

    it("debe rechazar URLs que no son de Cloudinary", () => {
      const invalidUrls = [
        "https://example.com/image.jpg",
        "https://res.cloudinary.com/test/image/upload/v123/sample.jpg",
      ];

      const result = CloudinaryService.validateCloudinaryUrls(invalidUrls);
      expect(result).toBe(false);
    });

    it("debe retornar true para array vacío", () => {
      const result = CloudinaryService.validateCloudinaryUrls([]);
      expect(result).toBe(true);
    });
  });
});
