// API configuration for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Produtos
  async getProdutos(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar produtos");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  }

  async getProdutoById(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  }

  async criarProduto(produto: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });
      if (!response.ok) throw new Error("Erro ao criar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  }

  async atualizarProduto(id: number, produto: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(produto),
      });
      if (!response.ok) throw new Error("Erro ao atualizar produto");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  }

  async deletarProduto(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/produtos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao deletar produto");
      return true;
    } catch (error) {
      console.error("Erro:", error);
      return false;
    }
  }

  // Vendas
  async criarVenda(venda: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/vendas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venda),
      });
      if (!response.ok) throw new Error("Erro ao criar venda");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  }

  async getVendas(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/vendas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar vendas");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  }

  // Clientes
  async criarCliente(cliente: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/clientes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });
      if (!response.ok) throw new Error("Erro ao criar cliente");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  }

  async getClientes(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/clientes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar clientes");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  }

  // Relatórios
  async getRelatorios(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/relatorios`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Erro ao buscar relatórios");
      return await response.json();
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
  }
}

export const apiService = new ApiService();
