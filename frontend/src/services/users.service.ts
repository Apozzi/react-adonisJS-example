import { api } from './api'
import type { User } from '../types'

export const usersService = {
  list(): Promise<User[]> {
    return api.get<User[]>('/users')
  },

  create(data: { fullName: string | null; email: string; password: string }): Promise<User> {
    return api.post<User>('/users', data)
  },

  delete(id: number): Promise<void> {
    return api.delete(`/users/${id}`)
  },
}
