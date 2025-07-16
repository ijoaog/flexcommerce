import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendasService } from './vendas.service';
import { VendasController } from './vendas.controller';
import { Venda } from './entities/venda.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venda])],
  controllers: [VendasController],
  providers: [VendasService],
})
export class VendasModule {}
