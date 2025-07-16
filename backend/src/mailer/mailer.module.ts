import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { MailerService } from './mailer.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule,  // <-- importante importar para usar ConfigService
  ],
  controllers: [MailerController],
  providers: [MailerService],
})
export class MailerModule {}