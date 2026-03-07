export const fmt = (v: number | undefined | null) =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const fmtShort = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toFixed(1)}k` : fmt(v)

export const fmtDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function extractErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Erro desconhecido'
  const e = err as any
  if (e.errors?.[0]?.message) return e.errors[0].message
  if (e.message) return e.message
  return 'Erro desconhecido'
}

export const inputCls =
  'bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm ' +
  'focus:outline-none focus:border-[#c8f542]/50 transition-all placeholder:text-gray-600'
