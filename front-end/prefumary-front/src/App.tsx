import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:8080";

type ProdutoApi = {
  id?: number;
  idProduto?: number;
  nome: string;
  categoria: string;
  marca: string;
  preco: number;
  descricao: string;
};

type Produto = {
  id: number;
  nome: string;
  categoria: string;
  marca: string;
  preco: number;
  descricao: string;
  imagem: string;
};

type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
};

type RelatorioApi = Record<string, unknown>;

const imagensProdutos = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1629732047848-50219e9c5aef?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=80",
];

const produtosFallback: Produto[] = [
  {
    id: 1,
    nome: "Noir Ocean",
    categoria: "Perfume",
    marca: "Aura Black",
    preco: 229.9,
    descricao: "Fragrância sofisticada com notas oceânicas, madeira nobre e âmbar.",
    imagem: imagensProdutos[0],
  },
  {
    id: 2,
    nome: "Blue Essence",
    categoria: "Perfume",
    marca: "Aura Blue",
    preco: 199.9,
    descricao: "Perfume marcante, elegante e fresco para ocasiões especiais.",
    imagem: imagensProdutos[1],
  },
  {
    id: 3,
    nome: "Hydra Skin",
    categoria: "Hidratante",
    marca: "Aura Care",
    preco: 84.9,
    descricao: "Creme corporal de rápida absorção com hidratação prolongada.",
    imagem: imagensProdutos[2],
  },
  {
    id: 4,
    nome: "Serum Night Glow",
    categoria: "Skincare",
    marca: "Aura Skin",
    preco: 119.9,
    descricao: "Sérum facial leve para hidratação, luminosidade e cuidado noturno.",
    imagem: imagensProdutos[3],
  },
  {
    id: 5,
    nome: "Body Splash Marine",
    categoria: "Body Splash",
    marca: "Aura Blue",
    preco: 74.9,
    descricao: "Body splash fresco, confortável e discreto para uso diário.",
    imagem: imagensProdutos[4],
  },
  {
    id: 6,
    nome: "Kit Black Premium",
    categoria: "Kit Presente",
    marca: "Aura Black",
    preco: 269.9,
    descricao: "Kit premium com fragrância, hidratante e sabonete em embalagem sofisticada.",
    imagem: imagensProdutos[5],
  },
];

function formatarPreco(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function converterProdutoApi(produto: ProdutoApi, index: number): Produto {
  return {
    id: produto.idProduto ?? produto.id ?? index + 1,
    nome: produto.nome || "Produto sem nome",
    categoria: produto.categoria || "Sem categoria",
    marca: produto.marca || "Sem marca",
    preco: Number(produto.preco || 0),
    descricao: produto.descricao || "Produto cadastrado no sistema.",
    imagem: imagensProdutos[index % imagensProdutos.length],
  };
}

function formatarRelatorio(data: RelatorioApi): string {
  if (!data || Object.keys(data).length === 0) {
    return "Nenhum dado encontrado no relatório.";
  }

  return Object.entries(data)
    .map(([chave, valor]) => {
      const nomeCampo = chave
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (letra) => letra.toUpperCase());

      if (typeof valor === "number") {
        const chaveLower = chave.toLowerCase();

        if (
          chaveLower.includes("valor") ||
          chaveLower.includes("total") ||
          chaveLower.includes("preco") ||
          chaveLower.includes("preço")
        ) {
          return `${nomeCampo}: ${formatarPreco(valor)}`;
        }

        return `${nomeCampo}: ${valor}`;
      }

      return `${nomeCampo}: ${String(valor)}`;
    })
    .join("\n");
}

