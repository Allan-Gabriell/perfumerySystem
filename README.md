# Perfumary System - Spring Boot API

Este projeto é um sistema de gerenciamento de perfumaria desenvolvido com **Java 21, Spring Boot 4 e PostgreSQL**.

## 🏗️ Arquitetura de Usuários
O sistema utiliza uma classe base abstrata `Usuario` (`@MappedSuperclass`), que não é instanciável nem manipulada diretamente. Todas as operações de usuários são realizadas através de suas especializações:
*   **Administrador**: Gerencia usuários e cadastra produtos.
*   **Gerente**: Gera relatórios e gerencia promoções.
*   **Vendedor**: Realiza vendas e cadastra clientes.

---

## 🚀 Como Executar
1. Certifique-se de ter o **PostgreSQL** rodando.
2. Configure as credenciais do banco em `src/main/resources/application.properties`.
3. Execute o comando: `./mvnw spring-boot:run`

---

## 📑 Guia de Teste da API

A API roda por padrão em: `http://localhost:8080`

### 👤 Gestão de Acesso (CRUDS Completos)
#### Administradores
*   **POST** `/administradores` - Cadastrar
*   **GET** `/administradores` - Listar todos
*   **PUT** `/administradores/{id}/alterar-senha` - Atualizar Senha
*   **DELETE** `/administradores/{id}` - Remover

#### Vendedores
*   **POST** `/vendedores` - Cadastrar
*   **GET** `/vendedores` - Listar todos
*   **PUT** `/vendedores/{id}/alterar-senha` - Atualizar Senha
*   **DELETE** `/vendedores/{id}` - Remover

#### Gerentes
*   **POST** `/gerentes/cadastrar-gerente` - Cadastrar
*   **PUT** `/gerentes/{id}/alterar-senha` - Atualizar Senha
*   **DELETE** `/gerentes/{id}/deletar` - Remover

### 📦 Produtos e Clientes
*   **POST** `/produtos` - Cadastrar Produto
*   **PUT** `/produtos/{id}` - Atualizar Produto (Preço, Promoção, etc.)
*   **DELETE** `/produtos/{id}` - Remover
*   **POST** `/clientes` - Cadastrar Cliente

### 💰 Vendas e Promoções
#### Promoções (Via Gerente)
*   **POST** `/gerentes/{id}/promocoes` - Criar Promoção
*   **PUT** `/gerentes/{gerenteId}/promocoes/{promocaoId}` - Editar Promoção
*   **DELETE** `/gerentes/{gerenteId}/promocoes/{promocaoId}` - Remover

#### Vendas
*   **POST** `/vendas` - Registrar Venda (Aplica desconto automático)
*   **PUT** `/vendas/{id}` - Atualizar Venda (Recalcula totais e descontos)
*   **GET** `/vendas` - Histórico Completo

### 📊 Relatórios
*   **GET** `/relatorios/vendas` - Métricas (Total, Ticket Médio)
*   **GET** `/relatorios/produtos` - Status do Inventário
