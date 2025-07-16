import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venda } from './../../vendas/entities/venda.entity';
import { Cliente } from './../../clientes/entities/cliente.entity';
import { ContaReceber } from './../../contas-receber/entities/contas-receber.entity';

@Entity({ name: 'pagamentos' })
export class Pagamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venda_id: number;

  @ManyToOne(() => Venda, (venda) => venda.pagamentos)
  @JoinColumn({ name: 'venda_id' })
  venda: Venda;

  @Column()
  cliente_id: number;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ nullable: true })
  conta_receber_id?: number;

  @ManyToOne(() => ContaReceber, (conta) => conta.pagamentos, {
    nullable: true,
  })
  @JoinColumn({ name: 'conta_receber_id' })
  contaReceber?: ContaReceber | null;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_pagamento: Date;

  @Column({ type: 'varchar', length: 20 })
  forma_pagamento:
    | 'dinheiro'
    | 'cartao'
    | 'pix'
    | 'marcar_na_conta'
    | 'boleto'
    | 'transferencia_bancaria'
    | 'cheque'
    | 'vale_alimentacao'
    | 'vale_refeicao'
    | 'paypal'
    | 'apple_pay'
    | 'google_pay'
    | 'deposito'
    | 'crediario';

  @Column({ type: 'text', nullable: true })
  observacao?: string | null;
}