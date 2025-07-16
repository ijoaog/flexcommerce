import { PagamentoForm } from './pagamento';

export interface ContaReceberForm {
  venda_id: number;
  cliente_id: number;
  valor: number;
  data_vencimento: string; // YYYY-MM-DD
  data_pagamento?: string | null;
  pagamentos?: Omit<
    PagamentoForm,
    'id' | 'contaReceber' | 'venda' | 'cliente' | 'data_pagamento'
  >[];
}