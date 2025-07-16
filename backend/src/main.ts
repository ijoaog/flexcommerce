import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import { Logger } from 'nestjs-pino';

// Carrega .env.local se não for produção
if (process.env.NODE_ENV !== 'production' && existsSync('.env.dev')) {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config({ path: '.env.production' }); // padrão: .env
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URL')],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port =
    configService.get<number>('PORT') ||
    parseInt(process.env.PORT || '3003', 10) ||
    3003;

  await app.listen(port);
}

bootstrap();
