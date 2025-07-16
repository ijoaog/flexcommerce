import { PagamentoForm } from "./pagamento";
import { VendaItemForm } from "./venda-itens";

export interface VendaForm {
  cliente_id?: number | null;
  itens: Omit<VendaItemForm, "venda_id" | "preco_total">[];
  pagamentos?: Omit<
    PagamentoForm,
    "id" | "venda_id" | "cliente_id" | "data_pagamento"
  >[];
}

export interface VendaCriada {
  id: number;
  data_venda: string;
  total: number;
  status: string;
}
