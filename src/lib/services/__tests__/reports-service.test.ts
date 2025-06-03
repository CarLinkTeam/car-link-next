import { ReportsService, UserRentalsReport, OwnerIncomeReport, PopularVehiclesReport } from '../reports-service'
import { apiClient } from '@/lib/api'
import { Rental, Vehicle } from '@/lib/types'

// Mock del apiClient
jest.mock('@/lib/api', () => ({
  apiClient: {
    get: jest.fn(),
  },
}))

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

const mockVehicle: Vehicle = {
  id: 'v1',
  make: 'Toyota',
  vehicleModel: 'Corolla',
  year: 2022,
  color: 'Blanco',
  license_plate: 'ABC123',
  url_photos: ['https://example.com/car1.jpg'],
  daily_price: 50000,
  rental_conditions: 'Combustible lleno',
  class: 'Sedán',
  drive: 'FWD',
  fuel_type: 'Gasolina',
  transmission: 'Manual',
  userId: 'o1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ownerId: 'o1',
  owner: {
    id: 'o1',
    location: 'Bogotá',
    email: 'juan@example.com',
    phone: '123456789',
    password: 'hashedpassword',
    fullName: 'Juan Pérez',
    roles: ['TENANT'],
    isActive: true,
  },
}

const mockRentals: Rental[] = [
  {
    id: '1',
    initialDate: '2024-01-10',
    finalDate: '2024-01-15',
    totalCost: '250000',
    status: 'completed',
    client_id: 'c1',
    vehicle_id: 'v1',
    client: {
      id: 'c1',
      location: 'Medellín',
      email: 'cliente@example.com',
      phone: '987654321',
      password: 'hashedpassword',
      fullName: 'Cliente Test',
      roles: ['TENANT'],
      isActive: true,
    },
    vehicle: mockVehicle,
  },
  {
    id: '2',
    initialDate: '2024-01-20',
    finalDate: '2024-01-25',
    totalCost: '300000',
    status: 'completed',
    client_id: 'c2',
    vehicle_id: 'v1',
    client: {
      id: 'c2',
      location: 'Medellín',
      email: 'cliente2@example.com',
      phone: '987654322',
      password: 'hashedpassword',
      fullName: 'Cliente Test 2',
      roles: ['TENANT'],
      isActive: true,
    },
    vehicle: mockVehicle,
  },
]

const mockReviews = [
  { id: '1', rating: 4, comment: 'Buen servicio', createdAt: '2024-01-16T00:00:00Z' },
  { id: '2', rating: 5, comment: 'Excelente', createdAt: '2024-01-26T00:00:00Z' },
]

describe('ReportsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getUserRentalsReport', () => {
    it('debe obtener el reporte de alquileres del usuario correctamente', async () => {
      mockApiClient.get.mockResolvedValue(mockRentals)

      const result: UserRentalsReport = await ReportsService.getUserRentalsReport()

      expect(mockApiClient.get).toHaveBeenCalledWith('/rentals/user')
      expect(result.rentals).toEqual(mockRentals)
      expect(result.totalRentals).toBe(2)
      expect(result.totalSpent).toBe(550000)
      expect(result.averageRentalDuration).toBe(5)
      expect(result.favoriteVehicleType).toBe('Sedán')
    })

    it('debe manejar cuando no hay rentals completados', async () => {
      const incompleteRentals = mockRentals.map((rental) => ({ ...rental, status: 'pending' as const }))
      mockApiClient.get.mockResolvedValue(incompleteRentals)

      const result: UserRentalsReport = await ReportsService.getUserRentalsReport()

      expect(result.totalRentals).toBe(0)
      expect(result.totalSpent).toBe(0)
      expect(result.averageRentalDuration).toBe(0)
    })

    it('debe manejar vehículos sin clasificar', async () => {
      const rentalsWithoutClass = mockRentals.map((rental) => ({
        ...rental,
        vehicle: { ...rental.vehicle, class: undefined as string | undefined },
      }))
      mockApiClient.get.mockResolvedValue(rentalsWithoutClass)

      const result: UserRentalsReport = await ReportsService.getUserRentalsReport()

      expect(result.favoriteVehicleType).toBe('Sin clasificar')
    })
  })

  describe('getOwnerIncomeReport', () => {
    it('debe obtener el reporte de ingresos del propietario correctamente', async () => {
      mockApiClient.get.mockResolvedValue(mockRentals)

      const result: OwnerIncomeReport = await ReportsService.getOwnerIncomeReport()

      expect(mockApiClient.get).toHaveBeenCalledWith('/rentals/owner')
      expect(result.rentals).toEqual(mockRentals)
      expect(result.totalIncome).toBe(550000)
      expect(result.totalRentals).toBe(2)
      expect(result.averageRentalValue).toBe(275000)
      expect(result.topVehicles).toHaveLength(1)
      expect(result.topVehicles[0].vehicle.id).toBe('v1')
      expect(result.topVehicles[0].rentals).toBe(2)
      expect(result.topVehicles[0].income).toBe(550000)
    })

    it('debe manejar cuando no hay rentals', async () => {
      mockApiClient.get.mockResolvedValue([])

      const result: OwnerIncomeReport = await ReportsService.getOwnerIncomeReport()

      expect(result.totalIncome).toBe(0)
      expect(result.totalRentals).toBe(0)
      expect(result.averageRentalValue).toBe(0)
      expect(result.topVehicles).toHaveLength(0)
    })
  })

  describe('getPopularVehiclesReport', () => {
    it('debe obtener el reporte de vehículos populares correctamente', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockRentals).mockResolvedValue(mockReviews)

      const result: PopularVehiclesReport = await ReportsService.getPopularVehiclesReport()

      expect(mockApiClient.get).toHaveBeenCalledWith(expect.stringContaining('/rentals?from='))
      expect(result.vehicles).toHaveLength(1)
      expect(result.vehicles[0].vehicle.id).toBe('v1')
      expect(result.vehicles[0].rentalCount).toBe(2)
      expect(result.vehicles[0].totalIncome).toBe(550000)
      expect(result.vehicles[0].averageRating).toBe(4.5)
      expect(result.period).toBe('Último mes')
      expect(result.totalRentals).toBe(2)
    })

    it('debe manejar errores al obtener reviews', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockRentals).mockRejectedValue(new Error('Reviews not found'))

      const result: PopularVehiclesReport = await ReportsService.getPopularVehiclesReport()

      expect(result.vehicles[0].averageRating).toBe(0)
    })

    it('debe manejar vehículos sin reviews', async () => {
      mockApiClient.get.mockResolvedValueOnce(mockRentals).mockResolvedValue([])

      const result: PopularVehiclesReport = await ReportsService.getPopularVehiclesReport()

      expect(result.vehicles[0].averageRating).toBe(0)
    })
  })

  describe('calculateMonthlyIncome (método privado)', () => {
    it('debe estar accesible a través de getOwnerIncomeReport', async () => {
      mockApiClient.get.mockResolvedValue(mockRentals)

      const result: OwnerIncomeReport = await ReportsService.getOwnerIncomeReport()

      expect(result.monthlyIncome).toBeDefined()
      expect(Array.isArray(result.monthlyIncome)).toBe(true)
    })
  })
})
