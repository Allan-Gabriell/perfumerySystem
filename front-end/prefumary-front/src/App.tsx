import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import CadastroProduto from './pages/CadastroProduto'
import RegistroVenda from './pages/RegistroVenda'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/produtos" element={<CadastroProduto />} />
        <Route path="/vendas" element={<RegistroVenda />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App