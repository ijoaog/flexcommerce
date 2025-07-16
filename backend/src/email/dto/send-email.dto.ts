// src/email/dto/send-email.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsOptional()  // <--- mudou aqui
  text?: string;

  @IsString()
  @IsOptional()
  html?: string;

  @IsString()
  @IsOptional()
  template?: string;

  @IsObject()
  @IsOptional()
  context?: Record<string, any>;
}