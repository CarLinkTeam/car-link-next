import { apiClient } from "../client";

describe("ApiClient", () => {
  it("debe estar definido y tener todos los métodos HTTP", () => {
    expect(apiClient).toBeDefined();
    expect(typeof apiClient.get).toBe("function");
    expect(typeof apiClient.post).toBe("function");
    expect(typeof apiClient.put).toBe("function");
    expect(typeof apiClient.patch).toBe("function");
    expect(typeof apiClient.delete).toBe("function");
  });

  it("debe tener todos los métodos HTTP requeridos", () => {
    const methods = ["get", "post", "put", "patch", "delete"];

    methods.forEach((method) => {
      expect(apiClient).toHaveProperty(method);
      expect(typeof apiClient[method as keyof typeof apiClient]).toBe(
        "function"
      );
    });
  });

  it("debe poder acceder a métodos sin errores", () => {
    expect(() => {
      const getMethod = apiClient.get;
      const postMethod = apiClient.post;
      const putMethod = apiClient.put;
      const patchMethod = apiClient.patch;
      const deleteMethod = apiClient.delete;

      expect(getMethod).toBeDefined();
      expect(postMethod).toBeDefined();
      expect(putMethod).toBeDefined();
      expect(patchMethod).toBeDefined();
      expect(deleteMethod).toBeDefined();
    }).not.toThrow();
  });
});
