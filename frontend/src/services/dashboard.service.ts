import { api } from './api'
import type { DashboardData, ReportData } from '../types'

export const dashboardService = {
  getData(): Promise<DashboardData> {
    return api.get<DashboardData>('/dashboard')
  },

  getReport(sellerId?: number, from?: string, to?: string): Promise<ReportData> {
    const params = new URLSearchParams()
    if (sellerId) params.append('sellerId', String(sellerId))
    if (from) params.append('from', from)
    if (to) params.append('to', to)
    const queryString = params.toString()
    return api.get<ReportData>(`/dashboard/report${queryString ? '?' + queryString : ''}`)
  },
}
