import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  ItemCarrinho,
  Produto,
  ProdutoApi,
} from "../services/api";
import {
  API_URL,
  converterProdutoApi,
  formatarPreco,
} from "../services/api";

export default function RegistroVenda() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [busca, setBusca] = useState("");
  const [numeroVenda, setNumeroVenda] = useState(0);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setErro("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos.");
      }

      const data: ProdutoApi[] = await response.json();
      setProdutos(data.map(converterProdutoApi));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os produtos do back-end.");
      setProdutos([]);
    }
  }

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) return produtos;

    return produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(termo)
    );
  }, [produtos, busca]);

  const subtotal = useMemo(() => {
    return carrinho.reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    );
  }, [carrinho]);

  const desconto = subtotal >= 250 ? subtotal * 0.15 : 0;
  const total = subtotal - desconto;

  function adicionarAoCarrinho(produto: Produto) {
    setCarrinho((itens) => {
      const existente = itens.find((item) => item.produto.id === produto.id);

      if (existente) {
        return itens.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [...itens, { produto, quantidade: 1 }];
    });
  }

  function removerDoCarrinho(produtoId: number) {
    setCarrinho((itens) =>
      itens
        .map((item) =>
          item.produto.id === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
  }

  function finalizarVenda() {
    if (carrinho.length === 0) {
      alert("Adicione pelo menos um produto.");
      return;
    }

    alert(`Venda #${numeroVenda} finalizada.\nTotal: ${formatarPreco(total)}`);

    setNumeroVenda((numero) => numero + 1);
    setCarrinho([]);
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Registro de venda</h1>
            <p style={styles.subtitle}>Monte uma venda com produtos cadastrados.</p>
          </div>

          <button style={styles.secondaryButton} onClick={() => navigate("/dashboard")}>
            ← Voltar
          </button>
        </header>

        {erro && <div style={styles.warning}>{erro}</div>}

        <div style={styles.layout}>
          <section style={styles.panel}>
            <div style={styles.searchArea}>
              <input
                style={styles.input}
                placeholder="Buscar produto..."
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />

              <button style={styles.primaryButton} onClick={buscarProdutos}>
                Atualizar
              </button>
            </div>

            <div style={styles.productList}>
              {produtosFiltrados.length === 0 ? (
                <div style={styles.empty}>Nenhum produto encontrado.</div>
              ) : (
                produtosFiltrados.map((produto) => (
                  <article key={produto.id} style={styles.productRow}>
                    <div>
                      <strong>{produto.nome}</strong>
                      <p>{produto.categoria} · {formatarPreco(produto.preco)}</p>
                    </div>

                    <button
                      style={styles.primaryButton}
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      Adicionar
                    </button>
                  </article>
                ))
              )}
            </div>
          </section>

          <aside style={styles.panel}>
            <h2>Venda #{numeroVenda}</h2>

            {carrinho.length === 0 ? (
              <div style={styles.empty}>Nenhum item no carrinho.</div>
            ) : (
              <div style={styles.cartItems}>
                {carrinho.map((item) => (
                  <div key={item.produto.id} style={styles.cartItem}>
                    <div>
                      <strong>{item.produto.nome}</strong>
                      <p>{formatarPreco(item.produto.preco)} cada</p>
                    </div>

                    <div style={styles.quantity}>
                      <button onClick={() => removerDoCarrinho(item.produto.id)}>-</button>
                      <span>{item.quantidade}</span>
                      <button onClick={() => adicionarAoCarrinho(item.produto)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.summaryLine}>
              <span>Subtotal</span>
              <strong>{formatarPreco(subtotal)}</strong>
            </div>

            <div style={styles.summaryLine}>
              <span>Desconto</span>
              <strong>{formatarPreco(desconto)}</strong>
            </div>

            <div style={styles.totalLine}>
              <span>Total</span>
              <strong>{formatarPreco(total)}</strong>
            </div>

            <button
              style={styles.checkoutButton}
              disabled={carrinho.length === 0}
              onClick={finalizarVenda}
            >
              Finalizar venda
            </button>
          </aside>
        </div>
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
    maxWidth: 1100,
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
  layout: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    gap: 20,
  },
  panel: {
    background: "rgba(15,23,42,0.86)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 24,
    padding: 24,
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
  },
  searchArea: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  input: {
    flex: 1,
    minWidth: 220,
    padding: "13px 15px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.22)",
    background: "rgba(2,6,23,0.9)",
    color: "#fff",
    outline: "none",
  },
  productList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  productRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    background: "rgba(2,6,23,0.48)",
    border: "1px solid rgba(148,163,184,0.12)",
  },
  primaryButton: {
    border: "none",
    borderRadius: 999,
    padding: "11px 16px",
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
  empty: {
    padding: 16,
    borderRadius: 16,
    background: "rgba(14,165,233,0.12)",
    border: "1px solid rgba(125,211,252,0.25)",
    color: "#dbeafe",
  },
  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 18,
  },
  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    background: "rgba(2,6,23,0.48)",
  },
  quantity: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  summaryLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(148,163,184,0.14)",
    color: "#cbd5e1",
  },
  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "18px 0",
    fontSize: 22,
  },
  checkoutButton: {
    width: "100%",
    border: "none",
    borderRadius: 999,
    padding: "14px 18px",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#020617",
    fontWeight: 900,
    cursor: "pointer",
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