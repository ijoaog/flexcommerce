import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { IsNull } from 'typeorm';
@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
  ) {}

  async findAll(): Promise<Produto[]> {
    return this.produtoRepository.find({
      where: { deletedAt: IsNull() },
      relations: ['categoria'],
    });
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtoRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['categoria'],
    });
    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }
    return produto;
  }

  async create(createProdutoDto: CreateProdutoDto): Promise<Produto> {
    const { categoria_id, quantidade, ...rest } = createProdutoDto;

    const produto = this.produtoRepository.create({
      ...rest,
      quantidade,
      categoria: categoria_id ? { id: categoria_id } : undefined,
    });

    return this.produtoRepository.save(produto);
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<Produto> {
    const { categoria_id, quantidade, ...rest } = updateProdutoDto;

    const produto = await this.produtoRepository.preload({
      id,
      ...rest,
      quantidade,
      categoria: categoria_id ? { id: categoria_id } : undefined,
    });

    if (!produto) {
      throw new NotFoundException(`Produto com id ${id} não encontrado`);
    }

    return this.produtoRepository.save(produto);
  }

  async remove(id: number): Promise<void> {
    const produto = await this.findOne(id);
    produto.deletedAt = new Date();
    await this.produtoRepository.save(produto);
  }
}
