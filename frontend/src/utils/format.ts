export const formatCurrency = (v: number | undefined | null) =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export const formatCurrencyShort = (v: number) =>
  v >= 1000 ? `R$ ${(v / 1000).toFixed(1)}k` : formatCurrency(v)

export const formatDate = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export const formatDateYMD = (date: string | Date) => {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return typeof date === 'string' ? date : ''
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}/${mm}/${dd}`
}

export function extractErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Erro desconhecido'
  const e = err as any
  if (e.errors?.[0]?.message) return e.errors[0].message
  if (e.message) return e.message
  return 'Erro desconhecido'
}

export const inputClass =
  'bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm ' +
  'focus:outline-none focus:border-[#c8f542]/50 transition-all placeholder:text-gray-600'
