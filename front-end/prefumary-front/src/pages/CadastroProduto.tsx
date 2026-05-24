import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CadastroProduto() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', marca: '', categoria: '', preco: '', descricao: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSalvar(e: React.FormEvent) {
    e.preventDefault()
    alert(`Produto "${form.nome}" cadastrado com sucesso!`)
    setForm({ nome: '', marca: '', categoria: '', preco: '', descricao: '' })
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>🏷️ Cadastro de produto</span>
          <button style={styles.navBtn} onClick={() => navigate('/vendas')}>Ir para Vendas →</button>
        </div>
        <form onSubmit={handleSalvar} style={styles.body}>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Nome do produto</label>
              <input style={styles.input} name="nome" placeholder="Ex: Perfume Floratta" value={form.nome} onChange={handleChange} />
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Marca</label>
              <input style={styles.input} name="marca" placeholder="Ex: O Boticário" value={form.marca} onChange={handleChange} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Categoria</label>
              <select style={styles.input} name="categoria" value={form.categoria} onChange={handleChange}>
                <option value="">Selecionar</option>
                <option>Perfume Feminino</option>
                <option>Perfume Masculino</option>
                <option>Perfume Unissex</option>
                <option>Body Splash</option>
                <option>Hidratante</option>
              </select>
            </div>
            <div style={styles.col}>
              <label style={styles.label}>Preço (R$)</label>
              <input style={styles.input} name="preco" placeholder="0,00" value={form.preco} onChange={handleChange} />
            </div>
          </div>
          <label style={styles.label}>Descrição</label>
          <textarea style={{ ...styles.input, height: 80, resize: 'none' }} name="descricao" placeholder="Descreva o produto..." value={form.descricao} onChange={handleChange} />
          <button style={styles.btn} type="submit">Salvar produto</button>
        </form>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 560, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '24px 20px' },
  row: { display: 'flex', gap: 12, marginBottom: 0 },
  col: { flex: 1 },
  label: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  btn: { width: '100%', padding: 10, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 4 },
}