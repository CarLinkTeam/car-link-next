// Vehicle type definition
export type Vehicle = {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  color?: string;
  price?: number;
  ownerId: string;
  images?: string[];
  description?: string;
  features?: string[];
  availability?: {
    startDate: Date;
    endDate: Date;
  }[];
};

// User type definition
export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  createdAt: Date;
  role: "USER" | "ADMIN";
};

// Rental type definition
export type Rental = {
  id: string;
  vehicleId: string;
  vehicle?: Vehicle;
  renterId: string;
  renter?: User;
  startDate: Date;
  endDate: Date;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  totalPrice: number;
  paymentStatus: "PENDING" | "PAID" | "REFUNDED";
  createdAt: Date;
};

// API response types
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
  status: number;
};
