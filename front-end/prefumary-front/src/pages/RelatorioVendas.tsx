import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  RelatorioApi,
} from "../services/api";
import {
  API_URL,
  formatarRelatorio,
} from "../services/api";

export default function RelatorioVendas() {
  const navigate = useNavigate();

  const [relatorio, setRelatorio] = useState("");
  const [titulo, setTitulo] = useState("Relatórios do sistema");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function gerarRelatorioVendas() {
    try {
      setCarregando(true);
      setErro("");
      setTitulo("Relatório de vendas");

      const response = await fetch(`${API_URL}/relatorios/vendas`);

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório de vendas.");
      }

      const data: RelatorioApi = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar o relatório de vendas.");
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

      const response = await fetch(`${API_URL}/relatorios/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório de produtos.");
      }

      const data: RelatorioApi = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar o relatório de produtos.");
      setRelatorio("");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>{titulo}</h1>
            <p style={styles.subtitle}>
              Consulta das rotas GET /relatorios/vendas e GET /relatorios/produtos.
            </p>
          </div>

          <button style={styles.secondaryButton} onClick={() => navigate("/dashboard")}>
            ← Voltar
          </button>
        </header>

        <div style={styles.actions}>
          <button style={styles.primaryButton} onClick={gerarRelatorioVendas}>
            Gerar relatório de vendas
          </button>

          <button style={styles.primaryButton} onClick={gerarRelatorioProdutos}>
            Gerar relatório de produtos
          </button>
        </div>

        {erro && <div style={styles.warning}>{erro}</div>}

        <section style={styles.reportBox}>
          {carregando ? (
            <p>Carregando relatório...</p>
          ) : relatorio ? (
            <pre style={styles.pre}>{relatorio}</pre>
          ) : (
            <p style={styles.empty}>Nenhum relatório gerado ainda.</p>
          )}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(14,165,233,0.24), transparent 35%), linear-gradient(135deg, #020617, #07111f, #000)",
    color: "#fff",
    padding: 24,
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  title: {
    margin: 0,
    fontSize: 36,
  },
  subtitle: {
    color: "#94a3b8",
    margin: "6px 0 0",
  },
  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  primaryButton: {
    border: "none",
    borderRadius: 999,
    padding: "12px 18px",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#020617",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: 999,
    padding: "12px 18px",
    background: "rgba(15,23,42,0.8)",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
  },
  reportBox: {
    minHeight: 280,
    background: "rgba(15,23,42,0.86)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
  },
  pre: {
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#dbeafe",
    fontFamily: "inherit",
    lineHeight: 1.8,
  },
  empty: {
    color: "#94a3b8",
  },
  warning: {
    padding: 18,
    borderRadius: 16,
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(248,113,113,0.28)",
    color: "#fecaca",
    marginBottom: 18,
  },
};