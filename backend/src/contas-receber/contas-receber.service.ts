import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ContaReceber } from './entities/contas-receber.entity';
import { Pagamento } from './../pagamento/entities/pagamento.entity';
import { CreateContaReceberDto } from './dto/create-contas-receber.dto';

@Injectable()
export class ContasReceberService {
  constructor(
    @InjectRepository(ContaReceber)
    private contasReceberRepository: Repository<ContaReceber>,

    @InjectRepository(Pagamento)
    private pagamentosRepository: Repository<Pagamento>,
  ) {}

  async create(data: CreateContaReceberDto | CreateContaReceberDto[]) {
    if (Array.isArray(data)) {
      const contas = this.contasReceberRepository.create(data);
      return this.contasReceberRepository.save(contas);
    } else {
      const conta = this.contasReceberRepository.create(data);
      return this.contasReceberRepository.save(conta);
    }
  }

  async findAll(): Promise<ContaReceber[]> {
    return this.contasReceberRepository.find({
      relations: ['venda', 'cliente', 'pagamentos'],
    });
  }

  async findAllActives(): Promise<ContaReceber[]> {
    return this.contasReceberRepository.find({
      relations: ['venda', 'cliente', 'pagamentos'],
      where: {
        valor: Not(0), // Filtra onde valor é diferente de 0
      },
    });
  }

  async findOne(id: number): Promise<ContaReceber | null> {
    return this.contasReceberRepository.findOne({
      where: { id },
      relations: ['venda', 'cliente', 'pagamentos'],
    });
  }

  async remove(id: number): Promise<void> {
    await this.contasReceberRepository.delete(id);
  }

  async pagarParcial(
    contaId: number,
    pagamentos: {
      valor: number;
      forma_pagamento: string;
      observacao?: string;
    }[],
  ) {
    const conta = await this.contasReceberRepository.findOne({
      where: { id: contaId },
      relations: ['pagamentos', 'venda', 'cliente'],
    });

    if (!conta) {
      throw new NotFoundException('Conta não encontrada');
    }

    // Soma dos pagamentos antigos
    const valorJaPago = conta.pagamentos.reduce(
      (acc, p) => acc + Number(p.valor),
      0,
    );

    // Soma dos novos pagamentos que você vai adicionar
    const valorNovoPagamento = pagamentos.reduce(
      (acc, p) => acc + Number(p.valor),
      0,
    );

    // Cria e salva os novos pagamentos
    for (const pagamentoDto of pagamentos) {
      const pagamentoEntity = this.pagamentosRepository.create({
        contaReceber: conta,
        venda_id: conta.venda.id,
        cliente_id: conta.cliente.id,
        valor: pagamentoDto.valor,
        forma_pagamento:
          pagamentoDto.forma_pagamento as Pagamento['forma_pagamento'],
        data_pagamento: new Date(),
        observacao: pagamentoDto.observacao ?? null,
      });

      await this.pagamentosRepository.save(pagamentoEntity);
    }

    // Atualiza o valor restante diretamente no campo 'valor'
    // valor total original - (pagamentos antigos + novos)
    const novoValor = Number(conta.valor) - valorNovoPagamento;

    conta.valor = novoValor > 0 ? novoValor : 0;

    if (conta.valor === 0) {
      conta.data_pagamento = new Date().toISOString().split('T')[0];
    } else {
      conta.data_pagamento = null;
    }

    await this.contasReceberRepository.save(conta);

    return {
      message: 'Pagamento registrado com sucesso',
      contaId: conta.id,
      valorRestante: conta.valor,
    };
  }
}
