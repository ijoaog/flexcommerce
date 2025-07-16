import { Cliente, ClienteForm } from "@/types/cliente";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(`${API_URL}/api/clientes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Erro ao carregar clientes: ${res.status}`);
  }

  return res.json();
}

export async function salvarCliente(
  form: ClienteForm,
  id?: number
): Promise<void> {
  const url = id ? `${API_URL}/api/clientes/${id}` : `${API_URL}/api/clientes`;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro ao salvar cliente");
  }
}

export async function excluirCliente(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir cliente");
  }
}

export async function getClienteById(id: number): Promise<Cliente> {
  const res = await fetch(`${API_URL}/api/clientes/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar cliente: ${res.status}`);
  }

  return res.json();
}

