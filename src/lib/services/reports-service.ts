import { apiClient } from "@/lib/api";
import { Rental, Vehicle } from "@/lib/types";

export interface UserRentalsReport {
  rentals: Rental[];
  totalRentals: number;
  totalSpent: number;
  averageRentalDuration: number;
  favoriteVehicleType: string;
}

export interface OwnerIncomeReport {
  rentals: Rental[];
  totalIncome: number;
  totalRentals: number;
  averageRentalValue: number;
  monthlyIncome: { month: string; income: number }[];
  topVehicles: { vehicle: Vehicle; rentals: number; income: number }[];
}

export interface PopularVehiclesReport {
  vehicles: {
    vehicle: Vehicle;
    rentalCount: number;
    totalIncome: number;
    averageRating: number;
  }[];
  period: string;
  totalRentals: number;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export class ReportsService {
  // Reporte de alquileres del usuario
  static async getUserRentalsReport(): Promise<UserRentalsReport> {
    try {
      const rentals = await apiClient.get<Rental[]>(`/rentals/user`);

      const totalRentals = rentals.filter(
        (rental) => rental.status === "completed"
      ).length;
      const totalSpent = rentals.reduce(
        (sum, rental) =>
          rental.status === "completed"
            ? sum + parseFloat(rental.totalCost)
            : sum,
        0
      );

      // Calcular duración promedio
      const totalDays = rentals.reduce((sum, rental) => {
        const start = new Date(rental.initialDate);
        const end = new Date(rental.finalDate);
        const days = Math.ceil(
          (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
        );
        return sum + days;
      }, 0);
      const averageRentalDuration =
        totalRentals > 0 ? Math.round(totalDays / totalRentals) : 0;

      // Tipo de vehículo favorito
      const vehicleTypes = rentals.reduce((acc, rental) => {
        const type = rental.vehicle.class || "Sin clasificar";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const favoriteVehicleType =
        Object.entries(vehicleTypes).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "N/A";

      return {
        rentals,
        totalRentals,
        totalSpent,
        averageRentalDuration,
        favoriteVehicleType,
      };
    } catch (error) {
      console.error("Error fetching user rentals report:", error);
      throw new Error(
        "No se pudieron obtener los datos del reporte de alquileres"
      );
    }
  }

  // Reporte de ingresos del propietario
  static async getOwnerIncomeReport(): Promise<OwnerIncomeReport> {
    try {
      const rentals = await apiClient.get<Rental[]>(`/rentals/owner`);

      const totalIncome = rentals
        .filter((rental) => rental.status === "completed")
        .reduce((sum, rental) => sum + parseFloat(rental.totalCost), 0);

      const totalRentals = rentals.filter(
        (rental) => rental.status === "completed"
      ).length;
      const averageRentalValue =
        totalRentals > 0 ? totalIncome / totalRentals : 0;

      // Ingresos mensuales (últimos 12 meses)
      const monthlyIncome = this.calculateMonthlyIncome(rentals);

      // Top vehículos por ingresos
      const vehicleStats = rentals.reduce((acc, rental) => {
        const vehicleId = rental.vehicle.id;
        if (!acc[vehicleId]) {
          acc[vehicleId] = {
            vehicle: rental.vehicle,
            rentals: 0,
            income: 0,
          };
        }
        if (rental.status === "completed") {
          acc[vehicleId].rentals += 1;
        }
        if (rental.status === "completed") {
          acc[vehicleId].income += parseFloat(rental.totalCost);
        }
        return acc;
      }, {} as Record<string, { vehicle: Vehicle; rentals: number; income: number }>);

      const topVehicles = Object.values(vehicleStats)
        .sort((a, b) => b.income - a.income)
        .slice(0, 5);

      return {
        rentals,
        totalIncome,
        totalRentals,
        averageRentalValue,
        monthlyIncome,
        topVehicles,
      };
    } catch (error) {
      console.error("Error fetching owner income report:", error);
      throw new Error(
        "No se pudieron obtener los datos del reporte de ingresos"
      );
    }
  }

  // Reporte de vehículos más populares
  static async getPopularVehiclesReport(): Promise<PopularVehiclesReport> {
    try {
      // Obtener rentals del último mes
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const fromDate = lastMonth.toISOString().split("T")[0];

      const rentals = await apiClient.get<Rental[]>(
        `/rentals?from=${fromDate}`
      );

      const vehicleStats = rentals.reduce((acc, rental) => {
        const vehicleId = rental.vehicle.id;
        if (!acc[vehicleId]) {
          acc[vehicleId] = {
            vehicle: rental.vehicle,
            rentalCount: 0,
            totalIncome: 0,
            ratings: [],
          };
        }
        if (rental.status === "completed") {
          acc[vehicleId].rentalCount += 1;
          acc[vehicleId].totalIncome += parseFloat(rental.totalCost);
        }
        return acc;
      }, {} as Record<string, { vehicle: Vehicle; rentalCount: number; totalIncome: number; ratings: number[] }>);

      // Obtener reviews para calcular rating promedio
      const vehicles = await Promise.all(
        Object.values(vehicleStats).map(async (stat) => {
          try {
            const reviews = await apiClient.get<Review[]>(
              `/reviews/vehicle/${stat.vehicle.id}`
            );
            const averageRating =
              reviews.length > 0
                ? reviews.reduce((sum, review) => sum + review.rating, 0) /
                  reviews.length
                : 0;

            return {
              vehicle: stat.vehicle,
              rentalCount: stat.rentalCount,
              totalIncome: stat.totalIncome,
              averageRating: Math.round(averageRating * 10) / 10,
            };
          } catch {
            return {
              vehicle: stat.vehicle,
              rentalCount: stat.rentalCount,
              totalIncome: stat.totalIncome,
              averageRating: 0,
            };
          }
        })
      );

      const sortedVehicles = vehicles.sort(
        (a, b) => b.rentalCount - a.rentalCount
      );

      return {
        vehicles: sortedVehicles,
        period: "Último mes",
        totalRentals: rentals.filter((rental) => rental.status === "completed")
          .length,
      };
    } catch (error) {
      console.error("Error fetching popular vehicles report:", error);
      throw new Error(
        "No se pudieron obtener los datos del reporte de vehículos populares"
      );
    }
  }

  // Calcular ingresos mensuales
  private static calculateMonthlyIncome(
    rentals: Rental[]
  ): { month: string; income: number }[] {
    const monthlyData: Record<string, number> = {};

    // Inicializar últimos 12 meses
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
      });
      monthlyData[monthKey] = 0;
    }

    // Agregar ingresos por mes
    rentals
      .filter((rental) => rental.status === "completed")
      .forEach((rental) => {
        const date = new Date(rental.finalDate);
        const monthKey = date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
        });
        if (monthlyData.hasOwnProperty(monthKey)) {
          monthlyData[monthKey] += parseFloat(rental.totalCost);
        }
      });

    return Object.entries(monthlyData).map(([month, income]) => ({
      month,
      income,
    }));
  }
}
