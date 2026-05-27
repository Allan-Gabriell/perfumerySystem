import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroProduto from "./pages/CadastroProduto";
import CadastroPromocao from "./pages/CadastroPromocao";
import HistoricoCompras from "./pages/HistoricoCompras";
import ListagemProdutos from "./pages/ListagemProdutos";
import RegistroVenda from "./pages/RegistroVenda";
import RelatorioVendas from "./pages/RelatorioVendas";
import CatalogoCliente from "./pages/CatalogoCliente";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/catalogo" element={<CatalogoCliente />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE", "VENDEDOR"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/produtos"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE", "VENDEDOR"]}>
              <ListagemProdutos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/produtos/cadastrar"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE"]}>
              <CadastroProduto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clientes/cadastrar"
          element={
            <ProtectedRoute allowed={["ADMIN", "VENDEDOR"]}>
              <CadastroCliente />
            </ProtectedRoute>
          }
        />

        <Route
          path="/promocoes/cadastrar"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE"]}>
              <CadastroPromocao />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vendas/registrar"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE", "VENDEDOR"]}>
              <RegistroVenda />
            </ProtectedRoute>
          }
        />

        <Route
          path="/compras/historico"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE", "VENDEDOR"]}>
              <HistoricoCompras />
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorios/vendas"
          element={
            <ProtectedRoute allowed={["ADMIN", "GERENTE"]}>
              <RelatorioVendas />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}