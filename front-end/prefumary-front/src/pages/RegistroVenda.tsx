import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Produto { nome: string; preco: number }

const produtosDisponiveis: Produto[] = [
  { nome: 'Floratta Rose', preco: 89.90 },
  { nome: 'Malbec Gold', preco: 149.90 },
  { nome: 'Una Intenso', preco: 199.90 },
  { nome: 'Glamour', preco: 79.90 },
]

export default function RegistroVenda() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')
  const [itens, setItens] = useState<Produto[]>([])
  const [desconto, setDesconto] = useState(0)

  const resultados = produtosDisponiveis.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) && busca.length > 0
  )

  function adicionarItem(p: Produto) {
    setItens([...itens, p])
    setBusca('')
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index))
  }

  const subtotal = itens.reduce((acc, p) => acc + p.preco, 0)
  const total = subtotal - (subtotal * desconto / 100)

  function finalizar() {
    if (itens.length === 0) return alert('Adicione ao menos um produto!')
    alert(`Venda finalizada! Total: R$ ${total.toFixed(2)}`)
    setItens([])
    setDesconto(0)
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>🛒 Registro de venda</span>
          <button style={styles.navBtn} onClick={() => navigate('/produtos')}>← Produtos</button>
        </div>
        <div style={styles.body}>
          <label style={styles.label}>Buscar produto</label>
          <input style={styles.input} placeholder="Nome do produto..." value={busca} onChange={e => setBusca(e.target.value)} />
          {resultados.length > 0 && (
            <div style={styles.dropdown}>
              {resultados.map((p, i) => (
                <div key={i} style={styles.dropItem} onClick={() => adicionarItem(p)}>
                  {p.nome} — R$ {p.preco.toFixed(2)}
                </div>
              ))}
            </div>
          )}
          <p style={styles.sectionTitle}>Itens da venda</p>
          {itens.length === 0 && <p style={{ color: '#aaa', fontSize: 13 }}>Nenhum item adicionado</p>}
          {itens.map((p, i) => (
            <div key={i} style={styles.produtoRow}>
              <div>
                <div style={{ fontWeight: 500 }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: '#888' }}>R$ {p.preco.toFixed(2)}</div>
              </div>
              <button onClick={() => removerItem(i)} style={styles.removeBtn}>✕</button>
            </div>
          ))}
          <label style={{ ...styles.label, marginTop: 14 }}>Desconto (%)</label>
          <input style={styles.input} type="number" min="0" max="100" placeholder="0" value={desconto || ''} onChange={e => setDesconto(Number(e.target.value))} />
          <div style={styles.totalBar}>
            <span style={{ color: '#666' }}>Total</span>
            <span style={{ fontSize: 18, fontWeight: 500 }}>R$ {total.toFixed(2)}</span>
          </div>
          <button style={styles.btn} onClick={finalizar}>Finalizar venda</button>
        </div>
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
  label: { display: 'block', fontSize: 12, color: '#666', marginBottom: 4 },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginBottom: 14, outline: 'none', boxSizing: 'border-box' },
  dropdown: { background: '#fff', border: '1px solid #ddd', borderRadius: 8, marginTop: -10, marginBottom: 14, overflow: 'hidden' },
  dropItem: { padding: '10px 12px', fontSize: 13, cursor: 'pointer', borderBottom: '1px solid #f0f0f0' },
  sectionTitle: { fontSize: 14, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 },
  produtoRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' },
  removeBtn: { background: 'none', border: 'none', color: '#aaa', fontSize: 16, cursor: 'pointer' },
  totalBar: { background: '#f5f5f5', borderRadius: 8, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 },
  btn: { width: '100%', padding: 10, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer', marginTop: 12 },
}