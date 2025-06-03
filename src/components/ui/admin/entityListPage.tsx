'use client';

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

interface EntityListPageProps<T> {
  title: string;
  entityName: string;
  getAll: () => Promise<T[]>;
  renderItem: (item: T) => React.ReactNode;
  getId: (item: T) => string;
  filterFn?: (item: T) => string;
}

export default function EntityListPage<T>({
  title,
  entityName,
  getAll,
  renderItem,
  getId,
  filterFn,
}: EntityListPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getAll()
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [getAll]);

  const filteredData = useMemo(() => {
    if (!filter) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((item) => {
      const text = filterFn ? filterFn(item) : JSON.stringify(item);
      return text.toLowerCase().includes(lowerFilter);
    });
  }, [filter, data, filterFn]);

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold gradient-text capitalize">
          {title}
        </h1>
        <p className="text-secondary-600 mt-2 max-w-lg mx-auto">
          Explora y filtra los {title.toLowerCase()} disponibles.
        </p>
      </div>

      {/* Search input */}
      <div className="relative max-w-md mx-auto mb-8">
        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-secondary-400" />
        <input
          type="text"
          placeholder={`Buscar ${entityName}...`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-primary-200 focus:border-primary-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          <span className="sr-only">Cargando...</span>
        </div>
      )}

      {/* No results */}
      {!loading && filteredData.length === 0 && (
        <div className="text-center py-16 text-secondary-600">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron resultados
          </h3>
          <p>Intenta modificar tu búsqueda o recarga la página.</p>
        </div>
      )}

      {/* List grid */}
      {!loading && filteredData.length > 0 && (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <li
              key={getId(item)}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow border-2 border-transparent hover:border-primary-400 cursor-pointer"
            >
              <Link
                href={`${entityName}/${getId(item)}`}
                className="block p-6"
                aria-label={`Ver ${entityName} ${getId(item)}`}
              >
                {renderItem(item)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
