import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CadastroProduto from './pages/CadastroProduto'
import ListagemProdutos from './pages/ListagemProdutos'
import CadastroCliente from './pages/CadastroCliente'
import HistoricoCompras from './pages/HistoricoCompras'
import RegistroVenda from './pages/RegistroVenda'
import CadastroPromocao from './pages/CadastroPromocao'
import RelatorioVendas from './pages/RelatorioVendas'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produtos" element={<CadastroProduto />} />
        <Route path="/listagem" element={<ListagemProdutos />} />
        <Route path="/clientes" element={<CadastroCliente />} />
        <Route path="/historico" element={<HistoricoCompras />} />
        <Route path="/vendas" element={<RegistroVenda />} />
        <Route path="/promocoes" element={<CadastroPromocao />} />
        <Route path="/relatorio" element={<RelatorioVendas />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App