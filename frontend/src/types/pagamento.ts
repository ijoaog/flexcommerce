export type tipos_pagamento =
  | "dinheiro"
  | "cartao"
  | "pix"
  | "marcar_na_conta"
  | "boleto"
  | "transferencia_bancaria"
  | "cheque"
  | "vale_alimentacao"
  | "vale_refeicao"
  | "paypal"
  | "apple_pay"
  | "google_pay"
  | "deposito"
  | "crediario";

export interface PagamentoForm {
  venda_id: number;
  cliente_id?: number | null;
  valor: number;
  forma_pagamento: tipos_pagamento;
  observacao?: string | null;
  data_pagamento?: string;
}