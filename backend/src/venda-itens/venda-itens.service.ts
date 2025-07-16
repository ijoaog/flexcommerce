import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VendaItem } from './entities/venda-item.entity';
import { CreateVendaItemDto } from './dto/create-venda-item.dto';

@Injectable()
export class VendaItensService {
  constructor(
    @InjectRepository(VendaItem)
    private vendaItensRepository: Repository<VendaItem>,
  ) {}

  create(createVendaItemDto: CreateVendaItemDto): Promise<VendaItem> {
    const vendaItem = this.vendaItensRepository.create(createVendaItemDto);
    return this.vendaItensRepository.save(vendaItem);
  }

  findAll(): Promise<VendaItem[]> {
    return this.vendaItensRepository.find();
  }

  findOne(id: number): Promise<VendaItem | null> {
    return this.vendaItensRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.vendaItensRepository.delete(id);
  }
}
