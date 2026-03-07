import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ShoppingCart, DollarSign, TrendingUp, UserCheck, Award } from 'lucide-react'
import { dashboardService } from '../../services/dashboard.service'
import { useAsync } from '../../hooks/useAsync'
import { StatCard, Spinner, ErrorMsg } from '../../components/UI'
import { fmt, fmtShort } from '../../utils/format'

const TICK = { fontSize: 11, fill: '#6b7280' }

export default function Dashboard() {
  const { data, loading, error } = useAsync(() => dashboardService.getData())

  if (loading) return <Spinner />
  if (error || !data) return <ErrorMsg message={error ?? 'Erro ao carregar dashboard'} />

  const { totals, last7, recentSales, topSellers } = data

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">Visão geral do sistema de comissões</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total em Vendas"   value={fmtShort(totals.totalSales)}             sub={`${totals.totalCount} vendas`}             icon={ShoppingCart} trend="up"      />
        <StatCard label="Com. Vendedores"   value={fmtShort(totals.totalSellerCommission)}  sub="total acumulado"                            icon={DollarSign}   trend="up"      />
        <StatCard label="Com. Gerentes"     value={fmtShort(totals.totalManagerCommission)} sub="total acumulado"                            icon={TrendingUp}   trend="up"      />
        <StatCard label="Vendedores Ativos" value={String(totals.activeSellers)}            sub={`de ${totals.totalSellers} cadastrados`}    icon={UserCheck}    trend="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0f1117] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Vendas — últimos 7 dias</h3>
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

        <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5 flex flex-col gap-3">
          <h3 className="text-white font-semibold">Top Vendedores</h3>
          {topSellers.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span className="text-gray-600 text-xs font-bold w-4">{i + 1}</span>
              <div className="w-7 h-7 rounded-lg bg-[#c8f542]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#c8f542] text-xs font-bold">{s.name[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{s.name}</p>
                <p className="text-gray-600 text-xs">{fmtShort(s.totalSales)}</p>
              </div>
              <Award size={13} className={i === 0 ? 'text-[#c8f542]' : 'text-gray-700'} />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0f1117] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 flex justify-between items-center">
          <h3 className="text-white font-semibold">Vendas Recentes</h3>
          <span className="text-gray-600 text-xs">{recentSales.length} registros</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {['Data', 'Veículo', 'Vendedor', 'Valor', 'Com. Vendedor', 'Com. Gerente'].map((h) => (
                <th key={h} className="text-left text-gray-600 text-xs font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentSales.map((s) => (
              <tr key={s.id} className="border-b border-white/4 hover:bg-white/2 transition-all">
                <td className="px-5 py-3 text-gray-500 text-xs">{s.saleDate}</td>
                <td className="px-5 py-3 text-white text-xs font-medium">{s.vehicleModel}</td>
                <td className="px-5 py-3 text-gray-400 text-xs">{s.seller?.name ?? '—'}</td>
                <td className="px-5 py-3 text-white text-xs font-semibold">{fmt(s.saleValue)}</td>
                <td className="px-5 py-3 text-[#c8f542] text-xs font-medium">{fmt(s.sellerCommission)}</td>
                <td className="px-5 py-3 text-purple-400 text-xs font-medium">{fmt(s.managerCommission)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
