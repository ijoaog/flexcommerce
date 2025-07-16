"use client";

import { VendaCriada, VendaForm } from "@/types/venda"; // Crie os tipos se ainda não tiver
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getVendas(): Promise<VendaForm[]> {
  const res = await fetch(`${API_URL}/api/vendas`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Erro ao carregar vendas: ${res.status}`);
  }

  return res.json();
}

export async function excluirVenda(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/vendas/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir venda");
  }
}

export async function getVendaById(id: number): Promise<VendaForm> {
  const res = await fetch(`${API_URL}/api/vendas/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Erro ao buscar venda: ${res.status}`);
  }

  return res.json();
}


function formatDateForSQL(date: Date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}
export async function criarVenda(vendaForm: VendaForm): Promise<VendaCriada> {
  const total = vendaForm.itens.reduce(
    (acc, i) => acc + i.quantidade * i.preco_unitario,
    0
  );
  const dataAtualFormatada = formatDateForSQL(new Date());
  const response = await fetch(`${API_URL}/api/vendas`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cliente_id: vendaForm.cliente_id,
      data_venda: dataAtualFormatada,
      total,
      status: "pendente",
    }),
  });
  if (!response.ok) {
    throw new Error("Erro ao criar venda");
  }
  return response.json();
}