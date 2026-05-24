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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/produtos" element={<ListagemProdutos />} />
        <Route path="/produtos/cadastrar" element={<CadastroProduto />} />

        <Route path="/clientes/cadastrar" element={<CadastroCliente />} />

        <Route path="/promocoes/cadastrar" element={<CadastroPromocao />} />

        <Route path="/vendas/registrar" element={<RegistroVenda />} />
        <Route path="/compras/historico" element={<HistoricoCompras />} />

        <Route path="/relatorios/vendas" element={<RelatorioVendas />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}