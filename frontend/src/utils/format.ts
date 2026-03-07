export const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const fmtShort = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toFixed(1)}k` : fmt(v);

export const inputCls =
  "bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm " +
  "focus:outline-none focus:border-[#c8f542]/50 focus:bg-white/8 transition-all placeholder:text-gray-600";
