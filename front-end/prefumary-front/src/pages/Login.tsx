import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (usuario && senha) {
      navigate('/dashboard')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <div style={styles.logoCircle}>💧</div>
          <h2 style={styles.title}>Perfumaria</h2>
          <p style={styles.subtitle}>Faça login para continuar</p>
        </div>
        <form onSubmit={handleLogin}>
          <label style={styles.label}>Usuário</label>
          <input
            style={styles.input}
            placeholder="Digite seu usuário"
            value={usuario}
            onChange={e => setUsuario(e.target.value)}
          />
          <label style={styles.label}>Senha</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={e => setSenha(e.target.value)}
          />
          <button style={styles.btn} type="submit">Entrar</button>
        </form>
        <p style={styles.footer}>Acesso restrito a funcionários</p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' },
  card: { background: '#fff', borderRadius: 12, padding: '32px 28px', width: '100%', maxWidth: 360, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  logoArea: { textAlign: 'center', marginBottom: 24 },
  logoCircle: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 20, fontWeight: 500, color: '#1a1a1a' },
  subtitle: { fontSize: 13, color: '#888', marginTop: 4 },
  label: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: 10, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4 },
  footer: { textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 16 }
}