import { api } from './api'
import type { Sale, CommissionPreview } from '../types'

export const salesService = {
  list(params?: { sellerId?: number; from?: string; to?: string; limit?: number }): Promise<Sale[]> {
    const qs = new URLSearchParams()
    if (params?.sellerId) qs.set('sellerId', String(params.sellerId))
    if (params?.from)     qs.set('from', params.from)
    if (params?.to)       qs.set('to', params.to)
    if (params?.limit)    qs.set('limit', String(params.limit))
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return api.get<Sale[]>(`/sales${query}`)
  },

  get(id: number): Promise<Sale> {
    return api.get<Sale>(`/sales/${id}`)
  },

  create(data: {
    sellerId: number
    vehicleModel: string
    saleValue: number
    saleDate: string
  }): Promise<Sale> {
    return api.post<Sale>('/sales', data)
  },

  delete(id: number): Promise<void> {
    return api.delete(`/sales/${id}`)
  },

  previewCommission(sellerId: number, saleValue: number): Promise<CommissionPreview> {
    return api.get<CommissionPreview>(
      `/sales/commission-preview?sellerId=${sellerId}&saleValue=${saleValue}`
    )
  },
}
