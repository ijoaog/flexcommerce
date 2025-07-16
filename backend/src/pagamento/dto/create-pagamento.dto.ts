import {
  IsInt,
  IsNumber,
  IsDateString,
  IsOptional,
  IsIn,
  Min,
} from 'class-validator';

export class CreatePagamentoDto {
  @IsInt()
  venda_id: number;

  @IsInt()
  cliente_id: number;

  @IsOptional()
  @IsInt()
  conta_receber_id?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  valor: number;

  @IsDateString()
  data_pagamento: string;

  @IsIn([
    'dinheiro',
    'cartao',
    'pix',
    'marcar_na_conta',
    'boleto',
    'transferencia_bancaria',
    'cheque',
    'vale_alimentacao',
    'vale_refeicao',
    'paypal',
    'apple_pay',
    'google_pay',
    'deposito',
    'crediario',
  ])
  forma_pagamento:
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

  @IsOptional()
  observacao?: string;
}
