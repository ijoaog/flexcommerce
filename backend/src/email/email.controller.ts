// src/email/email.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  async sendEmail(@Body(new ValidationPipe()) sendEmailDto: SendEmailDto) {
    try {
      await this.emailService.sendEmail(sendEmailDto);
      return { message: 'Email enviado com sucesso' };
    } catch (error) {
      throw new BadRequestException('Erro ao enviar email');
    }
  }
}
