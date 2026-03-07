import { useState, useEffect } from "react";
import { Plus, Eye, Trash2, Search } from "lucide-react";
import { Sale } from "../../types";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/Modal/Modal";
import Field from "../../components/Field/Field";
import { fmt, inputCls } from "../../utils/format";
import { calcCommissions } from "../../utils/commission";

export default function Vendas() {
  const { sales, setSales, sellers, showToast } = useApp();

  const [modal, setModal]   = useState<"add" | "detail" | null>(null);
  const [detail, setDetail] = useState<Sale | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm]     = useState({
    sellerId: "", vehicleModel: "", saleValue: 0,
    saleDate: new Date().toISOString().split("T")[0],
  });
  const [preview, setPreview] = useState<ReturnType<typeof calcCommissions> | null>(null);

  const activeSellers = sellers.filter((s) => s.active);

  useEffect(() => {
    if (form.sellerId && form.saleValue > 0) {
      const seller = sellers.find((s) => s.id === form.sellerId);
      if (seller) setPreview(calcCommissions(form.saleValue, seller, sellers));
    } else {
      setPreview(null);
    }
  }, [form.sellerId, form.saleValue, sellers]);

  const openAdd = () => {
    setForm({ sellerId: "", vehicleModel: "", saleValue: 0, saleDate: new Date().toISOString().split("T")[0] });
    setModal("add");
  };

  const save = () => {
    if (!form.sellerId || !form.vehicleModel || !form.saleValue) {
      showToast("Preencha todos os campos.", "error");
      return;
    }
    const seller = sellers.find((s) => s.id === form.sellerId)!;
    const result = calcCommissions(form.saleValue, seller, sellers);
    setSales([
      {
        id: `sale${Date.now()}`,
        sellerId: form.sellerId,
        vehicleModel: form.vehicleModel,
        saleValue: Number(form.saleValue),
        saleDate: form.saleDate,
        ...result,
      },
      ...sales,
    ]);
    showToast("Venda registrada e comissões calculadas!", "success");
    setModal(null);
  };

  const remove = (id: string) => {
    setSales(sales.filter((s) => s.id !== id));
    showToast("Venda removida.", "success");
  };

  const filtered = sales.filter((s) => {
    const seller = sellers.find((v) => v.id === s.sellerId);
    return (
      seller?.name.toLowerCase().includes(search.toLowerCase()) ||
      s.vehicleModel.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Vendas</h2>
          <p className="text-gray-500 text-sm mt-0.5">Registro e comissões calculadas automaticamente</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#c8f542] text-black font-semibold
            px-4 py-2.5 rounded-xl hover:bg-[#d4f75e] transition-all text-sm"
        >
          <Plus size={16} /> Nova Venda
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className={`${inputCls} w-full pl-9`}
          placeholder="Buscar por vendedor ou veículo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[#0f1117] border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              {["Data", "Veículo", "Vendedor", "Valor Venda", "Com. Vendedor", "Com. Gerente", "Ações"].map((h) => (
                <th key={h} className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-4 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((s) => {
              const seller = sellers.find((v) => v.id === s.sellerId);
              return (
                <tr key={s.id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                  <td className="px-4 py-3.5 text-gray-400">{s.saleDate}</td>
                  <td className="px-4 py-3.5 text-white font-medium">{s.vehicleModel}</td>
                  <td className="px-4 py-3.5 text-gray-300">{seller?.name ?? "—"}</td>
                  <td className="px-4 py-3.5 text-white font-semibold">{fmt(s.saleValue)}</td>
                  <td className="px-4 py-3.5 text-[#c8f542] font-medium">{fmt(s.sellerCommission)}</td>
                  <td className="px-4 py-3.5 text-purple-400 font-medium">{fmt(s.managerCommission)}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setDetail(s); setModal("detail"); }}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => remove(s.id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-600 py-10">
                  Nenhuma venda encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Nova Venda */}
      {modal === "add" && (
        <Modal title="Registrar Venda" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Vendedor">
              <select className={inputCls} value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })}>
                <option value="">Selecionar...</option>
                {activeSellers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Veículo">
              <input className={inputCls} placeholder="Ex: Civic 2024" value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Valor da Venda (R$)">
                <input className={inputCls} type="number" min={0} value={form.saleValue} onChange={(e) => setForm({ ...form, saleValue: Number(e.target.value) })} />
              </Field>
              <Field label="Data">
                <input className={inputCls} type="date" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} />
              </Field>
            </div>

            {preview && (
              <div className="bg-[#c8f542]/5 border border-[#c8f542]/20 rounded-xl p-4 flex flex-col gap-2">
                <p className="text-[#c8f542] text-xs font-semibold uppercase tracking-wider">Prévia do Comissionamento</p>
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div>
                    <p className="text-gray-500 text-xs">Comissão Vendedor</p>
                    <p className="text-white font-bold">{fmt(preview.sellerCommission)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Comissão Gerente</p>
                    <p className="text-white font-bold">{fmt(preview.managerCommission)}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-xs mt-1">{preview.sellerRule}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button onClick={save} className="flex-1 bg-[#c8f542] text-black font-semibold py-2.5 rounded-xl text-sm">
                Registrar Venda
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Detalhe */}
      {modal === "detail" && detail && (
        <Modal title="Detalhes da Venda" onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {([
                ["Veículo", detail.vehicleModel],
                ["Data", detail.saleDate],
                ["Valor", fmt(detail.saleValue)],
                ["Vendedor", sellers.find((s) => s.id === detail.sellerId)?.name ?? "—"],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-white/4 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">{k}</p>
                  <p className="text-white font-semibold mt-0.5">{v}</p>
                </div>
              ))}
            </div>
            <div className="bg-[#c8f542]/5 border border-[#c8f542]/20 rounded-xl p-4">
              <p className="text-[#c8f542] text-xs font-semibold uppercase tracking-wider mb-3">Comissão Vendedor</p>
              <p className="text-white font-bold text-xl">{fmt(detail.sellerCommission)}</p>
              <p className="text-gray-500 text-xs mt-1">{detail.sellerRule}</p>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4">
              <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">Comissão Gerente</p>
              <p className="text-white font-bold text-xl">{fmt(detail.managerCommission)}</p>
              <p className="text-gray-500 text-xs mt-1">{detail.managerRule}</p>
            </div>
            <button onClick={() => setModal(null)} className="w-full bg-[#c8f542] text-black font-semibold py-2.5 rounded-xl text-sm">
              Fechar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
