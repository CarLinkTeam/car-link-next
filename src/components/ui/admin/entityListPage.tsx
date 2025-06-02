"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { EntityService } from "@/lib/api/services/genericEntities-service";

interface EntityListPageProps<T> {
  entityName: string;
  service: EntityService<T>;
  renderItem: (item: T) => React.ReactNode;
  getId: (item: T) => string;
}

export default function EntityListPage<T>({
  entityName,
  service,
  renderItem,
  getId,
}: EntityListPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    service.getAll()
      .then((res) => {
        setData(res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [service]);

  const filteredData = useMemo(() => {
    if (!filter) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((item) => {
      const itemString = String(renderItem(item)?.toString()).toLowerCase();
      return itemString.includes(lowerFilter);
    });
  }, [filter, data, renderItem]);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 capitalize">{entityName} list</h1>

      {loading && <p>Cargando...</p>}

      <input
        type="text"
        placeholder={`Buscar ${entityName}...`}
        className="mb-4 w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <div className="relative">
        <ul className="max-h-96 overflow-auto border border-gray-300 rounded-md shadow-sm bg-white">
          {filteredData.length === 0 && (
            <li className="p-4 text-center text-gray-500">No se encontraron resultados</li>
          )}
          {filteredData.map((item) => (
            <li key={getId(item)} className="hover:bg-blue-100">
              <Link
                href={`${entityName}/${getId(item)}`}
                className="block p-3 cursor-pointer"
              >
                {renderItem(item)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
