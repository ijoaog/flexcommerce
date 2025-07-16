import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Categoria } from './../../categoria/entities/categoria.entity';

export enum SituacaoProduto {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
  DESCONTINUADO = 'descontinuado',
}

//TODO - CRIAR TABELA DE RESPONSAVEIS PARA DEIXAR DINAMICO
export enum ResponsavelProduto {
  ANA = 'ana',
  PATRICIA = 'patricia',
  NONE = 'null',
}

@Entity('produto')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'categoria_id' }) // garante que coluna FK será categoria_id
  categoria?: Categoria;

  @Column({ type: 'int' })
  quantidade: number;

  @Column({ length: 100, nullable: true })
  modelo?: string;

  @Column({ length: 100, nullable: true })
  marca?: string;

  @Column({ length: 50, nullable: true })
  codigo_barras?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco_venda?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco_custo?: number;

  @Column({ length: 20, nullable: true })
  unidade_medida?: string;

  @Column('decimal', { precision: 10, scale: 3, nullable: true })
  peso?: number;

  @Column({ length: 50, nullable: true })
  cor?: string;

  @Column({ length: 50, nullable: true })
  tamanho?: string;

  @Column({ length: 100, nullable: true })
  material?: string;

  @CreateDateColumn({ type: 'timestamp' })
  data_cadastro: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  data_atualizacao: Date;

  @Column({
    type: 'enum',
    enum: SituacaoProduto,
    default: SituacaoProduto.ATIVO,
  })
  situacao: SituacaoProduto;

  @Column({ type: 'int', nullable: true })
  garantia_meses?: number;

  @Column({ length: 255, nullable: true })
  fornecedor?: string;

  @Column({ type: 'text', nullable: true })
  observacoes?: string;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @Column({
    type: 'enum',
    enum: ResponsavelProduto,
    nullable: true,
    default: ResponsavelProduto.NONE,
  })
  responsavel_produto?: ResponsavelProduto;
}
