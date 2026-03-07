import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService } from '../../services/dashboard.service'
import { sellersService } from '../../services/sellers.service'
import { useAsync } from '../../hooks/useAsync'
import { Spinner, ErrorMsg } from '../../components/UI'
import { fmt, fmtDate, fmtShort, inputCls } from '../../utils/format'

const PIE_COLORS = ['#c8f542', '#a855f7']
const TICK = { fontSize: 11, fill: '#6b7280' }
const TOOLTIP = { contentStyle: { background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 } }

export default function Relatorio() {
  const { data: sellers } = useAsync(() => sellersService.list())
  
  const [filters, setFilters] = useState({ sellerId: '', from: '', to: '' })
  const { data, loading, error, refetch } = useAsync(() => 
    dashboardService.getReport(
      filters.sellerId ? Number(filters.sellerId) : undefined,
      filters.from || undefined,
      filters.to || undefined
    ),
    [filters]
  )

  if (loading) return <Spinner />
  if (error || !data) return <ErrorMsg message={error ?? 'Erro ao carregar relatório'} />

  const { last30, ranking, distribution } = data
  const pieData = [
    { name: 'Vendedores', value: distribution.sellerTotal },
    { name: 'Gerentes',   value: distribution.managerTotal },
  ]

  // Check if filtered seller is inactive
  const selectedSeller = filters.sellerId ? (sellers ?? []).find(s => String(s.id) === filters.sellerId) : null
  const isSellerInactive = selectedSeller && !selectedSeller.active

  // Calculate date range for title
  const calculateDaysDifference = () => {
    if (!filters.from || !filters.to) return 30 // default
    const from = new Date(filters.from)
    const to = new Date(filters.to)
    const diffTime = Math.abs(to.getTime() - from.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }
  const daysCount = calculateDaysDifference()

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Relatórios</h2>
        <p className="text-gray-500 text-sm mt-0.5">Análise detalhada com filtros customizados</p>
      </div>

      {isSellerInactive && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <p className="text-red-400 text-sm font-medium">⚠️ O vendedor <span className="font-semibold">{selectedSeller.name}</span> está marcado como inativo.</p>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5 flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2">Vendedor</label>
          <select 
            className={`${inputCls} text-white`}
            style={{ colorScheme: 'dark' }}
            value={filters.sellerId}
            onChange={(e) => setFilters({ ...filters, sellerId: e.target.value })}
          >
            <option value="">Todos</option>
            {(sellers ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2">De</label>
          <input 
            className={inputCls}
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 text-xs font-medium mb-2">Até</label>
          <input 
            className={inputCls}
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>
        <button 
          onClick={() => setFilters({ sellerId: '', from: '', to: '' })}
          className="px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 rounded-xl text-sm hover:bg-white/10 transition-all"
        >
          Limpar
        </button>
      </div>

      <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-5">Evolução de Vendas ({daysCount} dias)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={last30.map((d) => ({ ...d, date: d.date.slice(5) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => fmtShort(v)} />
            <Tooltip {...TOOLTIP} formatter={(v: any) => [fmt(v), '']} />
            <Line type="monotone" dataKey="totalSales"      stroke="#c8f542" strokeWidth={2} dot={false} name="Vendas"     />
            <Line type="monotone" dataKey="totalCommission" stroke="#a855f7" strokeWidth={2} dot={false} name="Comissões"  />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-[#c8f542] inline-block rounded" />Vendas</span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-purple-400 inline-block rounded" />Comissões</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5">Ranking de Vendedores</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ranking} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => fmtShort(v)} />
              <YAxis type="category" dataKey="name" tick={TICK} tickLine={false} axisLine={false} width={70} />
              <Tooltip {...TOOLTIP} formatter={(v: any) => [fmt(v), '']} />
              <Bar dataKey="totalCommission" fill="#c8f542" radius={[0, 6, 6, 0]} name="Comissão" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5 flex flex-col">
          <h3 className="text-white font-semibold mb-5">Distribuição de Comissão</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP} formatter={(v: any) => [fmt(v), '']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <p className="text-white font-bold text-sm">{fmtShort(distribution.sellerTotal + distribution.managerTotal)}</p>
                <p className="text-gray-600 text-xs">Total</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 ml-6">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <div><p className="text-gray-400 text-xs">{d.name}</p><p className="text-white font-semibold text-sm">{fmt(Number(d.value))}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
