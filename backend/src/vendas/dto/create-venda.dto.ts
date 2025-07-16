import {
  IsOptional,
  IsInt,
  IsNumber,
  IsEnum,
  Min,
  IsDateString,    // <-- para validar string no formato ISO de data
} from 'class-validator';

export class CreateVendaDto {
  @IsOptional()
  @IsInt()
  cliente_id?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  total: number;

  @IsEnum(['finalizada', 'pendente', 'cancelada'])
  status: 'finalizada' | 'pendente' | 'cancelada';

  @IsDateString()
  @IsOptional()
  data_venda?: string;  // ou Date, mas string é mais comum em JSON
}
