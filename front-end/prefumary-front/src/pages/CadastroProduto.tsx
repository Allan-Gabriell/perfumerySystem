import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type ProdutoForm = {
  nome: string;
  marca: string;
  categoria: string;
  preco: string;
  descricao: string;
  administradorId: string;
  promocaoId: string;
};

export default function CadastroProduto() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ProdutoForm>({
    nome: "",
    marca: "",
    categoria: "",
    preco: "",
    descricao: "",
    administradorId: "1",
    promocaoId: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function limparFormulario() {
    setForm({
      nome: "",
      marca: "",
      categoria: "",
      preco: "",
      descricao: "",
      administradorId: "1",
      promocaoId: "",
    });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nome || !form.marca || !form.categoria || !form.preco || !form.descricao) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const precoConvertido = Number(
        form.preco.replace(",", ".").replace(/[^\d.]/g, "")
      );

      if (Number.isNaN(precoConvertido) || precoConvertido <= 0) {
        setErro("Informe um preço válido.");
        return;
      }

      const produtoRequest = {
        nome: form.nome,
        categoria: form.categoria,
        marca: form.marca,
        preco: precoConvertido,
        descricao: form.descricao,
        administradorId: Number(form.administradorId),
        promocaoId: form.promocaoId ? Number(form.promocaoId) : null,
      };

      const response = await fetch(`${API_URL}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produtoRequest),
      });

      if (!response.ok) {
        const respostaErro = await response.text();
        throw new Error(respostaErro || "Erro ao cadastrar produto.");
      }

      setMensagem(`Produto "${form.nome}" cadastrado com sucesso!`);
      limparFormulario();
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar o produto. Verifique se o administradorId existe no banco."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.container}>
        <div style={styles.leftPanel}>
          <div style={styles.brandArea}>
            <div style={styles.logo}>A</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Blue</h1>
              <p style={styles.brandSubtitle}>perfumaria & cosméticos</p>
            </div>
          </div>

          <div>
            <span style={styles.tag}>Cadastro de produto</span>

            <h2 style={styles.heroTitle}>
              Adicione novos produtos ao catálogo da perfumaria.
            </h2>

            <p style={styles.heroText}>
              Os produtos cadastrados aqui são enviados para o back-end Spring Boot
              e aparecem na listagem do sistema.
            </p>
          </div>

          <div style={styles.infoBox}>
            <span>Rota conectada</span>
            <strong>POST /produtos</strong>
          </div>
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Novo produto</h2>
              <p style={styles.formSubtitle}>
                Preencha as informações principais do item.
              </p>
            </div>

            <button
              type="button"
              style={styles.navBtn}
              onClick={() => navigate("/dashboard")}
            >
              ← Voltar
            </button>
          </div>

          {erro && <div style={styles.errorBox}>{erro}</div>}
          {mensagem && <div style={styles.successBox}>{mensagem}</div>}

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Nome do produto</label>
              <input
                style={styles.input}
                name="nome"
                placeholder="Ex: Blue Essence"
                value={form.nome}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Marca</label>
              <input
                style={styles.input}
                name="marca"
                placeholder="Ex: Aura Blue"
                value={form.marca}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Categoria</label>
              <select
                style={styles.input}
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecionar categoria</option>
                <option value="Perfume">Perfume</option>
                <option value="Perfume Feminino">Perfume Feminino</option>
                <option value="Perfume Masculino">Perfume Masculino</option>
                <option value="Perfume Unissex">Perfume Unissex</option>
                <option value="Body Splash">Body Splash</option>
                <option value="Hidratante">Hidratante</option>
                <option value="Skincare">Skincare</option>
                <option value="Kit Presente">Kit Presente</option>
              </select>
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Preço</label>
              <input
                style={styles.input}
                name="preco"
                placeholder="Ex: 199.90"
                value={form.preco}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>ID do administrador</label>
              <input
                style={styles.input}
                name="administradorId"
                type="number"
                min="1"
                placeholder="Ex: 1"
                value={form.administradorId}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>ID da promoção</label>
              <input
                style={styles.input}
                name="promocaoId"
                type="number"
                min="1"
                placeholder="Opcional"
                value={form.promocaoId}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={styles.label}>Descrição</label>
          <textarea
            style={styles.textarea}
            name="descricao"
            placeholder="Descreva o produto, fragrância, textura ou finalidade..."
            value={form.descricao}
            onChange={handleChange}
          />

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => navigate("/produtos")}
            >
              Ver produtos
            </button>

            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar produto"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 12% 8%, rgba(14,165,233,0.34), transparent 32%), radial-gradient(circle at 88% 85%, rgba(37,99,235,0.24), transparent 34%), linear-gradient(135deg, #020617 0%, #07111f 48%, #000000 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    color: "#f8fbff",
  },

  container: {
    width: "100%",
    maxWidth: 1050,
    minHeight: 620,
    display: "grid",
    gridTemplateColumns: "0.9fr 1.1fr",
    borderRadius: 34,
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 35px 100px rgba(0,0,0,0.48)",
    background: "rgba(15,23,42,0.9)",
  },

  leftPanel: {
    padding: 42,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.22), rgba(30,64,175,0.20)), url('https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=80') center/cover",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },

  logo: {
    width: 52,
    height: 52,
    borderRadius: 18,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #7dd3fc, #2563eb)",
    color: "#020617",
    fontWeight: 1000,
    fontSize: 26,
    boxShadow: "0 18px 45px rgba(37,99,235,0.42)",
  },

  brandTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 1,
  },

  brandSubtitle: {
    margin: "4px 0 0",
    color: "#dbeafe",
    fontSize: 13,
  },

  tag: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: 999,
    color: "#7dd3fc",
    background: "rgba(2,6,23,0.68)",
    border: "1px solid rgba(125,211,252,0.25)",
    fontSize: 12,
    fontWeight: 1000,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 18,
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(34px, 4vw, 54px)",
    lineHeight: 0.98,
    letterSpacing: -2,
  },

  heroText: {
    margin: "20px 0 0",
    color: "#dbeafe",
    fontSize: 16,
    lineHeight: 1.7,
  },

  infoBox: {
    padding: 18,
    borderRadius: 22,
    background: "rgba(2,6,23,0.72)",
    border: "1px solid rgba(125,211,252,0.22)",
    color: "#dbeafe",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    maxWidth: 330,
  },

  formPanel: {
    padding: "38px 36px",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.96))",
  },

  topbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 18,
    marginBottom: 24,
  },

  formTitle: {
    margin: 0,
    fontSize: 32,
    color: "#ffffff",
    letterSpacing: -1,
  },

  formSubtitle: {
    margin: "8px 0 0",
    color: "#94a3b8",
    lineHeight: 1.6,
    fontSize: 14,
  },

  navBtn: {
    background: "rgba(15,23,42,0.8)",
    color: "#e0f2fe",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  },

  col: {
    minWidth: 0,
  },

  label: {
    display: "block",
    fontSize: 13,
    color: "#bfdbfe",
    fontWeight: 800,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(15,23,42,0.86)",
    color: "#f8fbff",
  },

  textarea: {
    width: "100%",
    height: 100,
    resize: "none",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(148, 163, 184, 0.22)",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box",
    background: "rgba(15,23,42,0.86)",
    color: "#f8fbff",
    fontFamily: "inherit",
    lineHeight: 1.5,
  },

  actions: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
  },

  btn: {
    flex: 1,
    minWidth: 180,
    padding: "15px 18px",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#020617",
    border: "none",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(37,99,235,0.38)",
  },

  secondaryBtn: {
    flex: 1,
    minWidth: 150,
    padding: "15px 18px",
    background: "rgba(15,23,42,0.85)",
    color: "#e0f2fe",
    border: "1px solid rgba(148,163,184,0.25)",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },

  errorBox: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(239, 68, 68, 0.12)",
    border: "1px solid rgba(248, 113, 113, 0.28)",
    color: "#fecaca",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },

  successBox: {
    padding: "12px 14px",
    borderRadius: 14,
    background: "rgba(34, 197, 94, 0.12)",
    border: "1px solid rgba(74, 222, 128, 0.28)",
    color: "#bbf7d0",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },
};