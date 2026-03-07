import { useState } from 'react'
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react'
import { Seller } from '../../types'
import { useApp } from '../../context/AppContext'
import { sellersService } from '../../services/sellers.service'
import { useAsync } from '../../hooks/useAsync'
import Modal from '../../components/Modal/Modal'
import Field from '../../components/Field/Field'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg'
import { fmt, inputCls, extractErrorMessage } from '../../utils/format'
import './Vendedores.css'

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
    <div className="vendedores-container">
      <div className="vendedores-header">
        <div>
          <h2 className="vendedores-title">Vendedores</h2>
          <p className="vendedores-subtitle">Regras de comissão por vendedor</p>
        </div>
        <button onClick={openAdd} className="vendedores-new-btn">
          <Plus size={16} /> Novo Vendedor
        </button>
      </div>

      <div className="vendedores-grid">
        {(sellers ?? []).map((s) => {
          const manager = (sellers ?? []).find((m) => m.id === s.managerId)
          return (
            <div key={s.id} className={`vendedores-card ${s.active ? 'vendedores-card-active' : 'vendedores-card-inactive'}`}>
              <div className="vendedores-avatar">
                <span className="vendedores-avatar-text">{s.name?.[0] || '?'}</span>
              </div>
              <div className="vendedores-info-wrapper">
                <div className="vendedores-name-row">
                  <p className="vendedores-name">{s.name}</p>
                  {!s.active && <span className="vendedores-tag-inactive">Inativo</span>}
                  {s.managerId === null && <span className="vendedores-tag-manager">Gerente</span>}
                </div>
                <p className="vendedores-email">{s.email}</p>
                {manager && <p className="vendedores-manager-name">Gerente: {manager.name}</p>}
              </div>
              <div className="vendedores-stats-wrapper">
                <div><p className="vendedores-stat-val">{fmt(s.fixedCommission)}</p><p className="vendedores-stat-label">Fixo</p></div>
                <div><p className="vendedores-stat-val">{s.percentCommission}%</p><p className="vendedores-stat-label">% Venda</p></div>
              </div>
              <div className="vendedores-actions-wrapper">
                <button onClick={() => toggle(s)} className={`vendedores-action-btn-toggle ${s.active ? 'vendedores-action-toggle-on' : 'vendedores-action-toggle-off'}`}>
                  {s.active ? <Check size={14} /> : <X size={14} />}
                </button>
                <button onClick={() => openEdit(s)} className="vendedores-action-edit"><Edit2 size={14} /></button>
                <button onClick={() => remove(s.id)} className="vendedores-action-del"><Trash2 size={14} /></button>
              </div>
            </div>
          )
        })}
        {(sellers ?? []).length === 0 && <p className="vendedores-empty-text">Nenhum vendedor cadastrado.</p>}
      </div>

      {modal && (
        <Modal title={modal === 'add' ? 'Novo Vendedor' : 'Editar Vendedor'} onClose={() => setModal(null)}>
          <div className="vendedores-form-group">
            <Field label="Nome"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="E-mail"><input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
            <Field label="Gerente (opcional)">
              <select className={inputCls} value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
                <option value="">Nenhum (é gerente)</option>
                {managers.filter((m) => m.id !== editing?.id).map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </Field>
            <div className="vendedores-form-grid">
              <Field label="Comissão Fixa (R$)"><input className={inputCls} type="number" min={0} value={form.fixedCommission} onChange={(e) => setForm({ ...form, fixedCommission: Number(e.target.value) })} /></Field>
              <Field label="% por Venda"><input className={inputCls} type="number" min={0} step={0.1} value={form.percentCommission} onChange={(e) => setForm({ ...form, percentCommission: Number(e.target.value) })} /></Field>
            </div>
            <div className="vendedores-toggle-wrapper">
              <button onClick={() => setForm({ ...form, active: !form.active })} className={`vendedores-toggle-btn ${form.active ? 'vendedores-toggle-btn-on' : 'vendedores-toggle-btn-off'}`}>
                <span className={`vendedores-toggle-knob ${form.active ? 'vendedores-toggle-knob-on' : 'vendedores-toggle-knob-off'}`} />
              </button>
              <span className="vendedores-toggle-label">Vendedor ativo</span>
            </div>
            <div className="vendedores-modal-actions">
              <button onClick={() => setModal(null)} className="vendedores-cancel-btn">Cancelar</button>
              <button onClick={save} disabled={saving} className="vendedores-submit-btn">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
