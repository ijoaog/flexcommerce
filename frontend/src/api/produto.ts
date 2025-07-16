"use client";

import { Produto, ProdutoForm } from "@/types/produto";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getProdutos(): Promise<Produto[]> {
  const res = await fetch(`${API_URL}/api/produtos`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Erro ao carregar produtos: ${res.status}`);
  }

  return res.json();
}

export async function salvarProduto(
  form: ProdutoForm,
  id?: number
): Promise<void> {
  const url = id ? `${API_URL}/api/produtos/${id}` : `${API_URL}/api/produtos`;
  const method = id ? "PATCH" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro ao salvar produto");
  }
}

export async function excluirProduto(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/produtos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir produto");
  }
}

export async function getProdutoById(id: number): Promise<Produto> {
  const res = await fetch(`${API_URL}/api/produtos/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar produto: ${res.status}`);
  }

  return res.json();
}
