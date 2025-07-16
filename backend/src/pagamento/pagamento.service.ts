import { Repository } from 'typeorm';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { Pagamento } from './entities/pagamento.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagamentosService {
  constructor(
    @InjectRepository(Pagamento)
    private pagamentosRepository: Repository<Pagamento>,
  ) {}

  create(
    createPagamentoDto: CreatePagamentoDto | CreatePagamentoDto[],
  ): Promise<Pagamento | Pagamento[]> {
    if (Array.isArray(createPagamentoDto)) {
      const pagamentos = this.pagamentosRepository.create(createPagamentoDto);
      return this.pagamentosRepository.save(pagamentos); // retorna Promise<Pagamento[]>
    } else {
      const pagamento = this.pagamentosRepository.create(createPagamentoDto);
      return this.pagamentosRepository.save(pagamento); // retorna Promise<Pagamento>
    }
  }

  findAll(): Promise<Pagamento[]> {
    return this.pagamentosRepository.find();
  }

  findOne(id: number): Promise<Pagamento | null> {
    return this.pagamentosRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.pagamentosRepository.delete(id);
  }
}
