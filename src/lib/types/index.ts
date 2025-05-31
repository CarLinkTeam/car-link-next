// Vehicle owner type definition
export interface Owner {
  id: string;
  email: string;
  password: string;
  fullName: string;
  location: string;
  phone: string;
  isActive: boolean;
  roles: string[];
}

// Vehicle type definition
export interface Vehicle {
  id: string;
  vehicleModel: string;
  make: string;
  color: string;
  year: number;
  license_plate: string;
  url_photos: string[];
  daily_price: string;
  rental_conditions: string;
  class: string;
  drive: string;
  fuel_type: string;
  transmission: string;
  createdAt: string;
  updatedAt: string;
  owner: Owner;
  ownerId: string;
}
