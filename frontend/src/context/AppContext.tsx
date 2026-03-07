import {
  createContext, useCallback, useContext,
  useState, useEffect, ReactNode,
} from 'react'
import { User, Page } from '../types'
import { authService } from '../services/auth.service'
import { getToken, setToken } from '../services/api'
import { api } from '../services/api'

interface ToastState { msg: string; type: 'success' | 'error' }

interface AppContextValue {
  currentUser: User | null
  authLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>

  page: Page
  setPage: (p: Page) => void
  sideOpen: boolean
  toggleSide: () => void

  toast: ToastState | null
  showToast: (msg: string, type: 'success' | 'error') => void
  clearToast: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [page, setPage] = useState<Page>('dashboard')
  const [sideOpen, setSideOpen] = useState(true)
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { setAuthLoading(false); return }

    api.get<User>('/profile')
      .then((user) => setCurrentUser(user))
      .catch(() => setToken(null))
      .finally(() => setAuthLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password)
    setCurrentUser(res.user)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setCurrentUser(null)
    setPage('dashboard')
  }, [])

  const toggleSide = useCallback(() => setSideOpen((v) => !v), [])
  const showToast = useCallback((msg: string, type: 'success' | 'error') => setToast({ msg, type }), [])
  const clearToast = useCallback(() => setToast(null), [])

  return (
    <AppContext.Provider value={{
      currentUser, authLoading, login, logout,
      page, setPage,
      sideOpen, toggleSide,
      toast, showToast, clearToast,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
