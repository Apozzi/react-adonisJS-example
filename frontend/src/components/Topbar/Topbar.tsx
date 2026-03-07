import { Menu, Bell } from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Topbar() {
  const { currentUser, toggleSide } = useApp();

  return (
    <header className="bg-[#0a0c12] border-b border-white/6 px-5 py-3.5 flex items-center gap-4 flex-shrink-0">
      <button
        onClick={toggleSide}
        className="text-gray-500 hover:text-white transition-colors"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3">
        {/* Bell */}
        <button
          className="p-2 rounded-xl text-gray-600 hover:text-white
            hover:bg-white/6 transition-all relative"
        >
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#c8f542]" />
        </button>

        {/* User badge */}
        <div
          className="flex items-center gap-2.5 bg-white/5 border border-white/8
            rounded-xl px-3 py-2"
        >
          <div className="w-6 h-6 rounded-lg bg-[#c8f542]/15 flex items-center justify-center">
            <span className="text-[#c8f542] text-xs font-bold">
              {currentUser?.name[0]}
            </span>
          </div>
          <div>
            <p className="text-white text-xs font-medium leading-none">
              {currentUser?.name}
            </p>
            <p className="text-gray-600 text-xs leading-none mt-0.5">
              {currentUser?.role === "admin" ? "Admin" : "Visualizador"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
