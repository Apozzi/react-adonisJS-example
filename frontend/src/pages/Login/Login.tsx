import { useState } from "react";
import { DollarSign, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Field from "../../components/Field/Field";
import { inputCls } from "../../utils/format";

export default function Login() {
  const { users, login } = useApp();
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [show, setShow]     = useState(false);
  const [err, setErr]       = useState("");

  const submit = () => {
    const u = users.find((u) => u.email === email && u.password === pass);
    if (u) login(u);
    else setErr("E-mail ou senha inválidos.");
  };

  return (
    <div className="min-h-screen bg-[#080a0f] flex items-center justify-center relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#c8f542]/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#c8f542]/4 blur-[140px]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative w-full max-w-sm px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
              bg-[#c8f542] mb-5 shadow-[0_0_40px_rgba(200,245,66,0.3)]"
          >
            <DollarSign size={28} className="text-black" />
          </div>
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Comissões
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Sistema de gestão de comissionamento
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1117] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col gap-4">
            <Field label="E-mail">
              <input
                className={inputCls}
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErr(""); }}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
            </Field>

            <Field label="Senha">
              <div className="relative">
                <input
                  className={`${inputCls} w-full pr-10`}
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => { setPass(e.target.value); setErr(""); }}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
                <button
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>

            {err && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <AlertCircle size={12} /> {err}
              </p>
            )}

            <button
              onClick={submit}
              className="mt-2 w-full bg-[#c8f542] text-black font-bold py-3 rounded-xl
                hover:bg-[#d4f75e] transition-all
                shadow-[0_0_20px_rgba(200,245,66,0.2)] hover:shadow-[0_0_30px_rgba(200,245,66,0.35)]"
            >
              Entrar
            </button>
          </div>

          <p className="text-gray-600 text-xs text-center mt-5">
            admin@comissoes.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
