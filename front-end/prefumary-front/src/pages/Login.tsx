import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080";

type UsuarioApi = {
  id?: number;
  nome?: string;
  email?: string;
  senha?: string;
  nivelAcesso?: string;
};

type UsuarioLogado = {
  id?: number;
  nome: string;
  email: string;
  tipo: "Administrador" | "Vendedor" | "Gerente";
};

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();

  async function buscarUsuarios(endpoint: string, tipo: UsuarioLogado["tipo"]) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);

      if (!response.ok) {
        return [];
      }

      const data: UsuarioApi[] = await response.json();

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map((item) => ({
        ...item,
        tipo,
      }));
    } catch {
      return [];
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!usuario.trim() || !senha.trim()) {
      setErro("Preencha usuário e senha para continuar.");
      return;
    }

    try {
      setCarregando(true);
      setErro("");

      const administradores = await buscarUsuarios(
        "/administradores",
        "Administrador"
      );

      const vendedores = await buscarUsuarios("/vendedores", "Vendedor");

      const usuarios = [...administradores, ...vendedores];

      const usuarioEncontrado = usuarios.find((item) => {
        const emailConfere =
          item.email?.toLowerCase() === usuario.trim().toLowerCase();

        const nomeConfere =
          item.nome?.toLowerCase() === usuario.trim().toLowerCase();

        const senhaConfere = item.senha === senha;

        return (emailConfere || nomeConfere) && senhaConfere;
      });

      if (!usuarioEncontrado) {
        setErro("Usuário ou senha inválidos.");
        return;
      }

      const dadosUsuario: UsuarioLogado = {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome || "Usuário",
        email: usuarioEncontrado.email || "",
        tipo: usuarioEncontrado.tipo,
      };

      localStorage.setItem("usuarioLogado", JSON.stringify(dadosUsuario));

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErro("Não foi possível conectar ao back-end.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.leftPanel}>
          <div style={styles.brand}>
            <div style={styles.logoCircle}>A</div>

            <div>
              <h1 style={styles.brandTitle}>Aura Blue</h1>
              <p style={styles.brandSubtitle}>perfumaria & cosméticos</p>
            </div>
          </div>

          <div style={styles.heroText}>
            <span style={styles.tag}>Sistema interno</span>

            <h2 style={styles.heroTitle}>
              Gerencie vendas, produtos e relatórios com elegância.
            </h2>

            <p style={styles.heroDescription}>
              Acesso restrito para administradores e vendedores cadastrados no
              sistema.
            </p>
          </div>

         
        </div>

        <div style={styles.formPanel}>
          <div style={styles.formHeader}>
            <h2 style={styles.title}>Entrar no sistema</h2>
            <p style={styles.subtitle}>
              Use o e-mail ou nome cadastrado no back-end.
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <label style={styles.label}>Usuário</label>

            <input
              style={styles.input}
              placeholder="Digite seu e-mail ou nome"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />

            <label style={styles.label}>Senha</label>

            <input
              style={styles.input}
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            {erro && <div style={styles.errorBox}>{erro}</div>}

            <button style={styles.btn} type="submit" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div style={styles.footer}>
            <span>Acesso restrito a funcionários</span>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    background:
      "radial-gradient(circle at 15% 10%, rgba(14,165,233,0.35), transparent 30%), radial-gradient(circle at 85% 80%, rgba(37,99,235,0.28), transparent 35%), linear-gradient(135deg, #020617 0%, #07111f 50%, #000000 100%)",
    fontFamily: "Inter, Arial, Helvetica, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: 980,
    minHeight: 580,
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    borderRadius: 32,
    overflow: "hidden",
    background: "rgba(15, 23, 42, 0.86)",
    border: "1px solid rgba(148, 163, 184, 0.18)",
    boxShadow: "0 35px 100px rgba(0,0,0,0.48)",
  },

  leftPanel: {
    position: "relative",
    padding: 42,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(14,165,233,0.22), rgba(30,64,175,0.18)), url('https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=80') center/cover",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    position: "relative",
    zIndex: 2,
  },

  logoCircle: {
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

  heroText: {
    position: "relative",
    zIndex: 2,
    maxWidth: 520,
  },

  tag: {
    display: "inline-flex",
    padding: "9px 14px",
    borderRadius: 999,
    color: "#7dd3fc",
    background: "rgba(2,6,23,0.62)",
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
    fontSize: "clamp(34px, 5vw, 56px)",
    lineHeight: 0.98,
    letterSpacing: -2,
  },

  heroDescription: {
    margin: "20px 0 0",
    color: "#dbeafe",
    fontSize: 16,
    lineHeight: 1.7,
  },

  infoBox: {
    position: "relative",
    zIndex: 2,
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
    padding: "52px 42px",
    background:
      "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.96))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  formHeader: {
    marginBottom: 28,
  },

  title: {
    margin: 0,
    fontSize: 32,
    color: "#ffffff",
    letterSpacing: -1,
  },

  subtitle: {
    margin: "10px 0 0",
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 1.6,
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

  btn: {
    width: "100%",
    padding: "15px 18px",
    background: "linear-gradient(135deg, #38bdf8, #2563eb)",
    color: "#020617",
    border: "none",
    borderRadius: 999,
    fontSize: 15,
    fontWeight: 1000,
    cursor: "pointer",
    marginTop: 6,
    boxShadow: "0 18px 45px rgba(37,99,235,0.38)",
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

  footer: {
    marginTop: 22,
    textAlign: "center",
    color: "#64748b",
    fontSize: 12,
  },
};