import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      titulo: "Produtos",
      texto: "Visualizar produtos cadastrados no sistema.",
      rota: "/produtos",
    },
    {
      titulo: "Cadastrar produto",
      texto: "Inserir novos produtos no catálogo.",
      rota: "/produtos/cadastrar",
    },
    {
      titulo: "Registrar venda",
      texto: "Criar uma venda com produtos cadastrados.",
      rota: "/vendas/registrar",
    },
    {
      titulo: "Relatório de vendas",
      texto: "Acompanhar métricas e histórico de vendas.",
      rota: "/relatorios/vendas",
    },
    {
      titulo: "Cadastrar cliente",
      texto: "Adicionar clientes ao sistema.",
      rota: "/clientes/cadastrar",
    },
    {
      titulo: "Cadastrar promoção",
      texto: "Criar promoções vinculadas a um gerente.",
      rota: "/promocoes/cadastrar",
    },
  ];

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Aura Blue</h1>
            <p style={styles.subtitle}>Painel administrativo da perfumaria</p>
          </div>

          <button style={styles.logout} onClick={() => navigate("/login")}>
            Sair
          </button>
        </header>

        <div style={styles.grid}>
          {cards.map((card) => (
            <article key={card.rota} style={styles.card}>
              <h2 style={styles.cardTitle}>{card.titulo}</h2>
              <p style={styles.cardText}>{card.texto}</p>

              <button style={styles.button} onClick={() => navigate(card.rota)}>
                Acessar
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(14,165,233,0.28), transparent 35%), linear-gradient(135deg, #020617, #07111f, #000)",
    color: "#fff",
    padding: 24,
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    margin: 0,
    fontSize: 38,
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#94a3b8",
  },
  logout: {
    border: "1px solid rgba(148,163,184,0.25)",
    background: "rgba(15,23,42,0.8)",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 999,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 18,
  },
  card: {
    background: "rgba(15,23,42,0.82)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 22,
  },
  cardText: {
    color: "#cbd5e1",
    lineHeight: 1.6,
  },
  button: {
    border: "none",
    borderRadius: 999,
    padding: "12px 18px",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#020617",
    fontWeight: 900,
    cursor: "pointer",
  },
};