import { useState } from 'react'
import { Plus, Trash2, AlertCircle } from 'lucide-react'
import { usersService } from '../../services/users.service'
import { useAsync } from '../../hooks/useAsync'
import { useApp } from '../../context/AppContext'
import Modal from '../../components/Modal/Modal'
import { Field, Spinner, ErrorMsg } from '../../components/UI'
import { inputCls, extractErrorMessage } from '../../utils/format'

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
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Usuários</h2>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie os acessos ao sistema</p>
        </div>
        <button onClick={openModal}
          className="flex items-center gap-2 bg-[#c8f542] text-black font-semibold px-4 py-2.5 rounded-xl hover:bg-[#d4f75e] transition-all text-sm">
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(users ?? []).map((u) => {
          const isSelf = u.id === currentUser?.id
          const initials = u.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
            ?? u.email?.[0].toUpperCase()

          return (
            <div key={u.id} className="bg-[#0f1117] border border-white/8 rounded-2xl p-6 flex flex-col gap-5 hover:border-white/15 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#c8f542]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#c8f542] text-lg font-bold">{initials}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold truncate">{u.fullName ?? '—'}</p>
                      {isSelf && (
                        <span className="bg-[#c8f542]/15 text-[#c8f542] text-xs px-2 py-0.5 rounded-lg flex-shrink-0">Você</span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs truncate mt-0.5">{u.email}</p>
                  </div>
                </div>

                {!isSelf && (
                  <button onClick={() => confirmRemove(u.id, u.fullName ?? u.email)}
                    className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 cursor-pointer">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>

              <div className="bg-white/4 rounded-xl p-3">
                <p className="text-gray-500 text-xs">Cadastrado em</p>
                <p className="text-white font-medium text-sm mt-0.5">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : '—'}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {(users ?? []).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-sm">Nenhum usuário encontrado.</p>
        </div>
      )}

      {modal && (
        <Modal title="Novo Usuário" onClose={() => setModal(false)}>
          <div className="flex flex-col gap-4">
            <Field label="Nome completo">
              <input className={inputCls} placeholder="João Silva" value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
            </Field>
            <Field label="E-mail">
              <input className={inputCls} type="email" placeholder="joao@email.com" value={form.email}
                onChange={(e) => { setForm({ ...form, email: e.target.value }); setFormErr('') }} />
            </Field>
            <Field label="Senha">
              <input className={inputCls} type="password" placeholder="Mínimo 8 caracteres" value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setFormErr('') }} />
            </Field>

            {formErr && (
              <p className="text-red-400 text-xs flex items-center gap-1.5">
                <AlertCircle size={12} />{formErr}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(false)}
                className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#c8f542] text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-[#d4f75e] transition-all disabled:opacity-60">
                {saving ? 'Criando...' : 'Criar Usuário'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {deleteModal && (
        <Modal title="Excluir Usuário" onClose={() => setDeleteModal(null)}>
          <div className="flex flex-col gap-4">
            <p className="text-gray-300 text-sm">
              Tem certeza que deseja remover o usuário <strong className="text-white">{deleteModal.name}</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setDeleteModal(null)}
                className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button onClick={handleRemove} disabled={deleting}
                className="flex-1 bg-red-500/10 text-red-500 font-semibold py-2.5 rounded-xl text-sm hover:bg-red-500/20 transition-all disabled:opacity-60">
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}