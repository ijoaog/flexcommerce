import { IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  nome: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  endereco?: string;
}
