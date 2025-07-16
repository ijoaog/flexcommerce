import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateVendaItemDto {
  @IsInt()
  venda_id?: number;

  @IsInt()
  produto_id: number;

  @IsInt()
  @Min(1)
  quantidade: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  preco_unitario: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  preco_total?: number;
}