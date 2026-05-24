import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CadastroPromocao() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', produto: '', desconto: '', inicio: '', fim: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    alert(`Promoção "${form.nome}" cadastrada com ${form.desconto}% de desconto!`)
    setForm({ nome: '', produto: '', desconto: '', inicio: '', fim: '' })
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>🏷️ Cadastro de promoção</span>
          <button style={styles.navBtn} onClick={() => navigate('/vendas')}>← Voltar</button>
        </div>
        <form onSubmit={handleSalvar} style={styles.body}>
          <label style={styles.label}>Nome da promoção</label>
          <input style={styles.input} name="nome" placeholder="Ex: Dia das Mães" value={form.nome} onChange={handleChange} required />

          <label style={styles.label}>Produto</label>
          <select style={styles.input} name="produto" value={form.produto} onChange={handleChange}>
            <option value="">Selecionar produto</option>
            <option>Floratta Rose</option>
            <option>Malbec Gold</option>
            <option>Una Intenso</option>
            <option>Glamour</option>
            <option>Lily</option>
          </select>

          <label style={styles.label}>Desconto (%)</label>
          <input style={styles.input} name="desconto" type="number" min="1" max="100" placeholder="Ex: 15" value={form.desconto} onChange={handleChange} required />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Data início</label>
              <input style={styles.input} name="inicio" type="date" value={form.inicio} onChange={handleChange} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Data fim</label>
              <input style={styles.input} name="fim" type="date" value={form.fim} onChange={handleChange} />
            </div>
          </div>

          <button style={styles.btn} type="submit">Salvar promoção</button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 480, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 15, fontWeight: 500 },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '24px 20px' },
  row: { display: 'flex', gap: 12 },
  col: { flex: 1 },
  label: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn: { width: '100%', padding: 10, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4 },
}