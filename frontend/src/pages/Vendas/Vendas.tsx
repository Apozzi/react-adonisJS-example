import { useState, useEffect } from 'react'
import { Plus, Eye, Trash2, Search } from 'lucide-react'
import { Sale, CommissionPreview } from '../../types'
import { useApp } from '../../context/AppContext'
import { salesService } from '../../services/sales.service'
import { sellersService } from '../../services/sellers.service'
import { useAsync } from '../../hooks/useAsync'
import Modal from '../../components/Modal/Modal'
import Field from '../../components/Field/Field'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg'
import { fmt, fmtDate, inputCls, extractErrorMessage } from '../../utils/format'
import './Vendas.css'

export default function Vendas() {
  const { showToast } = useApp()
  const { data: sales, loading, error, refetch } = useAsync(() => salesService.list())
  const { data: sellers } = useAsync(() => sellersService.list(true))

  const [modal, setModal]       = useState<'add' | 'detail' | null>(null)
  const [detail, setDetail]     = useState<Sale | null>(null)
  const [search, setSearch]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [preview, setPreview]   = useState<CommissionPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [form, setForm] = useState({ sellerId: '', vehicleModel: '', saleValue: 0, saleDate: new Date().toISOString().split('T')[0] })

  // Fetch commission preview from backend whenever sellerId or saleValue changes
  useEffect(() => {
    if (!form.sellerId || form.saleValue <= 0) { setPreview(null); return }
    const t = setTimeout(async () => {
      setPreviewLoading(true)
      try {
        const p = await salesService.previewCommission(Number(form.sellerId), form.saleValue)
        setPreview(p)
      } catch { setPreview(null) }
      finally { setPreviewLoading(false) }
    }, 400)
    return () => clearTimeout(t)
  }, [form.sellerId, form.saleValue])

  const openAdd = () => {
    setForm({ sellerId: '', vehicleModel: '', saleValue: 0, saleDate: new Date().toISOString().split('T')[0] })
    setPreview(null); setModal('add')
  }

  const save = async () => {
    if (!form.sellerId || !form.vehicleModel || !form.saleValue) { showToast('Preencha todos os campos.', 'error'); return }
    setSaving(true)
    try {
      await salesService.create({ sellerId: Number(form.sellerId), vehicleModel: form.vehicleModel, saleValue: form.saleValue, saleDate: form.saleDate })
      showToast('Venda registrada e comissões calculadas!', 'success')
      refetch(); setModal(null)
    } catch (e) { showToast(extractErrorMessage(e), 'error') }
    finally { setSaving(false) }
  }

  const remove = async (id: number) => {
    try { await salesService.delete(id); showToast('Venda removida.', 'success'); refetch() }
    catch (e) { showToast(extractErrorMessage(e), 'error') }
  }

  const filtered = (sales ?? []).filter((s) => {
    const sellerName = s.seller?.name ?? ''
    return sellerName.toLowerCase().includes(search.toLowerCase()) || s.vehicleModel.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) return <Spinner />
  if (error) return <ErrorMsg message={error} />

  return (
    <div className="vendas-container">
      <div className="vendas-header">
        <div>
          <h2 className="vendas-title">Vendas</h2>
          <p className="vendas-subtitle">Registro e comissões calculadas automaticamente pelo backend</p>
        </div>
        <button onClick={openAdd} className="vendas-new-btn">
          <Plus size={16} /> Nova Venda
        </button>
      </div>

      <div className="vendas-search-wrapper">
        <Search size={15} className="vendas-search-icon" />
        <input className={`${inputCls} vendas-search-input`} placeholder="Buscar por vendedor ou veículo..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="vendas-table-wrapper">
        <table className="vendas-table">
          <thead>
            <tr className="vendas-thead-tr">
              {['Data', 'Veículo', 'Vendedor', 'Valor Venda', 'Com. Vendedor', 'Com. Gerente', 'Ações'].map((h) => (
                <th key={h} className="vendas-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 50).map((s) => (
              <tr key={s.id} className="vendas-tr">
                <td className="vendas-td-date">{fmtDate(s.saleDate)}</td>
                <td className="vendas-td-model">{s.vehicleModel}</td>
                <td className="vendas-td-seller">{s.seller?.name ?? '—'}</td>
                <td className="vendas-td-value">{fmt(Number(s.saleValue))}</td>
                <td className="vendas-td-com-seller">{fmt(Number(s.sellerCommission))}</td>
                <td className="vendas-td-com-manager">{fmt(Number(s.managerCommission))}</td>
                <td className="vendas-td-actions">
                  <div className="vendas-actions-wrapper">
                    <button onClick={() => { setDetail(s); setModal('detail') }} className="vendas-action-view"><Eye size={13} /></button>
                    <button onClick={() => remove(s.id)} className="vendas-action-del"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="vendas-empty-td">Nenhuma venda encontrada.</td></tr>}
          </tbody>
        </table>
      </div>

      {modal === 'add' && (
        <Modal title="Registrar Venda" onClose={() => setModal(null)}>
          <div className="vendas-form-group">
            <Field label="Vendedor">
              <select className={inputCls} value={form.sellerId} onChange={(e) => setForm({ ...form, sellerId: e.target.value })}>
                <option value="">Selecionar...</option>
                {(sellers ?? []).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Veículo"><input className={inputCls} placeholder="Ex: Civic 2024" value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} /></Field>
            <div className="vendas-form-grid">
              <Field label="Valor da Venda (R$)"><input className={inputCls} type="number" min={0} value={form.saleValue || ''} onChange={(e) => setForm({ ...form, saleValue: Number(e.target.value) })} /></Field>
              <Field label="Data"><input className={inputCls} type="date" value={form.saleDate} onChange={(e) => setForm({ ...form, saleDate: e.target.value })} /></Field>
            </div>

            {previewLoading && <p className="vendas-preview-loading">Calculando comissão...</p>}
            {preview && !previewLoading && (
              <div className="vendas-preview-box">
                <p className="vendas-preview-title">Prévia do Comissionamento (via API)</p>
                <div className="vendas-preview-grid">
                  <div><p className="vendas-preview-label">Comissão Vendedor</p><p className="vendas-preview-value">{fmt(Number(preview.sellerCommission))}</p></div>
                  <div><p className="vendas-preview-label">Comissão Gerente</p><p className="vendas-preview-value">{fmt(Number(preview.managerCommission))}</p></div>
                </div>
                <p className="vendas-preview-rule">{preview.sellerRule}</p>
              </div>
            )}

            <div className="vendas-modal-actions">
              <button onClick={() => setModal(null)} className="vendas-cancel-btn">Cancelar</button>
              <button onClick={save} disabled={saving} className="vendas-submit-btn">
                {saving ? 'Registrando...' : 'Registrar Venda'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'detail' && detail && (
        <Modal title="Detalhes da Venda" onClose={() => setModal(null)}>
          <div className="vendas-form-group">
            <div className="vendas-form-grid">
              {([['Veículo', detail.vehicleModel], ['Data', fmtDate(detail.saleDate)], ['Valor', fmt(Number(detail.saleValue))], ['Vendedor', detail.seller?.name ?? '—']] as [string, string][]).map(([k, v]) => (
                <div key={k} className="vendas-detail-box"><p className="vendas-detail-label">{k}</p><p className="vendas-detail-val">{v}</p></div>
              ))}
            </div>
            <div className="vendas-com-seller-box">
              <p className="vendas-com-seller-title">Comissão Vendedor</p>
              <p className="vendas-com-val">{fmt(Number(detail.sellerCommission))}</p>
              <p className="vendas-com-rule">{detail.sellerRule}</p>
            </div>
            <div className="vendas-com-mgr-box">
              <p className="vendas-com-mgr-title">Comissão Gerente</p>
              <p className="vendas-com-val">{fmt(Number(detail.managerCommission))}</p>
              <p className="vendas-com-rule">{detail.managerRule}</p>
            </div>
            <button onClick={() => setModal(null)} className="vendas-close-btn">Fechar</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
