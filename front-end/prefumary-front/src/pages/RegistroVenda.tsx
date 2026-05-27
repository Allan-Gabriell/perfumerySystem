import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ItemCarrinho, Produto, ProdutoApi } from "../services/api";
import { API_URL, converterProdutoApi, formatarPreco } from "../services/api";

export default function RegistroVenda() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [busca, setBusca] = useState("");
  const [clienteId, setClienteId] = useState("1");
  const [vendedorId, setVendedorId] = useState("1");
  const [numeroVenda, setNumeroVenda] = useState(0);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [salvandoVenda, setSalvandoVenda] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setCarregandoProdutos(true);
      setErro("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao buscar produtos.");
      }

      const data: ProdutoApi[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Resposta inválida da API.");
      }

      setProdutos(data.map(converterProdutoApi));
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os produtos do back-end.");
      setProdutos([]);
    } finally {
      setCarregandoProdutos(false);
    }
  }

  const produtosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) return produtos;

    return produtos.filter((produto) => {
      return (
        produto.nome.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo) ||
        produto.marca.toLowerCase().includes(termo)
      );
    });
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

    setMensagem("");
    setErro("");
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

  function limparVenda() {
    setCarrinho([]);
    setBusca("");
    setMensagem("");
    setErro("");
  }

  async function finalizarVenda() {
    if (carrinho.length === 0) {
      setErro("Adicione pelo menos um produto à venda.");
      setMensagem("");
      return;
    }

    if (!clienteId || !vendedorId) {
      setErro("Informe o ID do cliente e o ID do vendedor.");
      setMensagem("");
      return;
    }

    try {
      setSalvandoVenda(true);
      setErro("");
      setMensagem("");

      const vendaRequest = {
        clienteId: Number(clienteId),
        vendedorId: Number(vendedorId),
        itens: carrinho.map((item) => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade,
        })),
      };

      const response = await fetch(`${API_URL}/vendas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendaRequest),
      });

      if (!response.ok) {
        const respostaErro = await response.text();
        throw new Error(respostaErro || "Erro ao registrar venda.");
      }

      setMensagem(
        `Venda #${numeroVenda} registrada com sucesso. Total: ${formatarPreco(
          total
        )}`
      );

      setNumeroVenda((numero) => numero + 1);
      setCarrinho([]);
      setBusca("");
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível registrar a venda. Verifique se clienteId, vendedorId e produtoId existem no banco."
      );
    } finally {
      setSalvandoVenda(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div>
          <span style={styles.kicker}>Registro de venda</span>

          <h1 style={styles.title}>Nova venda</h1>

          <p style={styles.subtitle}>
            Monte a venda usando produtos cadastrados no back-end, informe cliente
            e vendedor, e finalize o pedido pelo sistema.
          </p>
        </div>

        <div style={styles.heroActions}>
          <button style={styles.secondaryButton} onClick={() => navigate("/dashboard")}>
            ← Voltar
          </button>

          <button style={styles.primaryButton} onClick={() => navigate("/produtos")}>
            Ver produtos
          </button>
        </div>
      </section>

      <section style={styles.metrics}>
        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Produtos carregados</span>
          <strong style={styles.metricValue}>{produtos.length}</strong>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Itens na venda</span>
          <strong style={styles.metricValue}>{carrinho.length}</strong>
        </article>

        <article style={styles.metricCard}>
          <span style={styles.metricLabel}>Total atual</span>
          <strong style={styles.metricValueSmall}>{formatarPreco(total)}</strong>
        </article>
      </section>

      {erro && <div style={styles.errorBox}>{erro}</div>}
      {mensagem && <div style={styles.successBox}>{mensagem}</div>}

      <section style={styles.layout}>
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <span style={styles.panelTag}>Catálogo</span>
              <h2 style={styles.panelTitle}>Produtos disponíveis</h2>
            </div>

            <button style={styles.refreshButton} onClick={buscarProdutos}>
              Atualizar
            </button>
          </div>

          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>⌕</span>

            <input
              style={styles.searchInput}
              placeholder="Buscar por nome, marca ou categoria..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />
          </div>

          {carregandoProdutos ? (
            <div style={styles.empty}>Carregando produtos...</div>
          ) : produtosFiltrados.length === 0 ? (
            <div style={styles.empty}>Nenhum produto encontrado.</div>
          ) : (
            <div style={styles.productList}>
              {produtosFiltrados.map((produto) => (
                <article key={produto.id} style={styles.productRow}>
                  <div style={styles.productInfo}>
                    <div style={styles.productImageBox}>
                      <img
                        src={produto.imagem}
                        alt={produto.nome}
                        style={styles.productImage}
                      />
                    </div>

                    <div>
                      <strong style={styles.productName}>{produto.nome}</strong>

                      <p style={styles.productMeta}>
                        {produto.categoria} · {produto.marca}
                      </p>

                      <span style={styles.productPrice}>
                        {formatarPreco(produto.preco)}
                      </span>
                    </div>
                  </div>

                  <button
                    style={styles.smallButton}
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    Adicionar
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>

        <aside style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <span style={styles.panelTag}>Pedido</span>
              <h2 style={styles.panelTitle}>Venda #{numeroVenda}</h2>
            </div>

            {carrinho.length > 0 && (
              <button style={styles.clearButton} onClick={limparVenda}>
                Limpar
              </button>
            )}
          </div>

          <div style={styles.idGrid}>
            <div>
              <label style={styles.label}>ID do cliente</label>
              <input
                style={styles.input}
                type="number"
                min="1"
                value={clienteId}
                onChange={(event) => setClienteId(event.target.value)}
              />
            </div>

            <div>
              <label style={styles.label}>ID do vendedor</label>
              <input
                style={styles.input}
                type="number"
                min="1"
                value={vendedorId}
                onChange={(event) => setVendedorId(event.target.value)}
              />
            </div>
          </div>

          {carrinho.length === 0 ? (
            <div style={styles.empty}>Nenhum item no carrinho.</div>
          ) : (
            <div style={styles.cartItems}>
              {carrinho.map((item) => (
                <div key={item.produto.id} style={styles.cartItem}>
                  <div>
                    <strong style={styles.cartName}>{item.produto.nome}</strong>
                    <p style={styles.productMeta}>
                      {formatarPreco(item.produto.preco)} cada
                    </p>
                  </div>

                  <div style={styles.quantity}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => removerDoCarrinho(item.produto.id)}
                    >
                      -
                    </button>

                    <span>{item.quantidade}</span>

                    <button
                      style={styles.quantityButton}
                      onClick={() => adicionarAoCarrinho(item.produto)}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={styles.summary}>
            <div style={styles.summaryLine}>
              <span>Subtotal</span>
              <strong>{formatarPreco(subtotal)}</strong>
            </div>

            <div style={styles.summaryLine}>
              <span>Desconto automático</span>
              <strong>{formatarPreco(desconto)}</strong>
            </div>

            <div style={styles.totalLine}>
              <span>Total</span>
              <strong>{formatarPreco(total)}</strong>
            </div>
          </div>

          <button
            style={styles.checkoutButton}
            disabled={carrinho.length === 0 || salvandoVenda}
            onClick={finalizarVenda}
          >
            {salvandoVenda ? "Registrando..." : "Finalizar venda"}
          </button>
        </aside>
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.94), rgba(255,249,232,0.88))",
    border: "1px solid rgba(176,141,47,0.26)",
    boxShadow: "0 30px 80px rgba(91,62,8,0.13)",
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
    fontSize: "clamp(44px, 6vw, 74px)",
    lineHeight: 0.92,
    letterSpacing: -3,
    color: "#2a1e0a",
  },

  subtitle: {
    maxWidth: 720,
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

  metricValue: {
    color: "#2a1e0a",
    fontSize: 30,
    lineHeight: 1,
  },

  metricValueSmall: {
    color: "#2a1e0a",
    fontSize: 22,
    lineHeight: 1,
  },

  layout: {
    maxWidth: 1180,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(340px, 0.9fr)",
    gap: 22,
    alignItems: "start",
  },

  panel: {
    padding: 24,
    borderRadius: 32,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.94), rgba(255,250,238,0.90))",
    border: "1px solid rgba(176,141,47,0.22)",
    boxShadow: "0 24px 65px rgba(91,62,8,0.12)",
  },

  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    marginBottom: 18,
  },

  panelTag: {
    display: "block",
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },

  panelTitle: {
    margin: 0,
    color: "#2a1e0a",
    fontSize: 28,
    letterSpacing: -1,
  },

  refreshButton: {
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.72)",
    color: "#5f4513",
    fontWeight: 900,
    cursor: "pointer",
  },

  clearButton: {
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "10px 14px",
    background: "rgba(255,255,255,0.72)",
    color: "#5f4513",
    fontWeight: 900,
    cursor: "pointer",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 14px",
    borderRadius: 18,
    border: "1px solid rgba(166,124,0,0.22)",
    background: "#fffef9",
    marginBottom: 18,
  },

  searchIcon: {
    color: "#9f7928",
    fontWeight: 1000,
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#2a1e0a",
    fontSize: 15,
    padding: "15px 0",
  },

  productList: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    maxHeight: 560,
    overflowY: "auto",
    paddingRight: 4,
  },

  productRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    padding: 14,
    borderRadius: 22,
    background: "rgba(255,255,255,0.70)",
    border: "1px solid rgba(176,141,47,0.16)",
  },

  productInfo: {
    display: "flex",
    alignItems: "center",
    gap: 13,
  },

  productImageBox: {
    width: 64,
    height: 64,
    minWidth: 64,
    borderRadius: 18,
    overflow: "hidden",
    background: "#f7f1df",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  productName: {
    display: "block",
    color: "#2a1e0a",
    fontSize: 15,
    marginBottom: 4,
  },

  productMeta: {
    margin: 0,
    color: "#7b6a42",
    fontSize: 12,
    lineHeight: 1.5,
  },

  productPrice: {
    display: "inline-flex",
    marginTop: 4,
    color: "#9f7928",
    fontWeight: 1000,
    fontSize: 14,
  },

  smallButton: {
    border: "none",
    borderRadius: 999,
    padding: "11px 15px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  idGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
    marginBottom: 18,
  },

  label: {
    display: "block",
    marginBottom: 7,
    color: "#5f4513",
    fontSize: 13,
    fontWeight: 900,
  },

  input: {
    width: "100%",
    padding: "13px 15px",
    borderRadius: 16,
    border: "1px solid rgba(166,124,0,0.22)",
    background: "#fffef9",
    color: "#2a1e0a",
    outline: "none",
    fontSize: 15,
    boxSizing: "border-box",
  },

  empty: {
    padding: 16,
    borderRadius: 18,
    background: "rgba(212,175,55,0.12)",
    border: "1px solid rgba(212,175,55,0.24)",
    color: "#5f4513",
    lineHeight: 1.6,
  },

  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginBottom: 18,
  },

  cartItem: {
    padding: 14,
    borderRadius: 20,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(176,141,47,0.16)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  cartName: {
    display: "block",
    color: "#2a1e0a",
  },

  quantity: {
    display: "flex",
    alignItems: "center",
    gap: 9,
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
  },

  summary: {
    marginTop: 18,
    padding: 16,
    borderRadius: 22,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(176,141,47,0.16)",
  },

  summaryLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid rgba(176,141,47,0.16)",
    color: "#7b6a42",
  },

  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "16px 0 4px",
    fontSize: 23,
    color: "#2a1e0a",
  },

  checkoutButton: {
    width: "100%",
    marginTop: 16,
    border: "none",
    borderRadius: 999,
    padding: "15px 18px",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 16px 38px rgba(166,124,0,0.22)",
  },

  errorBox: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    padding: 16,
    borderRadius: 18,
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.22)",
    color: "#991b1b",
  },

  successBox: {
    maxWidth: 1180,
    margin: "0 auto 18px",
    padding: 16,
    borderRadius: 18,
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.24)",
    color: "#166534",
  },
};