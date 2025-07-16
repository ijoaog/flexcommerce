// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(data: SendEmailDto) {
    return this.mailerService.sendMail({
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
      template: data.template,  // repassa o template
      context: data.context,    // repassa o contexto para o template
    });
  }
}
