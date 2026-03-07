/// <reference types="vite/client" />

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333'

let authToken: string | null = localStorage.getItem('auth_token')

export function setToken(token: string | null) {
  authToken = token
  if (token) localStorage.setItem('auth_token', token)
  else localStorage.removeItem('auth_token')
}

export function getToken() {
  return authToken
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 204) return undefined as T

  const json = await res.json()

  if (!res.ok) {
    const err = new Error(json?.message ?? 'Request failed') as any
    err.status = res.status
    err.errors = json?.errors
    throw err
  }

  // AdonisJS serialize() and resourceful responses wrap in { data: ... }
  // Return the inner data when present, otherwise return as-is
  return (json?.data !== undefined ? json.data : json) as T
}

export const api = {
  get:    <T>(path: string)                => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: <T>(path: string)               => request<T>(path, { method: 'DELETE' }),
}