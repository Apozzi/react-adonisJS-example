import { useState } from 'react'
import { DollarSign, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Field } from '../../components/UI'
import { inputCls, extractErrorMessage } from '../../utils/format'
import './Login.css'

export default function Login() {
  const { login } = useApp()
  const [email, setEmail] = useState('')
  const [pass, setPass]       = useState('')
  const [show, setShow]       = useState(false)
  const [err, setErr]         = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!email || !pass) { setErr('Preencha e-mail e senha.'); return }
    setLoading(true); setErr('')
    try {
      await login(email, pass)
    } catch (e) {
      setErr(extractErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-bg-wrapper">
        <div className="login-glow-top" />
        <div className="login-glow-bottom" />
        <div className="login-grid-bg" />
      </div>
      <div className="login-content-wrapper">
        <div className="login-header">
          <div className="login-logo-box">
            <DollarSign size={28} className="login-logo-icon" />
          </div>
          <h1 className="login-title">Comissões</h1>
          <p className="login-subtitle">Sistema de gestão de comissionamento</p>
        </div>
        <div className="login-form-card">
          <div className="login-form-group">
            <Field label="E-mail">
              <input className={`${inputCls} w-full`} type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => { setEmail(e.target.value); setErr('') }}
                onKeyDown={(e) => e.key === 'Enter' && submit()} />
            </Field>
            <Field label="Senha">
              <div className="login-password-wrapper">
                <input className={`${inputCls} login-password-input`} type={show ? 'text' : 'password'} placeholder="••••••••"
                  value={pass} onChange={(e) => { setPass(e.target.value); setErr('') }}
                  onKeyDown={(e) => e.key === 'Enter' && submit()} />
                <button onClick={() => setShow(!show)} className="login-password-toggle">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>
            {err && <p className="login-error-msg"><AlertCircle size={12} />{err}</p>}
            <button onClick={submit} disabled={loading}
              className="login-submit-btn">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}