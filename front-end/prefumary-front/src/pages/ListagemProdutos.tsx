import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Produto { nome: string; marca: string; categoria: string; preco: number }

const produtosMock: Produto[] = [
  { nome: 'Floratta Rose', marca: 'O Boticário', categoria: 'Perfume Feminino', preco: 89.90 },
  { nome: 'Malbec Gold', marca: 'O Boticário', categoria: 'Perfume Masculino', preco: 149.90 },
  { nome: 'Una Intenso', marca: 'O Boticário', categoria: 'Perfume Unissex', preco: 199.90 },
  { nome: 'Glamour', marca: 'O Boticário', categoria: 'Body Splash', preco: 79.90 },
  { nome: 'Lily', marca: 'O Boticário', categoria: 'Perfume Feminino', preco: 119.90 },
]

export default function ListagemProdutos() {
  const navigate = useNavigate()
  const [busca, setBusca] = useState('')

  const filtrados = produtosMock.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.marca.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>📦 Listagem de produtos</span>
          <button style={styles.navBtn} onClick={() => navigate('/produtos')}>+ Novo produto</button>
        </div>
        <div style={styles.body}>
          <input style={styles.input} placeholder="🔍  Buscar produto ou marca..." value={busca} onChange={e => setBusca(e.target.value)} />
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Nome</th>
                <th style={styles.th}>Marca</th>
                <th style={styles.th}>Categoria</th>
                <th style={styles.th}>Preço</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((p, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{p.nome}</td>
                  <td style={styles.td}>{p.marca}</td>
                  <td style={styles.td}><span style={styles.badge}>{p.categoria}</span></td>
                  <td style={styles.td}>R$ {p.preco.toFixed(2)}</td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: '#aaa', fontSize: 13 }}>Nenhum produto encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 700, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 15, fontWeight: 500 },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '20px' },
  input: { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, marginBottom: 16, outline: 'none', boxSizing: 'border-box' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  thead: { background: '#f9f9f9' },
  th: { padding: '10px 12px', textAlign: 'left', color: '#666', fontWeight: 500, borderBottom: '1px solid #eee' },
  td: { padding: '10px 12px', color: '#333' },
  trEven: { background: '#fff' },
  trOdd: { background: '#fafafa' },
  badge: { background: '#EEEDFE', color: '#3C3489', fontSize: 11, padding: '2px 8px', borderRadius: 6 },
}