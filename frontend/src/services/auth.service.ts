import { api, setToken } from './api'
import type { AuthResponse } from '../types'

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<any>('/auth/login', { email, password })
    const payload: AuthResponse = res?.data ?? res
    setToken(payload.token)
    return payload
  },

  async signup(
    fullName: string | null,
    email: string,
    password: string,
    passwordConfirmation: string
  ): Promise<AuthResponse> {
    const res = await api.post<any>('/auth/signup', { fullName, email, password, passwordConfirmation })
    const payload: AuthResponse = res?.data ?? res
    setToken(payload.token)
    return payload
  },

  async logout(): Promise<void> {
    await api.delete('/auth/logout').catch(() => {})
    setToken(null)
  },
}