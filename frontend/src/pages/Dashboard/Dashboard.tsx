import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart, DollarSign, TrendingUp, UserCheck, Award,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import StatCard from "../../components/StatCard/StatCard";
import { fmt, fmtShort } from "../../utils/format";

export default function Dashboard() {
  const { sales, sellers } = useApp();

  const totalVendas      = sales.reduce((a, s) => a + s.saleValue, 0);
  const totalComVendedor = sales.reduce((a, s) => a + s.sellerCommission, 0);
  const totalComGerente  = sales.reduce((a, s) => a + s.managerCommission, 0);
  const activeSellers    = sellers.filter((s) => s.active).length;

  const recent = [...sales]
    .sort((a, b) => b.saleDate.localeCompare(a.saleDate))
    .slice(0, 8);

  // Last 7 days bar chart
  const last7 = (() => {
    const map: Record<string, number> = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map[d.toISOString().split("T")[0]] = 0;
    }
    sales.forEach((s) => {
      if (map[s.saleDate] !== undefined) map[s.saleDate] += s.saleValue;
    });
    return Object.entries(map).map(([date, v]) => ({ date: date.slice(5), v }));
  })();

  const topSellers = sellers
    .filter((s) => s.active)
    .map((s) => ({
      ...s,
      total: sales.filter((v) => v.sellerId === s.id).reduce((a, v) => a + v.saleValue, 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const TICK = { fontSize: 11, fill: "#6b7280" };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-0.5">Visão geral do sistema de comissões</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total em Vendas"     value={fmtShort(totalVendas)}      sub={`${sales.length} vendas`}          icon={ShoppingCart} trend="up"      />
        <StatCard label="Com. Vendedores"     value={fmtShort(totalComVendedor)} sub="total acumulado"                    icon={DollarSign}   trend="up"      />
        <StatCard label="Com. Gerentes"       value={fmtShort(totalComGerente)}  sub="total acumulado"                    icon={TrendingUp}   trend="up"      />
        <StatCard label="Vendedores Ativos"   value={String(activeSellers)}      sub={`de ${sellers.length} cadastrados`} icon={UserCheck}    trend="neutral" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-[#0f1117] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-4">Vendas — últimos 7 dias</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={last7} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={false} />
              <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => fmtShort(v)} />
              <Tooltip
                contentStyle={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }}
                formatter={(v: any) => [fmt(v), "Vendas"]}
              />
              <Bar dataKey="v" fill="#c8f542" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top sellers */}
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
                <p className="text-gray-600 text-xs">{fmtShort(s.total)}</p>
              </div>
              <Award size={13} className={i === 0 ? "text-[#c8f542]" : "text-gray-700"} />
            </div>
          ))}
        </div>
      </div>

      {/* Recent sales table */}
      <div className="bg-[#0f1117] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/8 flex justify-between items-center">
          <h3 className="text-white font-semibold">Vendas Recentes</h3>
          <span className="text-gray-600 text-xs">{recent.length} registros</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              {["Data", "Veículo", "Vendedor", "Valor", "Com. Vendedor", "Com. Gerente"].map((h) => (
                <th key={h} className="text-left text-gray-600 text-xs font-medium px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((s) => {
              const seller = sellers.find((v) => v.id === s.sellerId);
              return (
                <tr key={s.id} className="border-b border-white/4 hover:bg-white/2 transition-all">
                  <td className="px-5 py-3 text-gray-500 text-xs">{s.saleDate}</td>
                  <td className="px-5 py-3 text-white text-xs font-medium">{s.vehicleModel}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{seller?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-white text-xs font-semibold">{fmt(s.saleValue)}</td>
                  <td className="px-5 py-3 text-[#c8f542] text-xs font-medium">{fmt(s.sellerCommission)}</td>
                  <td className="px-5 py-3 text-purple-400 text-xs font-medium">{fmt(s.managerCommission)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
