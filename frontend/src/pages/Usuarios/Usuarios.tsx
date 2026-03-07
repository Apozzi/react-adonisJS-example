import { useState } from "react";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { User } from "../../types";
import { useApp } from "../../context/AppContext";
import Modal from "../../components/Modal/Modal";
import Field from "../../components/Field/Field";
import { inputCls } from "../../utils/format";

export default function Usuarios() {
  const { users, setUsers, showToast } = useApp();

  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm]       = useState({
    name: "", email: "", role: "viewer" as "admin" | "viewer", password: "",
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm({ name: "", email: "", role: "viewer", password: "" });
    setModal("add");
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, role: u.role, password: u.password });
    setModal("edit");
  };

  const save = () => {
    if (!form.name || !form.email || !form.password) {
      showToast("Preencha todos os campos.", "error");
      return;
    }
    if (modal === "add") {
      setUsers([
        ...users,
        { id: `u${Date.now()}`, ...form, createdAt: new Date().toISOString().split("T")[0] },
      ]);
      showToast("Usuário criado!", "success");
    } else if (editing) {
      setUsers(users.map((u) => (u.id === editing.id ? { ...u, ...form } : u)));
      showToast("Usuário atualizado!", "success");
    }
    setModal(null);
  };

  const remove = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    showToast("Usuário removido.", "success");
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-2xl font-bold">Usuários</h2>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie os acessos ao sistema</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-[#c8f542] text-black font-semibold
            px-4 py-2.5 rounded-xl hover:bg-[#d4f75e] transition-all text-sm"
        >
          <Plus size={16} /> Novo Usuário
        </button>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          className={`${inputCls} w-full pl-9`}
          placeholder="Buscar usuário..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[#0f1117] border border-white/8 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/8">
              {["Nome", "E-mail", "Perfil", "Criado em", "Ações"].map((h) => (
                <th key={h} className="text-left text-gray-500 text-xs font-medium uppercase tracking-wider px-5 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-all">
                <td className="px-5 py-4 text-white text-sm font-medium">{u.name}</td>
                <td className="px-5 py-4 text-gray-400 text-sm">{u.email}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium
                      ${u.role === "admin"
                        ? "bg-[#c8f542]/15 text-[#c8f542]"
                        : "bg-blue-500/15 text-blue-400"
                      }`}
                  >
                    {u.role === "admin" ? "Admin" : "Visualizador"}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-sm">{u.createdAt}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(u)} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => remove(u.id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-600 py-10 text-sm">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <Modal
          title={modal === "add" ? "Novo Usuário" : "Editar Usuário"}
          onClose={() => setModal(null)}
        >
          <div className="flex flex-col gap-4">
            <Field label="Nome">
              <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="E-mail">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Senha">
              <input className={inputCls} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </Field>
            <Field label="Perfil">
              <select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "viewer" })}>
                <option value="viewer">Visualizador</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 border border-white/10 text-gray-400 py-2.5 rounded-xl text-sm hover:bg-white/5 transition-all">
                Cancelar
              </button>
              <button onClick={save} className="flex-1 bg-[#c8f542] text-black font-semibold py-2.5 rounded-xl text-sm hover:bg-[#d4f75e] transition-all">
                Salvar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
