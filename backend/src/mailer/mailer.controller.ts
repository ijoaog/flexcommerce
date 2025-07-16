import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MailerService } from './mailer.service';
import { IsNotEmpty, IsEmail } from 'class-validator';
import { Validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

class SendEmailDto {
  @IsNotEmpty()
  body: string;

  @IsNotEmpty()
  @IsEmail()
  from: string;

  @IsNotEmpty()
  subject: string;
}

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    const dtoInstance = plainToInstance(SendEmailDto, body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException(errors.map((e) => e.constraints));
    }

    try {
      const result = await this.mailerService.sendEmail(
        dtoInstance.body,
        dtoInstance.from,
        dtoInstance.subject,
      );

      return {
        message: 'Email enviado com sucesso',
        result,
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new InternalServerErrorException('Erro ao enviar e-mail');
    }
  }
}