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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
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

    if (!form.gerenteId || !form.nome || !form.desconto || !form.dataInicio || !form.dataFim) {
      setErro("Preencha todos os campos obrigatórios.");
      setMensagem("");
      return;
    }

    const descontoConvertido = Number(form.desconto);

    if (Number.isNaN(descontoConvertido) || descontoConvertido <= 0 || descontoConvertido > 100) {
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
    } catch (error) {
      console.error(error);
      setErro(
        "Não foi possível cadastrar a promoção. Verifique se o gerenteId existe no banco."
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
              <h1 style={styles.brandTitle}>Aura Blue</h1>
              <p style={styles.brandSubtitle}>promoções & campanhas</p>
            </div>
          </div>

          <div>
            <span style={styles.tag}>Cadastro de promoção</span>

            <h2 style={styles.heroTitle}>
              Crie campanhas de desconto para destacar produtos no sistema.
            </h2>

            <p style={styles.heroText}>
              As promoções cadastradas são vinculadas a um gerente e podem ser
              utilizadas no cadastro ou atualização de produtos.
            </p>
          </div>

          <div style={styles.infoBox}>
            <span>Rota conectada</span>
            <strong>POST /gerentes/&#123;id&#125;/promocoes</strong>
          </div>
        </div>

        <form onSubmit={handleSalvar} style={styles.formPanel}>
          <div style={styles.topbar}>
            <div>
              <h2 style={styles.formTitle}>Nova promoção</h2>
              <p style={styles.formSubtitle}>
                Informe o período, o percentual de desconto e o gerente responsável.
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
            placeholder="Ex: Blue Week"
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
              />
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
                  {form.dataInicio || "Data inicial"} até {form.dataFim || "Data final"}
                </p>
              </div>

              <div style={styles.discountBadge}>
                {form.desconto || "0"}%
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
    maxWidth: 1020,
    minHeight: 610,
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
      "linear-gradient(135deg, rgba(14,165,233,0.26), rgba(30,64,175,0.24)), url('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=80') center/cover",
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
    fontSize: "clamp(34px, 4vw, 52px)",
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
    maxWidth: 340,
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

  previewCard: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 18,
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.18), rgba(37,99,235,0.10))",
    border: "1px solid rgba(125,211,252,0.22)",
  },

  previewLabel: {
    display: "block",
    color: "#7dd3fc",
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
    fontSize: 21,
    color: "#ffffff",
    marginBottom: 5,
  },

  previewText: {
    margin: 0,
    color: "#cbd5e1",
    fontSize: 13,
  },

  discountBadge: {
    width: 82,
    height: 82,
    minWidth: 82,
    borderRadius: 24,
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #7dd3fc, #2563eb)",
    color: "#020617",
    fontSize: 26,
    fontWeight: 1000,
    boxShadow: "0 18px 45px rgba(37,99,235,0.34)",
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