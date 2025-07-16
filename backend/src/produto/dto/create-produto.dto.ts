// create-produto.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';
import { ResponsavelProduto, SituacaoProduto } from '../entities/produto.entity';

export class CreateProdutoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  nome: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  quantidade: number;

  @IsEnum(ResponsavelProduto)
  @IsOptional()
  responsavel_produto?: ResponsavelProduto;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsInt()
  categoria_id?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  modelo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  marca?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigo_barras?: string;

  @IsOptional()
  @IsNumber()
  preco_venda?: number;

  @IsOptional()
  @IsNumber()
  preco_custo?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  unidade_medida?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  tamanho?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  material?: string;

  @IsOptional()
  @IsEnum(SituacaoProduto)
  situacao?: SituacaoProduto;

  @IsOptional()
  @IsInt()
  garantia_meses?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  fornecedor?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}
