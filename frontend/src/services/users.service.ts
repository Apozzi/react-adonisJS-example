import { api } from './api'
import type { User } from '../types'

export const usersService = {
  list(): Promise<User[]> {
    return api.get<User[]>('/users')
  },

  show(id: number): Promise<User> {
    return api.get<User>(`/users/${id}`)
  },
}
