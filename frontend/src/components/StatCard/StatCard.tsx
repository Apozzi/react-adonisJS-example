import { ElementType } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ElementType;
  trend?: "up" | "down" | "neutral";
}

export default function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: StatCardProps) {
  return (
    <div
      className="bg-[#0f1117] border border-white/8 rounded-2xl p-5 flex flex-col gap-3
        hover:border-[#c8f542]/30 transition-all group"
    >
      <div className="flex justify-between items-start">
        <div
          className="w-10 h-10 rounded-xl bg-[#c8f542]/10 flex items-center justify-center
            group-hover:bg-[#c8f542]/20 transition-all"
        >
          <Icon size={18} className="text-[#c8f542]" />
        </div>
        {trend && (
          <span
            className={`flex items-center gap-1 text-xs font-medium
              ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-red-400" : "text-gray-500"}`}
          >
            {trend === "up" ? (
              <ArrowUpRight size={12} />
            ) : trend === "down" ? (
              <ArrowDownRight size={12} />
            ) : null}
          </span>
        )}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
