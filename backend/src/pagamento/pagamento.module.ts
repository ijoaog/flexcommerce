import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PagamentosService } from './pagamento.service';
import { PagamentosController } from './pagamento.controller';
import { Pagamento } from './entities/pagamento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pagamento])],
  controllers: [PagamentosController],
  providers: [PagamentosService],
})
export class PagamentosModule {}
