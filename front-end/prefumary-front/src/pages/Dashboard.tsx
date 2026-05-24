import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  const menus = [
    { icon: '🏷️', label: 'Cadastro de Produto', path: '/produtos' },
    { icon: '📦', label: 'Listagem de Produtos', path: '/listagem' },
    { icon: '👤', label: 'Cadastro de Cliente', path: '/clientes' },
    { icon: '🕐', label: 'Histórico de Compras', path: '/historico' },
    { icon: '🛒', label: 'Registro de Venda', path: '/vendas' },
    { icon: '🏷️', label: 'Promoções', path: '/promocoes' },
    { icon: '📊', label: 'Relatório de Vendas', path: '/relatorio' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.topbar}>
          <span>💧 Perfumaria — Painel</span>
          <button style={styles.navBtn} onClick={() => navigate('/login')}>Sair</button>
        </div>
        <div style={styles.body}>
          <div style={styles.resumo}>
            <div style={styles.card}><div style={styles.cardLabel}>Vendas hoje</div><div style={styles.cardValue}>4</div></div>
            <div style={styles.card}><div style={styles.cardLabel}>Faturamento</div><div style={styles.cardValue}>R$ 719,40</div></div>
            <div style={styles.card}><div style={styles.cardLabel}>Clientes</div><div style={styles.cardValue}>12</div></div>
            <div style={styles.card}><div style={styles.cardLabel}>Produtos</div><div style={styles.cardValue}>5</div></div>
          </div>
          <p style={styles.sectionTitle}>Acesso rápido</p>
          <div style={styles.grid}>
            {menus.map((m, i) => (
              <button key={i} style={styles.menuBtn} onClick={() => navigate(m.path)}>
                <span style={styles.menuIcon}>{m.icon}</span>
                <span style={styles.menuLabel}>{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 },
  container: { background: '#fff', borderRadius: 12, width: '100%', maxWidth: 680, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' },
  topbar: { background: '#534AB7', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', fontSize: 15, fontWeight: 500 },
  navBtn: { background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 13, cursor: 'pointer' },
  body: { padding: '20px' },
  resumo: { display: 'flex', gap: 12, marginBottom: 24 },
  card: { flex: 1, background: '#f9f9f9', borderRadius: 10, padding: '14px 16px' },
  cardLabel: { fontSize: 12, color: '#888', marginBottom: 6 },
  cardValue: { fontSize: 22, fontWeight: 500, color: '#534AB7' },
  sectionTitle: { fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 12 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 },
  menuBtn: { background: '#f9f9f9', border: '1px solid #eee', borderRadius: 10, padding: '16px 12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 },
  menuIcon: { fontSize: 24 },
  menuLabel: { fontSize: 12, color: '#444', textAlign: 'center' },
}