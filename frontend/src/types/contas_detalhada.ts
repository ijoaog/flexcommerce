// cliente.ts
export interface Cliente {
  id: number;
  nome: string;
  telefone?: string | null;
  email?: string | null;
  endereco?: string | null;
  data_criacao: Date;
  atualizado_em: Date;
  deletado_em: Date | null;
}

// venda.ts
export type VendaStatus = 'finalizada' | 'pendente' | 'cancelada';

export interface Venda {
  id: number;
  cliente: Cliente | null;
  data_venda: Date;
  total: number;
  status: VendaStatus;
  // ignorando relações que não vêm no seu JSON (itens, contasReceber, pagamentos)
}

// pagamento.ts
export type FormaPagamento =
  | 'dinheiro'
  | 'cartao'
  | 'pix'
  | 'marcar_na_conta'
  | 'boleto'
  | 'transferencia_bancaria'
  | 'cheque'
  | 'vale_alimentacao'
  | 'vale_refeicao'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'deposito'
  | 'crediario';

export interface Pagamento {
  id: number;
  venda_id: number;
  venda: Venda;
  cliente_id: number;
  cliente: Cliente;
  conta_receber_id?: number;
  contaReceber?: ContaReceberDetalhada | null; // cuidado com recursão circular
  valor: number;
  data_pagamento: Date;
  forma_pagamento: FormaPagamento;
  observacao?: string | null;
}

// conta-receber.ts
export interface ContaReceberDetalhada {
  id: number;
  venda_id: number;
  venda: Venda;
  cliente_id: number;
  cliente: Cliente;
  valor: number;
  data_vencimento: string; // está em formato 'YYYY-MM-DD' (string)
  data_pagamento?: string | null; // pode ser null ou string no formato 'YYYY-MM-DD'
  pagamentos: Pagamento[];
}
