import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ShoppingCart, DollarSign, TrendingUp, UserCheck, Award } from 'lucide-react'
import { dashboardService } from '../../services/dashboard.service'
import { useAsync } from '../../hooks/useAsync'
import { StatCard, Spinner, ErrorMsg } from '../../components/UI'
import { fmt, fmtShort } from '../../utils/format'
import './Dashboard.css'

const TICK = { fontSize: 11, fill: '#6b7280' }

export default function Dashboard() {
  const { data, loading, error } = useAsync(() => dashboardService.getData())

  if (loading) return <Spinner />
  if (error || !data) return <ErrorMsg message={error ?? 'Erro ao carregar dashboard'} />

  const { totals, last7, recentSales, topSellers } = data

  return (
    <div className="dashboard-container">
      <div>
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Visão geral do sistema de comissões</p>
      </div>

      <div className="dashboard-stats-grid">
        <StatCard label="Total em Vendas"   value={fmtShort(totals.totalSales)}             sub={`${totals.totalCount} vendas`}             icon={ShoppingCart} trend="up"      />
        <StatCard label="Com. Vendedores"   value={fmtShort(totals.totalSellerCommission)}  sub="total acumulado"                            icon={DollarSign}   trend="up"      />
        <StatCard label="Com. Gerentes"     value={fmtShort(totals.totalManagerCommission)} sub="total acumulado"                            icon={TrendingUp}   trend="up"      />
        <StatCard label="Vendedores Ativos" value={String(totals.activeSellers)}            sub={`de ${totals.totalSellers} cadastrados`}    icon={UserCheck}    trend="neutral" />
      </div>

      <div className="dashboard-charts-grid">
        <div className="dashboard-chart-card">
          <h3 className="dashboard-card-title-mb">Vendas — últimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7.map((d) => ({ ...d, date: d.date.slice(5) }))} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => fmtShort(v)} />
              <Tooltip contentStyle={{ background: '#0f1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: 12 }} formatter={(v: any) => [fmt(v), 'Vendas']} />
              <Bar dataKey="total" fill="#c8f542" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-top-sellers-card">
          <h3 className="dashboard-card-title">Top Vendedores</h3>
          {topSellers.map((s, i) => (
            <div key={s.id} className="dashboard-seller-item">
              <span className="dashboard-seller-rank">{i + 1}</span>
              <div className="dashboard-seller-avatar">
                <span className="dashboard-seller-initial">{s.name[0]}</span>
              </div>
              <div className="dashboard-seller-info">
                <p className="dashboard-seller-name">{s.name}</p>
                <p className="dashboard-seller-sales">{fmtShort(s.totalSales)}</p>
              </div>
              <Award size={13} className={i === 0 ? 'text-[#c8f542]' : 'text-gray-700'} />
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-table-card">
        <div className="dashboard-table-header">
          <h3 className="dashboard-card-title">Vendas Recentes</h3>
          <span className="dashboard-table-count">{recentSales.length} registros</span>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr className="dashboard-thead-tr">
              {['Data', 'Veículo', 'Vendedor', 'Valor', 'Com. Vendedor', 'Com. Gerente'].map((h) => (
                <th key={h} className="dashboard-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentSales.map((s) => (
              <tr key={s.id} className="dashboard-tr">
                <td className="dashboard-td-date">{s.saleDate}</td>
                <td className="dashboard-td-model">{s.vehicleModel}</td>
                <td className="dashboard-td-seller">{s.seller?.name ?? '—'}</td>
                <td className="dashboard-td-value">{fmt(s.saleValue)}</td>
                <td className="dashboard-td-com-seller">{fmt(s.sellerCommission)}</td>
                <td className="dashboard-td-com-manager">{fmt(s.managerCommission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
