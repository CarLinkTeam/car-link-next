import { useState, useEffect } from "react";

type ModalState = "closed" | "create" | "edit";

export function useEntity<T>(endpoint: string) {
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>("closed");

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}`);
      const data = await res.json();
      setItems(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar datos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  return {
    items,
    isLoading,
    error,
    refresh: fetchItems,
    modalState,
    openCreateModal: () => setModalState("create"),
    closeModal: () => setModalState("closed"),
  };
}
