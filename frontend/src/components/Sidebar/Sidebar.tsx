import {
  TrendingUp,
  Users,
  UserCheck,
  ShoppingCart,
  FileBarChart2,
  LogOut,
  DollarSign,
} from "lucide-react";
import { Page } from "../../types";
import { useApp } from "../../context/AppContext";

const NAV_ITEMS: { key: Page; label: string; icon: React.ElementType }[] = [
  { key: "dashboard",   label: "Dashboard",  icon: TrendingUp    },
  { key: "usuarios",    label: "Usuários",   icon: Users         },
  { key: "vendedores",  label: "Vendedores", icon: UserCheck     },
  { key: "vendas",      label: "Vendas",     icon: ShoppingCart  },
  { key: "relatorios",  label: "Relatórios", icon: FileBarChart2 },
];

export default function Sidebar() {
  const { page, setPage, sideOpen, logout } = useApp();

  return (
    <aside
      className={`${sideOpen ? "w-56" : "w-0 overflow-hidden"}
        bg-[#0a0c12] border-r border-white/6 flex flex-col
        transition-all duration-300 flex-shrink-0`}
    >
      {/* Logo */}
      <div className="p-5 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#c8f542] flex items-center justify-center flex-shrink-0">
            <DollarSign size={14} className="text-black" />
          </div>
          <span className="text-white font-bold text-sm">Comissões</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setPage(key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
              text-sm font-medium transition-all text-left
              ${page === key
                ? "bg-[#c8f542] text-black"
                : "text-gray-500 hover:text-white hover:bg-white/6"
              }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-sm text-gray-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
        >
          <LogOut size={15} />
          Sair
        </button>
      </div>
    </aside>
  );
}
