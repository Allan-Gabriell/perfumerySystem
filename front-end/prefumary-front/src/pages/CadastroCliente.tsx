import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CadastroCliente() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', cpf: '', telefone: '', email: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    alert(`Cliente "${form.nome}" cadastrado com sucesso!`)
    setForm({ nome: '', cpf: '', telefone: '', email: '' })
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>👤 Cadastro de cliente</span>
          <button style={styles.navBtn} onClick={() => navigate('/produtos')}>← Voltar</button>
        </div>
        <form onSubmit={handleSalvar} style={styles.body}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Nome completo</label>
              <input style={styles.input} name="nome" placeholder="Ex: Maria Silva" value={form.nome} onChange={handleChange} required />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>CPF</label>
              <input style={styles.input} name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Telefone</label>
              <input style={styles.input} name="telefone" placeholder="(00) 00000-0000" value={form.telefone} onChange={handleChange} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>E-mail</label>
              <input style={styles.input} name="email" placeholder="email@exemplo.com" value={form.email} onChange={handleChange} />
            </div>
          </div>
          <button style={styles.btn} type="submit">Salvar cliente</button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 15, fontWeight: 500 },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '24px 20px' },
  row: { display: 'flex', gap: 12 },
  col: { flex: 1 },
  label: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: 10, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4 },
}