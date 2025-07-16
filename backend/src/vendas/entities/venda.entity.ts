import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Cliente } from './../../clientes/entities/cliente.entity';
import { VendaItem } from './../../venda-itens/entities/venda-item.entity';
import { ContaReceber } from './../../contas-receber/entities/contas-receber.entity';
import { Pagamento } from './../../pagamento/entities/pagamento.entity';

@Entity({ name: 'vendas' })
export class Venda {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { nullable: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_venda: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 20, default: 'pendente' })
  status: 'finalizada' | 'pendente' | 'cancelada';

  @OneToMany(() => VendaItem, (item) => item.venda)
  itens: VendaItem[];

  @OneToMany(() => ContaReceber, (conta) => conta.venda)
  contasReceber: ContaReceber[];

  @OneToMany(() => Pagamento, (pagamento) => pagamento.venda)
  pagamentos: Pagamento[];
}