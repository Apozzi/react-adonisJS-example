export interface User {
  id: number
  fullName: string | null
  email: string
  initials: string
  createdAt: string
  updatedAt: string
}

export interface Seller {
  id: number
  name: string
  email: string
  managerId: number | null
  fixedCommission: number
  percentCommission: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Sale {
  id: number
  sellerId: number
  vehicleModel: string
  saleValue: number
  saleDate: string
  sellerCommission: number
  managerCommission: number
  sellerRule: string | null
  managerRule: string | null
  createdAt: string
  seller?: { id: number; name: string }
}

export interface DashboardTotals {
  totalSales: number
  totalSellerCommission: number
  totalManagerCommission: number
  totalCount: number
  activeSellers: number
  totalSellers: number
}

export interface DashboardData {
  totals: DashboardTotals
  last7: { date: string; total: number }[]
  recentSales: (Sale & { seller: { id: number; name: string } })[]
  topSellers: { id: number; name: string; totalCommission: number; totalSales: number; saleCount: number }[]
}

export interface ReportData {
  last30: { date: string; totalSales: number; totalCommission: number }[]
  ranking: { id: number; name: string; totalCommission: number; totalSales: number; saleCount: number }[]
  distribution: { sellerTotal: number; managerTotal: number }
}

export interface CommissionPreview {
  sellerCommission: number
  managerCommission: number
  sellerRule: string
  managerRule: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type Page = 'dashboard' | 'usuarios' | 'vendedores' | 'vendas' | 'relatorios'

export interface ApiError {
  message?: string
  errors?: { message: string; field?: string }[]
}
