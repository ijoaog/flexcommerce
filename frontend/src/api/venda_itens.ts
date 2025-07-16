import { VendaItemForm } from "@/types/venda-itens";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function criarVendaItem(item: VendaItemForm): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/venda-itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error("Erro ao criar item da venda");
    }
  } catch (error) {
    throw error; // pode jogar o erro para o filtro de exceção padrão do Nest para resposta 500
  }
}
