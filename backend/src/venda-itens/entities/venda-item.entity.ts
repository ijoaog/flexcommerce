import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venda } from './../../vendas/entities/venda.entity';
import { Produto } from './../../produto/entities/produto.entity';

@Entity({ name: 'venda_itens' })
export class VendaItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venda_id: number; // adiciona esse campo

  @Column()
  produto_id: number; // adiciona esse campo

  @ManyToOne(() => Venda, (venda) => venda.itens)
  @JoinColumn({ name: 'venda_id' })
  venda: Venda;

  @ManyToOne(() => Produto)
  @JoinColumn({ name: 'produto_id' })
  produto: Produto;

  @Column('int')
  quantidade: number;

  @Column('decimal', { precision: 10, scale: 2 })
  preco_unitario: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  preco_total?: number | null;
}
