import { IsInt, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class CreateContaReceberDto {
  @IsInt()
  venda_id: number;

  @IsInt()
  cliente_id: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  valor: number;

  @IsDateString()
  data_vencimento: string;

  @IsDateString()
  @IsOptional()
  data_pagamento?: string;
}
