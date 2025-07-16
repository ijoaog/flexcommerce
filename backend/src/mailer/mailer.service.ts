import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // ✅ Aqui
  ) {}

  async sendEmail(body: string, to: string, subject: string): Promise<any> {
    const token = this.configService.get<string>('TOKEN_EMAIL');
    const payload = {
      to,
      subject,
      body,
    };

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.configService.get<string>('EMAIL_URL')}/send-mail`, payload, {
          headers,
        }),
      );
      return data;
    } catch (error) {
      console.error(
        'Erro ao enviar email:',
        error.response?.data || error.message || error,
      );
      throw new Error('Erro ao enviar email');
    }
  }
}
