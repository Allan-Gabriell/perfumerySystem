# 🎀 Guia de Setup - Perfumery System

## Pré-requisitos

- **Java 17+** (para backend)
- **Node.js 18+** (para frontend)
- **PostgreSQL** (ou Supabase configurado)
- **Maven** (para construir o backend)

---

## 🚀 Executar o Backend

### 1. Navegar para a raiz do projeto
```bash
cd perfumerySystem-main
```

### 2. Compilar e executar com Maven
```bash
# Windows
mvnw spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

O backend estará disponível em: **http://localhost:8080**

---

## 🎨 Executar o Frontend

### 1. Navegar para a pasta do frontend
```bash
cd front-end/prefumary-front
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
# Copiar arquivo de exemplo (caso não exista .env)
cp .env.example .env
```

Editar o arquivo `.env` se o backend estiver em uma porta diferente:
```
VITE_API_URL=http://localhost:8080
```

### 4. Executar em modo desenvolvimento
```bash
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

---

## 📁 Estrutura do Projeto

```
perfumerySystem-main/
├── src/                          # Backend (Spring Boot)
│   ├── main/
│   │   ├── java/
│   │   │   └── com/system/perfumary/
│   │   │       ├── config/       # Configurações (CORS, etc)
│   │   │       ├── controller/   # Endpoints REST
│   │   │       ├── service/      # Lógica de negócio
│   │   │       ├── repository/   # Acesso ao banco
│   │   │       ├── entity/       # Modelos JPA
│   │   │       └── dto/          # Data Transfer Objects
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── front-end/
│   └── prefumary-front/          # Frontend (React + TypeScript + Vite)
│       ├── src/
│       │   ├── App.tsx           # Componente principal
│       │   ├── main.tsx          # Entry point
│       │   ├── services/
│       │   │   └── api.ts        # Serviço de integração com backend
│       │   └── ...
│       ├── .env                  # Variáveis de ambiente (local)
│       ├── .env.example          # Exemplo de variáveis
│       ├── package.json
│       ├── vite.config.ts
│       └── tsconfig.json
├── pom.xml                       # Configuração Maven
└── README.md
```

---

## 🔗 Integração Frontend-Backend

### Como funciona:

1. **Frontend** (http://localhost:5173) → **Backend** (http://localhost:8080)
2. CORS está configurado em `src/main/java/com/system/perfumary/config/CorsConfig.java`
3. O serviço de API está em `front-end/prefumary-front/src/services/api.ts`

### Exemplo de uso no Frontend:

```typescript
import { apiService } from './services/api';

// Buscar todos os produtos
const produtos = await apiService.getProdutos();

// Criar um novo produto
const novoProduto = await apiService.criarProduto({
  nome: "Novo Perfume",
  categoria: "Perfume",
  marca: "Aura",
  preco: 199.90,
  descricao: "Descrição do perfume"
});
```

---

## 📝 Endpoints Disponíveis

### Produtos
- `GET /produtos` - Listar todos
- `GET /produtos/{id}` - Buscar por ID
- `POST /produtos` - Criar novo
- `PUT /produtos/{id}` - Atualizar
- `DELETE /produtos/{id}` - Deletar

### Vendas
- `GET /vendas` - Listar todas
- `POST /vendas` - Criar nova venda

### Clientes
- `GET /clientes` - Listar todos
- `POST /clientes` - Criar novo cliente

### Relatórios
- `GET /relatorios` - Listar relatórios

---

## 🐛 Troubleshooting

### Erro: "Cannot GET /produtos" no frontend
- Verifique se o backend está rodando em http://localhost:8080
- Confirme a configuração em `.env`

### Erro CORS
- O CORS já está configurado no backend
- Se persistir, verifique `CorsConfig.java`

### Porta 8080 já em uso
```bash
# Windows
netstat -ano | findstr :8080

# Linux/Mac
lsof -i :8080
```

---

## 📚 Tecnologias

- **Backend**: Spring Boot 3.x, Spring Data JPA, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, React Hooks
- **Banco de Dados**: PostgreSQL (Supabase)

---

## 👥 Autores

Perfumery System - Sistema de Gerenciamento de Perfumaria

