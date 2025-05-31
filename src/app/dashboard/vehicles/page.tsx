"use client";

import Link from "next/link";

export default function VehiclesPage() {
  // This would normally fetch data from an API
  const vehicles = [
    { id: "1", make: "Toyota", model: "Corolla", year: 2020 },
    { id: "2", make: "Honda", model: "Civic", year: 2021 },
    { id: "3", make: "Ford", model: "Mustang", year: 2019 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Vehicles</h2>
        <Link
          href="/vehicles/add"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Vehicle
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              <Link
                href={`/vehicles/${vehicle.id}`}
                className="block hover:bg-gray-50"
              >
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-indigo-600 truncate">
                      {vehicle.make} {vehicle.model}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {vehicle.year}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
