import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  Produto,
  ProdutoApi,
} from "../services/api";
import {
  API_URL,
  converterProdutoApi,
  formatarPreco,
} from "../services/api";

export default function ListagemProdutos() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setCarregando(true);
      setErroApi("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Não foi possível carregar os produtos.");
      }

      const data: ProdutoApi[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API.");
      }

      setProdutos(data.map(converterProdutoApi));
    } catch (error) {
      console.error(error);
      setProdutos([]);
      setErroApi("Não foi possível conectar ao back-end.");
    } finally {
      setCarregando(false);
    }
  }

  const categorias = useMemo(() => {
    const lista = produtos.map((produto) => produto.categoria).filter(Boolean);
    return ["Todos", ...Array.from(new Set(lista))];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return produtos.filter((produto) => {
      const correspondeBusca =
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo) ||
        produto.marca.toLowerCase().includes(termo) ||
        produto.descricao.toLowerCase().includes(termo);

      const correspondeCategoria =
        categoria === "Todos" || produto.categoria === categoria;

      return correspondeBusca && correspondeCategoria;
    });
  }, [produtos, busca, categoria]);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Produtos cadastrados</h1>
          <p style={styles.subtitle}>Produtos carregados da rota GET /produtos.</p>
        </div>

        <div style={styles.headerActions}>
          <button style={styles.secondaryButton} onClick={() => navigate("/dashboard")}>
            ← Voltar
          </button>

          <button style={styles.primaryButton} onClick={() => navigate("/produtos/cadastrar")}>
            Novo produto
          </button>
        </div>
      </header>

      <section style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Buscar produto..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />

        <select
          style={styles.input}
          value={categoria}
          onChange={(event) => setCategoria(event.target.value)}
        >
          {categorias.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button style={styles.primaryButton} onClick={buscarProdutos}>
          Atualizar
        </button>
      </section>

      {erroApi && <div style={styles.warning}>{erroApi}</div>}

      {carregando ? (
        <div style={styles.warning}>Carregando produtos...</div>
      ) : produtosFiltrados.length === 0 ? (
        <div style={styles.warning}>Nenhum produto cadastrado no sistema.</div>
      ) : (
        <section style={styles.grid}>
          {produtosFiltrados.map((produto) => (
            <article key={produto.id} style={styles.card}>
              <div style={styles.imageBox}>
                <img src={produto.imagem} alt={produto.nome} style={styles.image} />
              </div>

              <div style={styles.content}>
                <div style={styles.cardTop}>
                  <span style={styles.category}>{produto.categoria}</span>
                  <small style={styles.brand}>{produto.marca}</small>
                </div>

                <h2 style={styles.productName}>{produto.nome}</h2>
                <p style={styles.description}>{produto.descricao}</p>

                <strong style={styles.price}>{formatarPreco(produto.preco)}</strong>
              </div>
            </article>
          ))}
        </section>
      )}
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
  header: {
    maxWidth: 1150,
    margin: "0 auto 24px",
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: 36,
  },
  subtitle: {
    color: "#94a3b8",
    margin: "6px 0 0",
  },
  headerActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  filters: {
    maxWidth: 1150,
    margin: "0 auto 22px",
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },
  input: {
    padding: "13px 15px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(15,23,42,0.9)",
    color: "#fff",
    outline: "none",
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
  warning: {
    maxWidth: 1150,
    margin: "0 auto 20px",
    padding: 18,
    borderRadius: 16,
    background: "rgba(14,165,233,0.12)",
    border: "1px solid rgba(125,211,252,0.25)",
    color: "#dbeafe",
  },
  grid: {
    maxWidth: 1150,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },
  card: {
    background: "rgba(15,23,42,0.86)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 24,
    overflow: "hidden",
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
  },
  imageBox: {
    height: 250,
    overflow: "hidden",
    background: "#020617",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    padding: 20,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  },
  category: {
    color: "#7dd3fc",
    fontWeight: 900,
    fontSize: 12,
    textTransform: "uppercase",
  },
  brand: {
    color: "#94a3b8",
  },
  productName: {
    margin: "10px 0",
  },
  description: {
    color: "#cbd5e1",
    lineHeight: 1.6,
  },
  price: {
    fontSize: 22,
  },
};