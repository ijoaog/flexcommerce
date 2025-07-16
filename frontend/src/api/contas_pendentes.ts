import { ContaReceberForm } from "@/types/contas_pendentes";
import { ContaReceberDetalhada, Pagamento } from "@/types/contas_detalhada";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Buscar contas pendentes
export async function getContasPendentes(): Promise<ContaReceberForm[]> {
  const res = await fetch(`${API_URL}/api/contas-receber/pendentes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      `Erro ao carregar contas pendentes: ${res.status} - ${
        errorData.message || "Erro desconhecido"
      }`
    );
  }

  return res.json();
}
type PagamentoParaEnvio = Omit<
  Pagamento,
  "id" | "data_pagamento" | "venda" | "cliente" | "contaReceber"
> & {
  conta_receber_id: number;
};
export async function apiPagarContaParcial(
  contaId: number,
  pagamentos: PagamentoParaEnvio[]
) {
  try {
    const response = await fetch("/contas-receber/pagar-parcial", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contaId, pagamentos }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro no pagamento");
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error("Erro ao pagar conta:", err.message);
    throw err;
  }
}
// Pagar conta parcial ou total
export async function pagarContaParcial2(
  form: ContaReceberForm
): Promise<void> {
  const res = await fetch(`${API_URL}/api/contas-receber/pagar-parcial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Erro ao pagar conta");
  }
}

export async function criarContaReceber(
  conta: ContaReceberForm
): Promise<void> {
  const response = await fetch(`${API_URL}/api/contas-receber`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(conta),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar conta a receber");
  }
}

export async function pegarTodasContasReceber(): Promise<
  ContaReceberDetalhada[]
> {
  try {
    const response = await fetch(`${API_URL}/api/contas-receber`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `[pegarTodasContasReceber] Erro ao buscar contas a receber. Status: ${response.status} ${response.statusText}. Resposta: ${errorText}`
      );
      throw new Error(
        `Erro ao buscar contas a receber: ${response.status} ${response.statusText}`
      );
    }

    const data: ContaReceberDetalhada[] = await response.json();
    return data;
  } catch (error) {
    console.error(`[pegarTodasContasReceber] Erro inesperado:`, error);
    throw error;
  }
}

// Pagar conta com vários pagamentos
export async function pagarContaReceber(
  contaId: string,
  pagamentos: Pagamento[]
): Promise<void> {
  const res = await fetch(`${API_URL}/api/contas-receber/${contaId}/pagar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ pagamentos }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Erro ao pagar a conta");
  }
}
