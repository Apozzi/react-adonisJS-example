import { useState } from 'react'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { Seller } from '../../types'
import { useApp } from '../../context/AppContext'
import { sellersService } from '../../services/sellers.service'
import { useAsync } from '../../hooks/useAsync'
import Modal from '../../components/Modal/Modal'
import { Field, Spinner, ErrorMsg } from '../../components/UI'
import { fmt, inputCls, extractErrorMessage } from '../../utils/format'

export default function Vendedores() {
  const { showToast } = useApp()
  const { data: sellers, loading, error, refetch } = useAsync(() => sellersService.list())

  const [modal, setModal]     = useState<'add' | 'edit' | null>(null)
  const [editing, setEditing] = useState<Seller | null>(null)
  const [saving, setSaving]   = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', managerId: '' as string, fixedCommission: 0, percentCommission: 0, active: true })

  const managers = (sellers ?? []).filter((s) => s.managerId === null && s.active)

  const openAdd = () => {
    setForm({ name: '', email: '', managerId: '', fixedCommission: 0, percentCommission: 0, active: true })
    setModal('add')
  }
  const openEdit = (s: Seller) => {
    setEditing(s)
    setForm({ name: s.name, email: s.email, managerId: s.managerId ? String(s.managerId) : '', fixedCommission: s.fixedCommission, percentCommission: s.percentCommission, active: s.active })
    setModal('edit')
  }

  const save = async () => {
    if (!form.name || !form.email) { showToast('Preencha nome e e-mail.', 'error'); return }
    setSaving(true)
    try {
      const payload = { name: form.name, email: form.email, managerId: form.managerId ? Number(form.managerId) : null, fixedCommission: Number(form.fixedCommission), percentCommission: Number(form.percentCommission), active: form.active }
      if (modal === 'add') {
        await sellersService.create(payload)
        showToast('Vendedor cadastrado!', 'success')
      } else if (editing) {
        await sellersService.update(editing.id, payload)
        showToast('Vendedor atualizado!', 'success')
      }
      refetch(); setModal(null)
    } catch (e) { showToast(extractErrorMessage(e), 'error') }
    finally { setSaving(false) }
  }

  const toggle = async (s: Seller) => {
    try { await sellersService.update(s.id, { active: !s.active }); refetch() }
    catch (e) { showToast(extractErrorMessage(e), 'error') }
  }

  const remove = async (id: number) => {
    try { await sellersService.delete(id); showToast('Vendedor removido.', 'success'); refetch() }
    catch (e) { showToast(extractErrorMessage(e), 'error') }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMsg message={error} />

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Vendedores</h2>
          <p className="text-gray-500 text-sm mt-0.5">Regras de comissão por vendedor</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-[#c8f542] text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d4f75e] transition-all text-sm">
          <Plus size={16} /> Novo Vendedor
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {(sellers ?? []).map((s) => {
          const manager = (sellers ?? []).find((m) => m.id === s.managerId)
          return (
            <div key={s.id} className={`bg-[#0f1117] border rounded-2xl p-5 flex items-center gap-5 transition-all ${s.active ? 'border-white/8 hover:border-[#c8f542]/20' : 'border-white/4 opacity-50'}`}>
              <div className="w-11 h-11 rounded-xl bg-[#c8f542]/10 flex items-center justify-center flex-shrink-0">
                <span className="text-[#c8f542] font-bold text-lg">{s.name?.[0] || '?'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-semibold">{s.name}</p>
                  {!s.active && <span className="bg-red-500/15 text-red-400 text-xs px-2 py-0.5 rounded-lg">Inativo</span>}
                  {s.managerId === null && <span className="bg-purple-500/15 text-purple-400 text-xs px-2 py-0.5 rounded-lg">Gerente</span>}
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{s.email}</p>
                {manager && <p className="text-gray-600 text-xs mt-0.5">Gerente: {manager.name}</p>}
              </div>
              <div className="flex gap-6 text-center flex-shrink-0">
                <div><p className="text-[#c8f542] font-bold text-sm">{fmt(s.fixedCommission)}</p><p className="text-gray-600 text-xs">Fixo</p></div>
                <div><p className="text-[#c8f542] font-bold text-sm">{s.percentCommission}%</p><p className="text-gray-600 text-xs">% Venda</p></div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggle(s)} className={`p-2 rounded-lg transition-all ${s.active ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-gray-600 hover:bg-white/5'}`}>
                  {s.active ? <Check size={14} /> : <X size={14} />}
                </button>
                <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"><Edit2 size={14} /></button>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        })}
        {(sellers ?? []).length === 0 && <p className="text-center text-gray-600 py-10 text-sm">Nenhum vendedor cadastrado.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Novo Vendedor' : 'Editar Vendedor'} onClose={() => setModal(null)}>
          <div className="flex flex-col gap-4">
            <Field label="Nome"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="E-mail"><input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Gerente (opcional)">
              <select className={inputCls} value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
                <option value="">Nenhum (é gerente)</option>
                {managers.filter((m) => m.id !== editing?.id).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Comissão Fixa (R$)"><input className={inputCls} type="number" min={0} value={form.fixedCommission} onChange={(e) => setForm({ ...form, fixedCommission: Number(e.target.value) })} /></Field>
              <Field label="% por Venda"><input className={inputCls} type="number" min={0} step={0.1} value={form.percentCommission} onChange={(e) => setForm({ ...form, percentCommission: Number(e.target.value) })} /></Field>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setForm({ ...form, active: !form.active })} className={`w-10 h-5 rounded-full transition-all relative ${form.active ? 'bg-[#c8f542]' : 'bg-white/10'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow ${form.active ? 'right-0.5' : 'left-0.5'}`} />
              </button>
              <span className="text-gray-400 text-sm">Vendedor ativo</span>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all">Cancelar</button>
              <button onClick={save} disabled={saving} className="flex-1 bg-[#c8f542] text-black font-semibold py-2.5 rounded-xl text-sm disabled:opacity-60">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