export default function App() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosFallback);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [numeroVenda, setNumeroVenda] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [relatorio, setRelatorio] = useState("");
  const [relatorioTitulo, setRelatorioTitulo] = useState("Relatórios do sistema");

  useEffect(() => {
    buscarProdutos();
  }, []);

  async function buscarProdutos() {
    try {
      setCarregando(true);
      setErroApi("");

      const response = await fetch(`${API_URL}/produtos`);

      if (!response.ok) {
        throw new Error("Não foi possível carregar os produtos da API.");
      }

      const data: ProdutoApi[] = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        setProdutos(produtosFallback);
        setErroApi("A API respondeu, mas não há produtos cadastrados. Exibindo produtos de exemplo.");
        return;
      }

      setProdutos(data.map(converterProdutoApi));
    } catch (error) {
      console.error(error);
      setProdutos(produtosFallback);
      setErroApi("Não foi possível conectar ao back-end. Exibindo produtos de exemplo.");
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

  function finalizarCompra() {
    if (carrinho.length === 0) return;

    alert(
      `Venda #${numeroVenda} finalizada com sucesso!\nTotal: ${formatarPreco(total)}`
    );

    setNumeroVenda((numero) => numero + 1);
    setCarrinho([]);
  }

  async function gerarRelatorioVendas() {
    try {
      setRelatorioTitulo("Relatório de vendas");

      const response = await fetch(`${API_URL}/relatorios/vendas`);

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório de vendas.");
      }

      const data: RelatorioApi = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);

      const quantidadeItens = carrinho.reduce(
        (soma, item) => soma + item.quantidade,
        0
      );

      setRelatorio(
        `RELATÓRIO LOCAL DE VENDAS\n\n` +
          `Vendas finalizadas nesta sessão: ${numeroVenda}\n` +
          `Itens no carrinho atual: ${quantidadeItens}\n` +
          `Subtotal atual: ${formatarPreco(subtotal)}\n` +
          `Desconto atual: ${formatarPreco(desconto)}\n` +
          `Total atual: ${formatarPreco(total)}\n\n` +
          `Observação: não foi possível carregar o relatório do back-end.`
      );
    }
  }

  async function gerarRelatorioProdutos() {
    try {
      setRelatorioTitulo("Relatório de produtos");

      const response = await fetch(`${API_URL}/relatorios/produtos`);

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório de produtos.");
      }

      const data: RelatorioApi = await response.json();
      setRelatorio(formatarRelatorio(data));
    } catch (error) {
      console.error(error);

      if (produtos.length === 0) {
        setRelatorio("Nenhum produto carregado para gerar relatório local.");
        return;
      }

      const produtoMaisCaro = produtos.reduce((maior, produto) =>
        produto.preco > maior.preco ? produto : maior
      );

      const produtoMaisBarato = produtos.reduce((menor, produto) =>
        produto.preco < menor.preco ? produto : menor
      );

      setRelatorio(
        `RELATÓRIO LOCAL DE PRODUTOS\n\n` +
          `Produtos carregados: ${produtos.length}\n` +
          `Categorias disponíveis: ${categorias.length - 1}\n` +
          `Produto mais caro: ${produtoMaisCaro.nome} - ${formatarPreco(produtoMaisCaro.preco)}\n` +
          `Produto mais barato: ${produtoMaisBarato.nome} - ${formatarPreco(produtoMaisBarato.preco)}\n\n` +
          `Observação: não foi possível carregar o relatório do back-end.`
      );
    }
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <a href="#" style={styles.logo}>
          <div style={styles.logoIcon}>A</div>

          <div>
            <h1 style={styles.logoTitle}>Aura Blue</h1>
            <p style={styles.logoSubtitle}>perfumaria & cosméticos</p>
          </div>
        </a>

        <nav style={styles.nav}>
          <a href="#produtos" style={styles.navLink}>Produtos</a>
          <a href="#promocao" style={styles.navLink}>Promoções</a>
          <a href="#carrinho" style={styles.navLink}>Carrinho</a>
          <a href="#relatorios" style={styles.navLink}>Relatórios</a>
          <a href="#sistema" style={styles.navButton}>Sistema</a>
        </nav>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroText}>
          <span style={styles.tag}>Coleção Black & Blue</span>

          <h2 style={styles.heroTitle}>
            Beleza sofisticada com uma experiência de compra simples e elegante.
          </h2>

          <p style={styles.heroDescription}>
            Um catálogo moderno de perfumes, cuidados corporais e skincare, com
            visual premium, integração com API e navegação intuitiva para o cliente.
          </p>

          <div style={styles.actions}>
            <a href="#produtos" style={styles.primaryButton}>Ver produtos</a>
            <a href="#carrinho" style={styles.secondaryButton}>Ir ao carrinho</a>
          </div>
        </div>

        <div style={styles.heroImageBox}>
          <img
            src="https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1000&q=80"
            alt="Perfume elegante"
            style={styles.heroImage}
          />

          <div style={styles.offerCard}>
            <span style={styles.offerSmall}>Oferta especial</span>
            <strong style={styles.offerTitle}>15% OFF</strong>
            <small style={styles.offerText}>em compras acima de R$ 250</small>
          </div>
        </div>
      </section>

      

      <section id="promocao" style={styles.promo}>
        <div>
          <span style={styles.sectionTag}>Promoção ativa</span>
          <h2 style={styles.sectionTitle}>Blue Week</h2>
          <p style={styles.sectionText}>
            A promoção aplica 15% de desconto automaticamente no carrinho em
            compras a partir de R$ 250.
          </p>
        </div>

        <div style={styles.promoBadge}>
          <strong>15%</strong>
          <small>OFF</small>
        </div>
      </section>

      <section id="produtos" style={styles.products}>
        <div style={styles.sectionHeader}>
          <div>
            <span style={styles.sectionTag}>Catálogo</span>
            <h2 style={styles.sectionTitle}>Produtos em destaque</h2>
          </div>

          <div style={styles.filters}>
            <input
              style={styles.input}
              placeholder="Buscar produto..."
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
            />

            <select
              style={styles.select}
              value={categoria}
              onChange={(event) => setCategoria(event.target.value)}
            >
              {categorias.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <button style={styles.filterButton} onClick={buscarProdutos}>
              Atualizar
            </button>
          </div>
        </div>

        {erroApi && <div style={styles.warning}>{erroApi}</div>}

        {carregando ? (
          <div style={styles.warning}>Carregando produtos...</div>
        ) : (
          <div style={styles.productGrid}>
            {produtosFiltrados.map((produto) => (
              <article key={produto.id} style={styles.productCard}>
                <div style={styles.productImageBox}>
                  <img src={produto.imagem} alt={produto.nome} style={styles.productImage} />
                </div>

                <div style={styles.productContent}>
                  <div style={styles.productTop}>
                    <span style={styles.productCategory}>{produto.categoria}</span>
                    <small style={styles.productBrand}>{produto.marca}</small>
                  </div>

                  <h3 style={styles.productName}>{produto.nome}</h3>
                  <p style={styles.productDescription}>{produto.descricao}</p>

                  <div style={styles.productFooter}>
                    <strong style={styles.price}>{formatarPreco(produto.preco)}</strong>
                    <button
                      style={styles.addButton}
                      onClick={() => adicionarAoCarrinho(produto)}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="carrinho" style={styles.cart}>
        <div style={styles.cartPanel}>
          <div style={styles.sectionHeader}>
            <div>
              <span style={styles.sectionTag}>Venda</span>
              <h2 style={styles.sectionTitle}>Carrinho</h2>
            </div>

            {carrinho.length > 0 && (
              <button style={styles.clearButton} onClick={() => setCarrinho([])}>
                Limpar
              </button>
            )}
          </div>

          {carrinho.length === 0 ? (
            <div style={styles.empty}>
              <strong>Seu carrinho está vazio.</strong>
              <p>Adicione produtos do catálogo para montar o pedido.</p>
            </div>
          ) : (
            <div style={styles.cartItems}>
              {carrinho.map((item) => (
                <div key={item.produto.id} style={styles.cartItem}>
                  <img src={item.produto.imagem} alt={item.produto.nome} style={styles.cartImage} />

                  <div style={styles.cartInfo}>
                    <strong>{item.produto.nome}</strong>
                    <span>{item.produto.categoria}</span>
                    <small>{formatarPreco(item.produto.preco)} cada</small>
                  </div>

                  <div style={styles.quantity}>
                    <button style={styles.quantityButton} onClick={() => removerDoCarrinho(item.produto.id)}>-</button>
                    <span>{item.quantidade}</span>
                    <button style={styles.quantityButton} onClick={() => adicionarAoCarrinho(item.produto)}>+</button>
                  </div>

                  <strong>{formatarPreco(item.produto.preco * item.quantidade)}</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside style={styles.summary}>
          <span style={styles.sectionTag}>Resumo do pedido</span>
          <h2 style={styles.summaryTitle}>Venda #{numeroVenda}</h2>

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
            onClick={finalizarCompra}
          >
            Finalizar compra
          </button>
        </aside>
      </section>

      <section id="relatorios" style={styles.report}>
        <div>
          <span style={styles.sectionTag}>Gerenciamento</span>
          <h2 style={styles.sectionTitle}>{relatorioTitulo}</h2>
          <p style={styles.sectionText}>
            Esta área consulta os relatórios do back-end. Caso a API não retorne,
            o sistema mostra um relatório local básico.
          </p>

          <div style={styles.actions}>
            <button style={styles.primaryButton} onClick={gerarRelatorioVendas}>
              Gerar relatório de vendas
            </button>

            <button style={styles.secondaryButton} onClick={gerarRelatorioProdutos}>
              Gerar relatório de produtos
            </button>
          </div>
        </div>

        <div style={styles.reportBox}>
          {relatorio ? (
            <pre style={styles.reportText}>{relatorio}</pre>
          ) : (
            <p style={styles.sectionText}>Nenhum relatório gerado ainda.</p>
          )}
        </div>
      </section>

      <section id="sistema" style={styles.system}>
        <div>
          <span style={styles.sectionTag}>Sistema</span>
          <h2 style={styles.sectionTitle}>Rotas integradas</h2>
          <p style={styles.sectionText}>
            O front-end está preparado para consumir produtos e relatórios da API Spring Boot.
          </p>
        </div>

        <div style={styles.routes}>
          {[
            "GET /produtos",
            "GET /relatorios/vendas",
            "GET /relatorios/produtos",
            "GET /vendas",
            "GET /vendedores",
            "GET /administradores",
          ].map((rota) => (
            <span key={rota} style={styles.routePill}>{rota}</span>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <strong>Aura Blue</strong>
        <span>React + TypeScript integrado ao Spring Boot</span>
      </footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    width: "100%",
    minHeight: "100vh",
    overflowX: "hidden",
    background:
      "radial-gradient(circle at 15% 5%, rgba(14, 165, 233, 0.30), transparent 30%), radial-gradient(circle at 90% 20%, rgba(37, 99, 235, 0.22), transparent 35%), linear-gradient(135deg, #020617 0%, #07111f 48%, #000000 100%)",
    color: "#f8fbff",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },

  header: {
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 22,
    padding: "18px clamp(18px, 5vw, 80px)",
    background: "rgba(2, 6, 23, 0.88)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: 13,
    color: "inherit",
    textDecoration: "none",
  },

  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#020617",
    fontWeight: 1000,
    fontSize: 24,
    boxShadow: "0 14px 38px rgba(37, 99, 235, 0.35)",
  },

  logoTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1,
  },

  logoSubtitle: {
    margin: "3px 0 0",
    color: "#94a3b8",
    fontSize: 13,
  },

  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 18,
    flexWrap: "wrap",
  },

  navLink: {
    color: "#dbeafe",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 15,
  },

  navButton: {
    color: "#020617",
    background: "linear-gradient(135deg, #7dd3fc, #2563eb)",
    padding: "12px 18px",
    borderRadius: 999,
    textDecoration: "none",
    fontWeight: 900,
  },

  hero: {
    minHeight: "calc(100vh - 86px)",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, 0.95fr)",
    alignItems: "center",
    gap: "clamp(32px, 5vw, 72px)",
    padding: "clamp(50px, 7vw, 92px) clamp(18px, 5vw, 80px)",
  },

  heroText: {
    maxWidth: 820,
  },

  tag: {
    display: "inline-flex",
    alignItems: "center",
    color: "#7dd3fc",
    fontWeight: 1000,
    fontSize: 12,
    letterSpacing: 1.7,
    textTransform: "uppercase",
    padding: "10px 16px",
    borderRadius: 999,
    background: "rgba(14, 165, 233, 0.13)",
    border: "1px solid rgba(125, 211, 252, 0.28)",
    marginBottom: 22,
  },

  heroTitle: {
    margin: 0,
    maxWidth: 820,
    fontSize: "clamp(42px, 6.5vw, 82px)",
    lineHeight: 0.96,
    letterSpacing: -3,
  },

  heroDescription: {
    maxWidth: 670,
    margin: "28px 0 0",
    color: "#bfdbfe",
    fontSize: "clamp(16px, 2vw, 20px)",
    lineHeight: 1.75,
  },

  actions: {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
    marginTop: 32,
  },

  primaryButton: {
    border: "none",
    borderRadius: 999,
    padding: "14px 20px",
    fontWeight: 1000,
    textDecoration: "none",
    color: "#020617",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    boxShadow: "0 16px 45px rgba(37, 99, 235, 0.36)",
  },

  secondaryButton: {
    borderRadius: 999,
    padding: "14px 20px",
    fontWeight: 1000,
    textDecoration: "none",
    color: "#e0f2fe",
    background: "rgba(15, 23, 42, 0.76)",
    border: "1px solid rgba(148, 163, 184, 0.24)",
  },

  heroImageBox: {
    position: "relative",
    minHeight: 460,
    borderRadius: 38,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.22)",
    boxShadow: "0 35px 100px rgba(0, 0, 0, 0.62)",
  },

  heroImage: {
    width: "100%",
    height: "100%",
    minHeight: 560,
    objectFit: "cover",
    display: "block",
    filter: "brightness(0.86) contrast(1.08)",
  },

  offerCard: {
    position: "absolute",
    left: 24,
    bottom: 24,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 22,
    borderRadius: 26,
    background: "rgba(15, 23, 42, 0.84)",
    border: "1px solid rgba(125, 211, 252, 0.28)",
    backdropFilter: "blur(14px)",
  },

  offerSmall: {
    color: "#93c5fd",
    fontWeight: 900,
    fontSize: 13,
  },

  offerTitle: {
    fontSize: 40,
    lineHeight: 1,
  },

  offerText: {
    color: "#cbd5e1",
  },

  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 22,
    padding: "0 clamp(18px, 5vw, 80px) 80px",
  },

  benefitCard: {
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 30,
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
    padding: 28,
  },

  benefitNumber: {
    color: "#38bdf8",
    fontWeight: 1000,
  },

  benefitTitle: {
    display: "block",
    marginTop: 14,
    fontSize: 20,
  },

  benefitText: {
    color: "#b6c6d8",
    lineHeight: 1.7,
  },

  promo: {
    margin: "0 clamp(18px, 5vw, 80px) 80px",
    padding: "clamp(28px, 4vw, 44px)",
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 28,
    background: "linear-gradient(135deg, rgba(14, 165, 233, 0.26), rgba(30, 64, 175, 0.18), rgba(15, 23, 42, 0.78))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
  },

  sectionTag: {
    color: "#7dd3fc",
    fontWeight: 1000,
    fontSize: 12,
    letterSpacing: 1.7,
    textTransform: "uppercase",
  },

  sectionTitle: {
    margin: "8px 0 12px",
    fontSize: "clamp(30px, 4vw, 46px)",
    lineHeight: 1.06,
    letterSpacing: -1.5,
  },

  sectionText: {
    color: "#b6c6d8",
    lineHeight: 1.7,
  },

  promoBadge: {
    width: 170,
    minWidth: 170,
    height: 170,
    borderRadius: 34,
    background: "linear-gradient(135deg, #7dd3fc, #1d4ed8)",
    color: "#020617",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    boxShadow: "0 22px 65px rgba(37, 99, 235, 0.42)",
    fontSize: 42,
    fontWeight: 1000,
  },

  products: {
    padding: "0 clamp(18px, 5vw, 80px) 80px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 24,
    flexWrap: "wrap",
    marginBottom: 28,
  },

  filters: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  input: {
    minWidth: 220,
    padding: "15px 16px",
    borderRadius: 18,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#f8fbff",
    outline: "none",
  },

  select: {
    minWidth: 180,
    padding: "15px 16px",
    borderRadius: 18,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    background: "rgba(15, 23, 42, 0.9)",
    color: "#f8fbff",
    outline: "none",
  },

  filterButton: {
    border: "none",
    borderRadius: 999,
    padding: "14px 20px",
    fontWeight: 1000,
    color: "#020617",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
  },

  warning: {
    padding: "18px 20px",
    marginBottom: 22,
    borderRadius: 22,
    background: "rgba(14, 165, 233, 0.11)",
    border: "1px solid rgba(125, 211, 252, 0.22)",
    color: "#dbeafe",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 22,
  },

  productCard: {
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 30,
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
    overflow: "hidden",
  },

  productImageBox: {
    height: 285,
    overflow: "hidden",
    background: "#020617",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    filter: "brightness(0.9) contrast(1.06)",
  },

  productContent: {
    padding: 24,
  },

  productTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  productCategory: {
    color: "#7dd3fc",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  productBrand: {
    color: "#94a3b8",
    fontWeight: 800,
  },

  productName: {
    margin: "10px 0",
    fontSize: 23,
  },

  productDescription: {
    color: "#b6c6d8",
    lineHeight: 1.65,
    minHeight: 78,
  },

  productFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },

  price: {
    fontSize: 21,
  },

  addButton: {
    border: "none",
    borderRadius: 999,
    padding: "12px 17px",
    fontWeight: 1000,
    color: "#020617",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
  },

  cart: {
    padding: "0 clamp(18px, 5vw, 80px) 80px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(300px, 390px)",
    gap: 24,
    alignItems: "start",
  },

  cartPanel: {
    padding: "clamp(22px, 3vw, 32px)",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 30,
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
  },

  empty: {
    padding: "18px 20px",
    borderRadius: 22,
    background: "rgba(14, 165, 233, 0.11)",
    border: "1px solid rgba(125, 211, 252, 0.22)",
    color: "#dbeafe",
  },

  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  cartItem: {
    display: "grid",
    gridTemplateColumns: "78px minmax(0, 1fr) auto auto",
    gap: 16,
    alignItems: "center",
    padding: 14,
    borderRadius: 24,
    background: "rgba(2, 6, 23, 0.46)",
    border: "1px solid rgba(148, 163, 184, 0.12)",
  },

  cartImage: {
    width: 78,
    height: 78,
    objectFit: "cover",
    borderRadius: 18,
  },

  cartInfo: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    color: "#cbd5e1",
  },

  quantity: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  quantityButton: {
    width: 34,
    height: 34,
    borderRadius: 999,
    border: "none",
    background: "#0ea5e9",
    color: "#020617",
    fontWeight: 1000,
  },

  clearButton: {
    borderRadius: 999,
    padding: "14px 20px",
    fontWeight: 1000,
    color: "#e0f2fe",
    background: "rgba(15, 23, 42, 0.76)",
    border: "1px solid rgba(148, 163, 184, 0.24)",
  },

  summary: {
    position: "sticky",
    top: 105,
    padding: "clamp(22px, 3vw, 32px)",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 30,
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
  },

  summaryTitle: {
    fontSize: 28,
  },

  summaryLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 0",
    borderBottom: "1px solid rgba(148, 163, 184, 0.14)",
    color: "#cbd5e1",
  },

  totalLine: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px 0",
    color: "#ffffff",
    fontSize: 22,
  },

  checkoutButton: {
    width: "100%",
    border: "none",
    borderRadius: 999,
    padding: "16px 18px",
    fontWeight: 1000,
    color: "#020617",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
  },

  report: {
    padding: "0 clamp(18px, 5vw, 80px) 80px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 0.9fr) minmax(320px, 1.1fr)",
    gap: 28,
    alignItems: "stretch",
  },

  reportBox: {
    minHeight: 260,
    padding: "clamp(22px, 3vw, 32px)",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 30,
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
  },

  reportText: {
    margin: 0,
    whiteSpace: "pre-wrap",
    color: "#dbeafe",
    fontFamily: "inherit",
    lineHeight: 1.8,
  },

  system: {
    margin: "0 clamp(18px, 5vw, 80px) 80px",
    padding: "clamp(26px, 4vw, 38px)",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) minmax(280px, 0.9fr)",
    gap: 28,
    alignItems: "center",
    background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.54))",
    border: "1px solid rgba(148, 163, 184, 0.16)",
    borderRadius: 30,
    boxShadow: "0 22px 65px rgba(0, 0, 0, 0.24)",
  },

  routes: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },

  routePill: {
    padding: "12px 15px",
    borderRadius: 999,
    background: "rgba(14, 165, 233, 0.12)",
    border: "1px solid rgba(125, 211, 252, 0.22)",
    color: "#dbeafe",
    fontWeight: 900,
  },

  footer: {
    padding: "28px clamp(18px, 5vw, 80px)",
    borderTop: "1px solid rgba(148, 163, 184, 0.14)",
    color: "#94a3b8",
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
  },
};