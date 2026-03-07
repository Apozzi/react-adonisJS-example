import { api } from './api'
import type { Seller } from '../types'

export const sellersService = {
  list(onlyActive?: boolean): Promise<Seller[]> {
    const qs = onlyActive !== undefined ? `?active=${onlyActive}` : ''
    return api.get<Seller[]>(`/sellers${qs}`)
  },

  get(id: number): Promise<Seller> {
    return api.get<Seller>(`/sellers/${id}`)
  },

  create(data: Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>): Promise<Seller> {
    return api.post<Seller>('/sellers', data)
  },

  update(id: number, data: Partial<Omit<Seller, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Seller> {
    return api.put<Seller>(`/sellers/${id}`, data)
  },

  delete(id: number): Promise<void> {
    return api.delete(`/sellers/${id}`)
  },
}
