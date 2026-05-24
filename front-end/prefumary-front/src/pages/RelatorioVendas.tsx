import { useNavigate } from 'react-router-dom'

const vendas = [
  { data: '24/05/2025', cliente: 'Maria Silva', produtos: 'Floratta Rose, Glamour', total: 169.80 },
  { data: '23/05/2025', cliente: 'João Santos', produtos: 'Malbec Gold', total: 149.90 },
  { data: '22/05/2025', cliente: 'Ana Lima', produtos: 'Una Intenso', total: 199.90 },
  { data: '20/05/2025', cliente: 'Carlos Souza', produtos: 'Lily, Glamour', total: 199.80 },
]

export default function RelatorioVendas() {
  const navigate = useNavigate()
  const total = vendas.reduce((acc, v) => acc + v.total, 0)

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>📊 Relatório de vendas</span>
          <button style={styles.navBtn} onClick={() => navigate('/dashboard')}>← Voltar</button>
        </div>
        <div style={styles.body}>
          <div style={styles.cards}>
            <div style={styles.card}>
              <div style={styles.cardLabel}>Total de vendas</div>
              <div style={styles.cardValue}>{vendas.length}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardLabel}>Faturamento</div>
              <div style={styles.cardValue}>R$ {total.toFixed(2)}</div>
            </div>
            <div style={styles.card}>
              <div style={styles.cardLabel}>Ticket médio</div>
              <div style={styles.cardValue}>R$ {(total / vendas.length).toFixed(2)}</div>
            </div>
          </div>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Data</th>
                <th style={styles.th}>Cliente</th>
                <th style={styles.th}>Produtos</th>
                <th style={styles.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((v, i) => (
                <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                  <td style={styles.td}>{v.data}</td>
                  <td style={styles.td}>{v.cliente}</td>
                  <td style={styles.td}>{v.produtos}</td>
                  <td style={styles.td}><strong>R$ {v.total.toFixed(2)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 720, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 15, fontWeight: 500 },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '20px' },
  cards: { display: 'flex', gap: 12, marginBottom: 20 },
  card: { flex: 1, background: '#f9f9f9', borderRadius: 10, padding: '14px 16px' },
  cardLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
  cardValue: { fontSize: 20, fontWeight: 500, color: '#534AB7' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 13 },
  thead: { background: '#f9f9f9' },
  th: { padding: '10px 12px', textAlign: 'left', color: '#666', fontWeight: 500, borderBottom: '1px solid #eee' },
  td: { padding: '10px 12px', color: '#333' },
  trEven: { background: '#fff' },
  trOdd: { background: '#fafafa' },
}