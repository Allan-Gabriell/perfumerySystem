import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RelatorioApi } from "../services/api";
import { API_URL, formatarRelatorio } from "../services/api";

export default function RelatorioVendas() {
  const navigate = useNavigate();

  const [relatorio, setRelatorio] = useState("");
  const [titulo, setTitulo] = useState("Relatórios do sistema");
  const [tipoAtivo, setTipoAtivo] = useState<"vendas" | "produtos" | "">("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function gerarRelatorioVendas() {
    try {
      setCarregando(true);
      setErro("");
      setTitulo("Relatório de vendas");
      setTipoAtivo("vendas");

      const response = await fetch(`${API_URL}/relatorios/vendas`);

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório de vendas.");
      }

      const data: RelatorioApi = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível carregar o relatório de vendas. Verifique se o back-end está rodando e se existem vendas cadastradas."
      );
      setRelatorio("");
    } finally {
      setCarregando(false);
    }
  }

  async function gerarRelatorioProdutos() {
    try {
      setCarregando(true);
      setErro("");
      setTitulo("Relatório de produtos");
      setTipoAtivo("produtos");

      const response = await fetch(`${API_URL}/relatorios/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório de produtos.");
      }

      const data: RelatorioApi = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível carregar o relatório de produtos. Verifique se o back-end está rodando e se existem produtos cadastrados."
      );
      setRelatorio("");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.kicker}>Análise gerencial</span>

          <h1 style={styles.title}>{titulo}</h1>

         
        </div>

        <div style={styles.heroActions}>
          <button
            style={styles.secondaryButton}
            onClick={() => navigate("/dashboard")}
          >
            ← Voltar
          </button>

          <button
            style={styles.primaryButton}
            onClick={() => navigate("/vendas/registrar")}
          >
            Nova venda
          </button>
        </div>
      </section>

      <section style={styles.metrics}>
      

     
      </section>

      <section style={styles.actionsPanel}>
        <div>
          <span style={styles.panelTag}>Gerar relatório</span>
          <h2 style={styles.panelTitle}>Escolha o tipo de consulta</h2>
          <p style={styles.panelText}>
            Os dados exibidos são retornados pelo back-end. Caso não existam
            registros no banco, o relatório pode vir vazio ou zerado.
          </p>
        </div>

        <div style={styles.actions}>
          <button
            style={
              tipoAtivo === "vendas"
                ? styles.primaryButton
                : styles.secondaryButton
            }
            onClick={gerarRelatorioVendas}
            disabled={carregando}
          >
            Relatório de vendas
          </button>

          <button
            style={
              tipoAtivo === "produtos"
                ? styles.primaryButton
                : styles.secondaryButton
            }
            onClick={gerarRelatorioProdutos}
            disabled={carregando}
          >
            Relatório de produtos
          </button>
        </div>
      </section>

      {erro && <div style={styles.warning}>{erro}</div>}

      <section style={styles.reportBox}>
        <div style={styles.reportHeader}>
          <div>
            <span style={styles.panelTag}>Resultado</span>
            <h2 style={styles.reportTitle}>{titulo}</h2>
          </div>

          <div style={styles.statusBadge}>
            {carregando ? "Carregando" : relatorio ? "Gerado" : "Aguardando"}
          </div>
        </div>

        {carregando ? (
          <div style={styles.emptyBox}>Carregando relatório...</div>
        ) : relatorio ? (
          <pre style={styles.pre}>{relatorio}</pre>
        ) : (
          <div style={styles.emptyBox}>
            Nenhum relatório gerado ainda. Clique em uma das opções acima para
            consultar os dados do back-end.
          </div>
        )}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 8%, rgba(212,175,55,0.22), transparent 30%), radial-gradient(circle at 90% 88%, rgba(255,255,255,0.85), transparent 30%), linear-gradient(135deg, #f4ecd8 0%, #fffdf7 46%, #ead9aa 100%)",
    color: "#2a1e0a",
    padding: 24,
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },

  hero: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    padding: "34px",
    borderRadius: 36,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 24,
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,249,232,0.88))",
    border: "1px solid rgba(176,141,47,0.26)",
    boxShadow: "0 30px 80px rgba(91,62,8,0.13)",
  },

  heroText: {
    maxWidth: 760,
  },

  kicker: {
    display: "inline-flex",
    padding: "8px 13px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.3,
    marginBottom: 16,
  },

  title: {
    margin: 0,
    fontSize: "clamp(42px, 6vw, 68px)",
    lineHeight: 0.95,
    letterSpacing: -2.8,
    color: "#2a1e0a",
  },

  subtitle: {
    maxWidth: 740,
    margin: "18px 0 0",
    color: "#7b6a42",
    fontSize: 17,
    lineHeight: 1.7,
  },

  heroActions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  primaryButton: {
    border: "none",
    borderRadius: 999,
    padding: "13px 20px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 16px 38px rgba(166,124,0,0.22)",
  },

  secondaryButton: {
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "13px 20px",
    background: "rgba(255,255,255,0.72)",
    color: "#5f4513",
    fontWeight: 900,
    cursor: "pointer",
  },

  metrics: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },

  metricCard: {
    padding: 20,
    borderRadius: 26,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.90), rgba(255,249,232,0.74))",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 18px 45px rgba(91,62,8,0.08)",
  },

  metricLabel: {
    display: "block",
    color: "#9a8654",
    fontSize: 12,
    fontWeight: 900,
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 8,
  },

  metricValueSmall: {
    color: "#2a1e0a",
    fontSize: 21,
    lineHeight: 1,
    textTransform: "capitalize",
  },

  actionsPanel: {
    maxWidth: 1180,
    margin: "0 auto 22px",
    padding: 24,
    borderRadius: 30,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,232,0.78))",
    border: "1px solid rgba(176,141,47,0.20)",
    boxShadow: "0 20px 55px rgba(91,62,8,0.10)",
  },

  panelTag: {
    display: "block",
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  panelTitle: {
    margin: 0,
    color: "#2a1e0a",
    fontSize: 28,
    letterSpacing: -1,
  },

  panelText: {
    maxWidth: 620,
    margin: "9px 0 0",
    color: "#7b6a42",
    lineHeight: 1.65,
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  warning: {
    maxWidth: 1180,
    margin: "0 auto 20px",
    padding: 18,
    borderRadius: 18,
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.22)",
    color: "#991b1b",
    boxShadow: "0 18px 45px rgba(91,62,8,0.06)",
  },

  reportBox: {
    maxWidth: 1180,
    margin: "0 auto",
    minHeight: 340,
    padding: 26,
    borderRadius: 32,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  reportHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 20,
  },

  reportTitle: {
    margin: 0,
    color: "#2a1e0a",
    fontSize: 30,
    letterSpacing: -1,
  },

  statusBadge: {
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(212,175,55,0.13)",
    border: "1px solid rgba(212,175,55,0.25)",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },

  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#5f4513",
    fontFamily: "inherit",
    lineHeight: 1.85,
    fontSize: 15,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(176,141,47,0.16)",
    borderRadius: 22,
    padding: 20,
  },

  emptyBox: {
    padding: 20,
    borderRadius: 22,
    background: "rgba(212,175,55,0.10)",
    border: "1px solid rgba(212,175,55,0.22)",
    color: "#7b6a42",
    lineHeight: 1.7,
  },
};