import { useState } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { usersService } from '../../services/users.service'
import { useAsync } from '../../hooks/useAsync'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/Modal/Modal'
import Field from '../../components/Field/Field'
import Spinner from '../../components/Spinner/Spinner'
import ErrorMsg from '../../components/ErrorMsg/ErrorMsg'
import { inputClass, extractErrorMessage } from '../../utils/format'
import './Usuarios.css'

export default function Usuarios() {
  const { currentUser, showToast } = useApp()
  const { data: users, loading, error, refetch } = useAsync(() => usersService.list())

  const [modal, setModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState<{ id: number, name: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [form, setForm] = useState({ fullName: '', email: '', password: '' })
  const [formErr, setFormErr] = useState('')

  const openModal = () => {
    setForm({ fullName: '', email: '', password: '' })
    setFormErr('')
    setModal(true)
  }

  const save = async () => {
    if (!form.email || !form.password) { setFormErr('E-mail e senha são obrigatórios.'); return }
    if (form.password.length < 8) { setFormErr('Senha deve ter pelo menos 8 caracteres.'); return }
    setSaving(true); setFormErr('')
    try {
      await usersService.create({ fullName: form.fullName || null, email: form.email, password: form.password })
      showToast('Usuário criado!', 'success')
      refetch(); setModal(false)
    } catch (e) {
      setFormErr(extractErrorMessage(e))
    } finally {
      setSaving(false)
    }
  }

  const confirmRemove = (id: number, name: string) => {
    setDeleteModal({ id, name })
  }

  const handleRemove = async () => {
    if (!deleteModal) return
    setDeleting(true)
    try {
      await usersService.delete(deleteModal.id)
      showToast('Usuário removido.', 'success')
      refetch()
      setDeleteModal(null)
    } catch (e) {
      showToast(extractErrorMessage(e), 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMsg message={error} />

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <div>
          <h2 className="usuarios-title">Usuários</h2>
          <p className="usuarios-subtitle">Gerencie os acessos ao sistema</p>
        </div>
        <button onClick={openModal}
          className="usuarios-new-btn">
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="usuarios-grid">
        {(users ?? []).map((u) => {
          const isSelf = u.id === currentUser?.id
          const initials = u.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            ?? u.email?.[0].toUpperCase()

          return (
            <div key={u.id} className="usuarios-card">
              <div className="usuarios-card-header">
                <div className="usuarios-user-info">
                  <div className="usuarios-avatar">
                    <span className="usuarios-avatar-text">{initials}</span>
                  </div>
                  <div className="usuarios-name-wrapper">
                    <div className="usuarios-name-row">
                      <p className="usuarios-name">{u.fullName ?? '—'}</p>
                      {isSelf && (
                        <span className="usuarios-tag-self">Você</span>
                      )}
                    </div>
                    <p className="usuarios-email">{u.email}</p>
                  </div>
                </div>

                {!isSelf && (
                  <button onClick={() => confirmRemove(u.id, u.fullName ?? u.email)}
                    className="usuarios-delete-btn">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="usuarios-info-box">
                <p className="usuarios-info-label">Cadastrado em</p>
                <p className="usuarios-info-value">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {(users ?? []).length === 0 && (
        <div className="usuarios-empty-wrapper">
          <p className="usuarios-empty-text">Nenhum usuário encontrado.</p>
        </div>
      )}

      {modal && (
        <Modal title="Novo Usuário" onClose={() => setModal(false)}>
          <div className="usuarios-form-group">
            <Field label="Nome completo">
              <input className={inputClass} placeholder="João Silva" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </Field>
            <Field label="E-mail">
              <input className={inputClass} type="email" placeholder="joao@email.com" value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormErr('') }} />
            </Field>
            <Field label="Senha">
              <input className={inputClass} type="password" placeholder="Mínimo 8 caracteres" value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setFormErr('') }} />
            </Field>

            {formErr && (
              <p className="usuarios-error-msg">
                <AlertCircle size={12} />{formErr}
              </p>
            )}

            <div className="usuarios-modal-actions">
              <button onClick={() => setModal(false)}
                className="usuarios-cancel-btn">
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                className="usuarios-submit-btn">
                {saving ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteModal && (
        <Modal title="Excluir Usuário" onClose={() => setDeleteModal(null)}>
          <div className="flex flex-col gap-4">
            <p className="usuarios-delete-msg">
              Tem certeza que deseja remover o usuário <strong className="usuarios-delete-highlight">{deleteModal.name}</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div className="usuarios-delete-actions">
              <button onClick={() => setDeleteModal(null)}
                className="usuarios-cancel-btn">
                Cancelar
              </button>
              <button onClick={handleRemove} disabled={deleting}
                className="usuarios-delete-confirm-btn">
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}