import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContasReceberService } from './contas-receber.service';
import { ContasReceberController } from './contas-receber.controller'; // importe o controller
import { ContaReceber } from './entities/contas-receber.entity';
import { Pagamento } from '../pagamento/entities/pagamento.entity';
import { PagamentosModule } from '../pagamento/pagamento.module';
import { Venda } from '../vendas/entities/venda.entity';
import { VendasModule } from '../vendas/vendas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContaReceber, Pagamento, Venda]),
    PagamentosModule,
    VendasModule,
  ],
  controllers: [ContasReceberController],
  providers: [ContasReceberService],
  exports: [ContasReceberService],
})
export class ContasReceberModule {}
