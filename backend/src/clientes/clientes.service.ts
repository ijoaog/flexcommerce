import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name);

  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,
  ) {}

  async create(dto: CreateClienteDto) {
    try {
      const novoCliente = this.clientesRepository.create(dto);
      return await this.clientesRepository.save(novoCliente);
    } catch (error) {
      this.logger.error('Erro ao criar cliente', error.stack);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.clientesRepository.find({
        where: { deletado_em: IsNull() },
        order: { id: 'ASC' },
      });
    } catch (error) {
      this.logger.error('Erro ao buscar todos os clientes', error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const cliente = await this.clientesRepository.findOne({
        where: {
          id,
          deletado_em: IsNull(),
        },
      });

      if (!cliente) {
        this.logger.warn(`Cliente com id ${id} não encontrado`);
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      }

      return cliente;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`Erro ao buscar cliente com id ${id}`, error.stack);
      }
      throw error;
    }
  }

  async update(id: number, dto: UpdateClienteDto) {
    try {
      const cliente = await this.clientesRepository.findOne({
        where: { id, deletado_em: IsNull() },
      });
      if (!cliente) {
        this.logger.warn(
          `Cliente com id ${id} não encontrado para atualização`,
        );
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      }
      Object.assign(cliente, dto);
      return await this.clientesRepository.save(cliente);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Erro ao atualizar cliente com id ${id}`,
          error.stack,
        );
      }
      throw error;
    }
  }

  async softDelete(id: number) {
    try {
      const cliente = await this.clientesRepository.findOne({
        where: { id, deletado_em: IsNull() },
      });
      if (!cliente) {
        this.logger.warn(`Cliente com id ${id} não encontrado para exclusão`);
        throw new NotFoundException(`Cliente com id ${id} não encontrado`);
      }
      cliente.deletado_em = new Date();
      return await this.clientesRepository.save(cliente);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(`Erro ao deletar cliente com id ${id}`, error.stack);
      }
      throw error;
    }
  }
}
