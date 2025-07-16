import { PagamentoForm } from "@/types/pagamento";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function criarPagamento(pagamento: PagamentoForm): Promise<void> {
  const response = await fetch(`${API_URL}/api/pagamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...pagamento,
      data_pagamento: pagamento.data_pagamento || new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar pagamento");
  }
}
