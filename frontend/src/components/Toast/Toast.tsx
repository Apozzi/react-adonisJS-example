import { useEffect } from "react";
import { Check, AlertCircle, X } from "lucide-react";

interface ToastProps {
  msg: string;
  type: "success" | "error";
  onClose: () => void;
}

export default function Toast({ msg, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-5 py-3
        rounded-xl shadow-2xl text-white font-medium text-sm
        ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
    >
      {type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}
