import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendaItensService } from './venda-itens.service';
import { VendaItensController } from './venda-itens.controller';
import { VendaItem } from './entities/venda-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VendaItem])],
  controllers: [VendaItensController],
  providers: [VendaItensService],
})
export class VendaItensModule {}
