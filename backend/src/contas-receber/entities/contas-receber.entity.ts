import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Venda } from './../../vendas/entities/venda.entity';
import { Cliente } from './../../clientes/entities/cliente.entity';
import { Pagamento } from './../../pagamento/entities/pagamento.entity';

@Entity({ name: 'contas_receber' })
export class ContaReceber {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venda_id: number;

  @ManyToOne(() => Venda, (venda) => venda.contasReceber)
  @JoinColumn({ name: 'venda_id' })
  venda: Venda;

  @Column()
  cliente_id: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column('numeric', { precision: 10, scale: 2 })
  valor: number;

  @Column('date')
  data_vencimento: string;

  @Column('date', { nullable: true })
  data_pagamento?: string | null;

  @OneToMany(() => Pagamento, (pagamento) => pagamento.contaReceber)
  pagamentos: Pagamento[];
}
