import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type PromocaoForm = {
  gerenteId: string;
  nome: string;
  desconto: string;
  dataInicio: string;
  dataFim: string;
};

type Gerente = {
  id: number;
  nome: string;
  email: string;
};

export default function CadastroPromocao() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PromocaoForm>({
    gerenteId: "1",
    nome: "",
    desconto: "",
    dataInicio: "",
    dataFim: "",
  });

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [gerenteVerificado, setGerenteVerificado] = useState<Gerente | null>(null);
  const [verificandoGerente, setVerificandoGerente] = useState(false);
  const [erroGerente, setErroGerente] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function verificarGerente(gerenteId: string) {
    if (!gerenteId) {
      setGerenteVerificado(null);
      setErroGerente("");
      return;
    }

    try {
      setVerificandoGerente(true);
      setErroGerente("");
      
      const response = await fetch(`${API_URL}/gerentes/${gerenteId}`);
      
      if (!response.ok) {
        setGerenteVerificado(null);
        setErroGerente(`Gerente com ID ${gerenteId} não encontrado.`);
        return;
      }
      
      const gerente: Gerente = await response.json();
      setGerenteVerificado(gerente);
      setErroGerente("");
    } catch (error) {
      setGerenteVerificado(null);
      setErroGerente("Erro ao verificar gerente. Tente novamente.");
      console.error(error);
    } finally {
      setVerificandoGerente(false);
    }
  }

  function limparFormulario() {
    setForm({
      gerenteId: "1",
      nome: "",
      desconto: "",
      dataInicio: "",
      dataFim: "",
    });
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.gerenteId ||
      !form.nome ||
      !form.desconto ||
      !form.dataInicio ||
      !form.dataFim
    ) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    if (!gerenteVerificado) {
      setErro("Verifique o gerente antes de salvar a promoção.");
      setMensagem("");
      return;
    }

    const descontoConvertido = Number(form.desconto);

    if (
      Number.isNaN(descontoConvertido) ||
      descontoConvertido <= 0 ||
      descontoConvertido > 100
    ) {
      setErro("Informe um desconto válido entre 1% e 100%.");
      setMensagem("");
      return;
    }

    try {
      setCarregando(true);
      setErro("");
      setMensagem("");

      const promocaoRequest = {
        nome: form.nome,
        desconto: descontoConvertido,
        dataInicio: form.dataInicio,
        dataFim: form.dataFim,
      };

      const response = await fetch(
        `${API_URL}/gerentes/${form.gerenteId}/promocoes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(promocaoRequest),
        }
      );

      if (!response.ok) {
        const respostaErro = await response.text();
        throw new Error(respostaErro || "Erro ao cadastrar promoção.");
      }

      setMensagem(`Promoção "${form.nome}" cadastrada com sucesso!`);
      limparFormulario();
      setGerenteVerificado(null);
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar a promoção. Tente novamente."
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
            <div style={styles.logo}>%</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Gold</h1>
              <p style={styles.brandSubtitle}>promoções & campanhas</p>
            </div>
          </div>

          <div>
            <span style={styles.tag}>Cadastro de promoção</span>

            <h2 style={styles.heroTitle}>
              Crie campanhas de desconto com aparência premium.
            </h2>

            <p style={styles.heroText}>
              As promoções são vinculadas a um gerente e podem ser utilizadas
              depois no cadastro ou atualização dos produtos.
            </p>
          </div>

        
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Nova promoção</h2>
              <p style={styles.formSubtitle}>
                Informe o período, o percentual de desconto e o gerente
                responsável.
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

          <label style={styles.label}>Nome da promoção</label>
          <input
            style={styles.input}
            name="nome"
            placeholder="Ex: Gold Week"
            value={form.nome}
            onChange={handleChange}
          />

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>ID do gerente</label>
              <input
                style={styles.input}
                name="gerenteId"
                type="number"
                min="1"
                placeholder="Ex: 1"
                value={form.gerenteId}
                onChange={handleChange}
                onBlur={() => verificarGerente(form.gerenteId)}
              />
              {verificandoGerente && <p style={styles.loadingText}>Verificando gerente...</p>}
              {erroGerente && <p style={styles.errorText}>{erroGerente}</p>}
              {gerenteVerificado && (
                <p style={styles.successText}>
                  ✓ {gerenteVerificado.nome}
                </p>
              )}
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Desconto (%)</label>
              <input
                style={styles.input}
                name="desconto"
                type="number"
                min="1"
                max="100"
                placeholder="Ex: 15"
                value={form.desconto}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.col}>
              <label style={styles.label}>Data de início</label>
              <input
                style={styles.input}
                name="dataInicio"
                type="date"
                value={form.dataInicio}
                onChange={handleChange}
              />
            </div>

            <div style={styles.col}>
              <label style={styles.label}>Data de fim</label>
              <input
                style={styles.input}
                name="dataFim"
                type="date"
                value={form.dataFim}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.previewCard}>
            <span style={styles.previewLabel}>Prévia da campanha</span>

            <div style={styles.previewContent}>
              <div>
                <strong style={styles.previewTitle}>
                  {form.nome || "Nome da promoção"}
                </strong>

                <p style={styles.previewText}>
                  Gerente #{form.gerenteId || "0"}
                </p>

                <p style={styles.previewText}>
                  {form.dataInicio || "Data inicial"} até{" "}
                  {form.dataFim || "Data final"}
                </p>
              </div>

              <div style={styles.discountBadge}>
                <strong>{form.desconto || "0"}%</strong>
                <small>OFF</small>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.secondaryBtn}
              onClick={() => navigate("/produtos/cadastrar")}
            >
              Cadastrar produto
            </button>

            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar promoção"}
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
      "radial-gradient(circle at 10% 8%, rgba(212,175,55,0.26), transparent 30%), radial-gradient(circle at 90% 88%, rgba(255,255,255,0.88), transparent 30%), linear-gradient(135deg, #f4ecd8 0%, #fffdf7 46%, #ead9aa 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
    color: "#2a1e0a",
  },

  container: {
    width: "100%",
    maxWidth: 1040,
    minHeight: 630,
    display: "grid",
    gridTemplateColumns: "0.92fr 1.08fr",
    borderRadius: 38,
    overflow: "hidden",
    background: "rgba(255,255,255,0.78)",
    border: "1px solid rgba(176,141,47,0.28)",
    boxShadow: "0 40px 110px rgba(91,62,8,0.20)",
    backdropFilter: "blur(18px)",
  },

  leftPanel: {
    padding: 46,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(43,31,9,0.78), rgba(166,124,0,0.46)), url('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1400&q=90') center/cover",
    color: "#fffaf0",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: 15,
  },

  logo: {
    width: 56,
    height: 56,
    borderRadius: 20,
    display: "grid",
    placeItems: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    fontWeight: 1000,
    fontSize: 28,
    boxShadow: "0 20px 50px rgba(212,175,55,0.35)",
  },

  brandTitle: {
    margin: 0,
    fontSize: 28,
    color: "#ffffff",
    lineHeight: 1,
    letterSpacing: -0.8,
  },

  brandSubtitle: {
    margin: "5px 0 0",
    color: "#fff0bd",
    fontSize: 13,
  },

  tag: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: 999,
    color: "#fff4c6",
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,244,198,0.34)",
    fontSize: 12,
    fontWeight: 1000,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 18,
    backdropFilter: "blur(10px)",
  },

  heroTitle: {
    margin: 0,
    color: "#ffffff",
    fontSize: "clamp(38px, 5vw, 56px)",
    lineHeight: 0.96,
    letterSpacing: -2.5,
  },

  heroText: {
    margin: "22px 0 0",
    color: "#fff2c6",
    fontSize: 16,
    lineHeight: 1.75,
  },

  infoBox: {
    padding: 18,
    borderRadius: 24,
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,244,198,0.32)",
    color: "#fff7d6",
    display: "flex",
    flexDirection: "column",
    gap: 5,
    maxWidth: 360,
    backdropFilter: "blur(12px)",
  },

  formPanel: {
    padding: "40px 38px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,250,238,0.92))",
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
    fontSize: 34,
    color: "#2a1e0a",
    letterSpacing: -1.3,
  },

  formSubtitle: {
    margin: "8px 0 0",
    color: "#7b6a42",
    lineHeight: 1.6,
    fontSize: 14,
  },

  navBtn: {
    background: "rgba(255,255,255,0.78)",
    color: "#5f4513",
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    padding: "10px 14px",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: 900,
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
    color: "#5f4513",
    fontWeight: 900,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(166,124,0,0.22)",
    fontSize: 15,
    marginBottom: 18,
    outline: "none",
    boxSizing: "border-box",
    background: "#fffef9",
    color: "#2a1e0a",
  },

  previewCard: {
    padding: 18,
    borderRadius: 24,
    marginBottom: 18,
    background:
      "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.68))",
    border: "1px solid rgba(212,175,55,0.24)",
    boxShadow: "0 16px 38px rgba(91,62,8,0.07)",
  },

  previewLabel: {
    display: "block",
    color: "#9f7928",
    fontSize: 12,
    fontWeight: 1000,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
  },

  previewContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
  },

  previewTitle: {
    display: "block",
    fontSize: 22,
    color: "#2a1e0a",
    marginBottom: 5,
  },

  previewText: {
    margin: "3px 0",
    color: "#7b6a42",
    fontSize: 13,
  },

  discountBadge: {
    width: 94,
    height: 94,
    minWidth: 94,
    borderRadius: 28,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    boxShadow: "0 16px 36px rgba(166,124,0,0.24)",
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
    background:
      "linear-gradient(135deg, #fff4bd 0%, #d4af37 46%, #9f7928 100%)",
    color: "#241a08",
    border: "none",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 1000,
    cursor: "pointer",
    boxShadow: "0 18px 45px rgba(166,124,0,0.24)",
  },

  secondaryBtn: {
    flex: 1,
    minWidth: 150,
    padding: "15px 18px",
    background: "rgba(255,255,255,0.78)",
    color: "#5f4513",
    border: "1px solid rgba(166,124,0,0.24)",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 900,
    cursor: "pointer",
  },

  errorBox: {
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(220,38,38,0.08)",
    border: "1px solid rgba(220,38,38,0.22)",
    color: "#991b1b",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },

  successBox: {
    padding: "12px 14px",
    borderRadius: 16,
    background: "rgba(34,197,94,0.10)",
    border: "1px solid rgba(34,197,94,0.24)",
    color: "#166534",
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 1.5,
  },

  loadingText: {
    margin: "8px 0 0",
    fontSize: 13,
    color: "#7b6a42",
    fontStyle: "italic",
  },

  errorText: {
    margin: "8px 0 0",
    fontSize: 13,
    color: "#991b1b",
    fontWeight: 500,
  },

  successText: {
    margin: "8px 0 0",
    fontSize: 13,
    color: "#166534",
    fontWeight: 500,
  },
};