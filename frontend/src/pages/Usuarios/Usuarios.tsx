import { usersService } from '../../services/users.service'
import { useAsync } from '../../hooks/useAsync'
import { Spinner, ErrorMsg } from '../../components/UI'
import { fmtDate } from '../../utils/format'

export default function Usuarios() {
  const { data: users, loading, error } = useAsync(() => usersService.list())

  if (loading) return <Spinner />
  if (error) return <ErrorMsg message={error} />

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h2 className="text-white text-2xl font-bold">Usuários</h2>
        <p className="text-gray-500 text-sm mt-0.5">Lista de todos os usuários do sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(users ?? []).map((u) => (
          <div key={u.id} className="bg-[#0f1117] border border-white/8 rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#c8f542]/15 flex items-center justify-center flex-shrink-0">
                <span className="text-[#c8f542] text-xl font-bold">{u.fullName?.charAt(0) || '?'}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold truncate">{u.fullName ?? '—'}</p>
                <p className="text-gray-500 text-xs truncate">{u.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                ['ID', String(u.id)],
                ['Cadastro', fmtDate(u.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="bg-white/4 rounded-xl p-3">
                  <p className="text-gray-500 text-xs">{k}</p>
                  <p className="text-white font-medium text-sm mt-0.5 truncate">{v}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {(users ?? []).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">Nenhum usuário encontrado.</p>
        </div>
      )}
    </div>
  )
}
