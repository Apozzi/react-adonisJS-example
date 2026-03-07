import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useApp } from "../../context/AppContext";
import { fmt, fmtShort } from "../../utils/format";

const PIE_COLORS = ["#c8f542", "#a855f7"];
const TICK = { fontSize: 11, fill: "#6b7280" };
const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0f1117",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: 12,
  },
};

export default function Relatorio() {
  const { sales, sellers } = useApp();

  /* Line chart — last 30 days */
  const last30 = (() => {
    const map: Record<string, { vendas: number; comissao: number }> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      map[d.toISOString().split("T")[0]] = { vendas: 0, comissao: 0 };
    }
    sales.forEach((s) => {
      if (map[s.saleDate]) {
        map[s.saleDate].vendas    += s.saleValue;
        map[s.saleDate].comissao  += s.sellerCommission + s.managerCommission;
      }
    });
    return Object.entries(map).map(([date, v]) => ({ date: date.slice(5), ...v }));
  })();

  /* Bar chart — ranking */
  const ranking = sellers
    .filter((s) => s.active)
    .map((s) => {
      const ss = sales.filter((v) => v.sellerId === s.id);
      return {
        name: s.name.split(" ")[0],
        totalComissao: ss.reduce((a, v) => a + v.sellerCommission, 0),
      };
    })
    .sort((a, b) => b.totalComissao - a.totalComissao)
    .slice(0, 8);

  /* Pie chart */
  const totalSellerCom  = sales.reduce((a, s) => a + s.sellerCommission, 0);
  const totalManagerCom = sales.reduce((a, s) => a + s.managerCommission, 0);
  const pieData = [
    { name: "Vendedores", value: totalSellerCom  },
    { name: "Gerentes",   value: totalManagerCom },
  ];

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Relatórios</h2>
        <p className="text-gray-500 text-sm mt-0.5">Análise dos últimos 30 dias</p>
      </div>

      {/* Evolução de vendas */}
      <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5">
        <h3 className="text-white font-semibold mb-5">Evolução de Vendas (30 dias)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={last30}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={TICK} tickLine={false} axisLine={false} interval={4} />
            <YAxis tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => fmtShort(v)} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [fmt(v), ""]} />
            <Line type="monotone" dataKey="vendas"   stroke="#c8f542" strokeWidth={2} dot={false} name="Vendas"     />
            <Line type="monotone" dataKey="comissao" stroke="#a855f7" strokeWidth={2} dot={false} name="Comissões"  />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex gap-4 mt-3 justify-center">
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-0.5 bg-[#c8f542] inline-block rounded" /> Vendas
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-3 h-0.5 bg-purple-400 inline-block rounded" /> Comissões
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking */}
        <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5">
          <h3 className="text-white font-semibold mb-5">Ranking de Vendedores</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ranking} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
              <XAxis type="number" tick={TICK} tickLine={false} axisLine={false} tickFormatter={(v) => fmtShort(v)} />
              <YAxis type="category" dataKey="name" tick={TICK} tickLine={false} axisLine={false} width={70} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [fmt(v), ""]} />
              <Bar dataKey="totalComissao" fill="#c8f542" radius={[0, 6, 6, 0]} name="Comissão" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribuição */}
        <div className="bg-[#0f1117] border border-white/8 rounded-2xl p-5 flex flex-col">
          <h3 className="text-white font-semibold mb-5">Distribuição de Comissão</h3>
          <div className="flex-1 flex items-center justify-center">
            <div className="relative">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: any) => [fmt(v), ""]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <p className="text-white font-bold text-sm">
                  {fmt(totalSellerCom + totalManagerCom).replace("R$", "").trim()}
                </p>
                <p className="text-gray-600 text-xs">Total</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 ml-6">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                  <div>
                    <p className="text-gray-400 text-xs">{d.name}</p>
                    <p className="text-white font-semibold text-sm">{fmt(d.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
