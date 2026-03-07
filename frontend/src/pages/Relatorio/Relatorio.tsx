import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardService } from '../../services/dashboard.service'
import { sellersService } from '../../services/sellers.service'
import { useAsync } from '../../hooks/useAsync'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg'
import { formatCurrency, formatCurrencyShort, inputClass } from '../../utils/format'
import './Relatorio.css'

const PIE_COLORS = ['#c8f542', '#a855f7']
const TICK = { fontSize: 11, fill: '#6b7280' }
const TOOLTIP = { contentStyle: { background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 } }

export default function Relatorio() {
  const { data: sellers } = useAsync(() => sellersService.list())

  const [filters, setFilters] = useState({ sellerId: '', from: '', to: '' })
  const { data, loading, error } = useAsync(() =>
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
    { name: 'Gerentes', value: distribution.managerTotal },
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
    <div className="relatorio-container">
      <div>
        <h2 className="relatorio-title">Relatórios</h2>
        <p className="relatorio-subtitle">Análise detalhada com filtros customizados</p>
      </div>

      {isSellerInactive && (
        <div className="relatorio-alert-box">
          <p className="relatorio-alert-text">⚠️ O vendedor <span className="font-semibold">{selectedSeller.name}</span> está marcado como inativo.</p>
        </div>
      )}

      {/* Filtros */}
      <div className="relatorio-filters-bar">
        <div>
          <label className="relatorio-filter-label">Vendedor</label>
          <select
            className={`${inputClass} relatorio-filter-select`}
            style={{ colorScheme: 'dark' }}
            value={filters.sellerId}
            onChange={(e) => setFilters({ ...filters, sellerId: e.target.value })}
          >
            <option value="">Todos</option>
            {(sellers ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label className="relatorio-filter-label">De</label>
          <input
            className={inputClass}
            type="date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </div>
        <div>
          <label className="relatorio-filter-label">Até</label>
          <input
            className={inputClass}
            type="date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </div>
        <button
          onClick={() => setFilters({ sellerId: '', from: '', to: '' })}
          className="relatorio-clear-btn"
        >
          Limpar
        </button>
      </div>

      <div className="relatorio-chart-card">
        <h3 className="relatorio-card-title">Evolução de Vendas ({daysCount} dias)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={last30.map((d) => ({ ...d, date: d.date.slice(5) }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
            <Tooltip {...TOOLTIP} formatter={(v: any) => [formatCurrency(v), 'Valor']} />
            <Line type="monotone" dataKey="totalSales" stroke="#c8f542" strokeWidth={2} dot={false} name="Vendas" />
            <Line type="monotone" dataKey="totalCommission" stroke="#a855f7" strokeWidth={2} dot={false} name="Comissões" />
          </LineChart>
        </ResponsiveContainer>
        <div className="relatorio-legend">
          <span className="relatorio-legend-item"><span className="relatorio-legend-line-sales" />Vendas</span>
          <span className="relatorio-legend-item"><span className="relatorio-legend-line-com" />Comissões</span>
        </div>
      </div>

      <div className="relatorio-charts-grid">
        <div className="relatorio-chart-card">
          <h3 className="relatorio-card-title">Ranking de Vendedores</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ranking} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
              <YAxis type="category" dataKey="name" tick={TICK} tickLine={false} axisLine={false} width={70} />
              <Tooltip {...TOOLTIP} formatter={(v: any) => [formatCurrency(v), 'Valor']} />
              <Bar dataKey="totalCommission" fill="#c8f542" radius={[0, 6, 6, 0]} name="Comissão" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="relatorio-chart-card-flex">
          <h3 className="relatorio-card-title">Distribuição de Comissão</h3>
          <div className="relatorio-pie-wrapper">
            <div className="relatorio-pie-relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP} formatter={(v: any) => [formatCurrency(v), 'Valor']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="relatorio-pie-center">
                <p className="relatorio-pie-total-val">{formatCurrencyShort(distribution.sellerTotal + distribution.managerTotal)}</p>
                <p className="relatorio-pie-total-label">Total</p>
              </div>
            </div>
            <div className="relatorio-pie-legend">
              {pieData.map((d, i) => (
                <div key={d.name} className="relatorio-pie-legend-item">
                  <div className="relatorio-pie-legend-color" style={{ background: PIE_COLORS[i] }} />
                  <div><p className="relatorio-pie-legend-name">{d.name}</p><p className="relatorio-pie-legend-val">{formatCurrency(Number(d.value))}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
