import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { User, Seller, Sale, Page } from "../types";
import { SEED_USERS, SEED_SELLERS, generateSales } from "../utils/seedData";

interface ToastState {
  msg: string;
  type: "success" | "error";
}

interface AppContextValue {
  currentUser: User | null;
  login: (u: User) => void;
  logout: () => void;

  page: Page;
  setPage: (p: Page) => void;
  sideOpen: boolean;
  toggleSide: () => void;

  users: User[];
  setUsers: (u: User[]) => void;
  sellers: Seller[];
  setSellers: (s: Seller[]) => void;
  sales: Sale[];
  setSales: (s: Sale[]) => void;

  toast: ToastState | null;
  showToast: (msg: string, type: "success" | "error") => void;
  clearToast: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("dashboard");
  const [sideOpen, setSideOpen] = useState(true);

  const [users, setUsers] = useState<User[]>(SEED_USERS);
  const [sellers, setSellers] = useState<Seller[]>(SEED_SELLERS);
  const [sales, setSales] = useState<Sale[]>(() => generateSales(SEED_SELLERS));

  const [toast, setToast] = useState<ToastState | null>(null);

  const login = useCallback((u: User) => setCurrentUser(u), []);
  const logout = useCallback(() => {
    setCurrentUser(null);
    setPage("dashboard");
  }, []);
  const toggleSide = useCallback(() => setSideOpen((v) => !v), []);
  const showToast = useCallback(
    (msg: string, type: "success" | "error") => setToast({ msg, type }),
    []
  );
  const clearToast = useCallback(() => setToast(null), []);

  return (
    <AppContext.Provider
      value={{
        currentUser, login, logout,
        page, setPage,
        sideOpen, toggleSide,
        users, setUsers,
        sellers, setSellers,
        sales, setSales,
        toast, showToast, clearToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
