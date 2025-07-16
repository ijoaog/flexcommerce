import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venda } from './entities/venda.entity';
import { CreateVendaDto } from './dto/create-venda.dto';

@Injectable()
export class VendasService {
  constructor(
    @InjectRepository(Venda)
    private vendasRepository: Repository<Venda>,
  ) {}

  create(createVendaDto: CreateVendaDto): Promise<Venda> {
    const venda = this.vendasRepository.create(createVendaDto);
    return this.vendasRepository.save(venda);
  }

  findAll(): Promise<Venda[]> {
    return this.vendasRepository.find();
  }

  findOne(id: number): Promise<Venda | null> {
    return this.vendasRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.vendasRepository.delete(id);
  }
}
