import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { MailerModule } from './mailer/mailer.module';
import { ClientesModule } from './clientes/clientes.module';
import { ProdutoModule } from './produto/produto.module';
import { CategoriaModule } from './categoria/categoria.module';
import { VendasModule } from './vendas/vendas.module';
import { VendaItensModule } from './venda-itens/venda-itens.module';
import { ContasReceberModule } from './contas-receber/contas-receber.module';
import { LoggerModule } from 'nestjs-pino';
import { PagamentosModule } from './pagamento/pagamento.module';
import { EmailModule } from './email/email.module';
import * as path from 'path'; // <-- CORREÇÃO AQUI

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('DATABASE_HOST'),
          port: parseInt(
            configService.get<string>('DATABASE_PORT') || '3306',
            10,
          ),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                },
              },
        ...(process.env.NODE_ENV === 'production' && {
          destination: path.resolve(process.cwd(), 'logs/app.log'), // usa path.resolve corretamente
        }),
      },
    }),
    AuthModule,
    UsersModule,
    MailerModule,
    ClientesModule,
    ProdutoModule,
    CategoriaModule,
    VendasModule,
    VendaItensModule,
    ContasReceberModule,
    PagamentosModule,
    EmailModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}