import { Navigate } from "react-router-dom";

type NivelAcesso = "ADMIN" | "GERENTE" | "VENDEDOR" | "CLIENTE";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowed: NivelAcesso[];
};

export default function ProtectedRoute({ children, allowed }: ProtectedRouteProps) {
  const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null"
  );

  if (!usuarioLogado) {
    return <Navigate to="/login" replace />;
  }

  if (!allowed.includes(usuarioLogado.nivel)) {
    if (usuarioLogado.nivel === "CLIENTE") {
      return <Navigate to="/catalogo" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}