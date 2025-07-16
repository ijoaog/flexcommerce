
export interface VendaItemForm {
  venda_id: number;
  produto_id: number;
  quantidade: number;
  preco_unitario: number;
  preco_total?: number | null;
}
