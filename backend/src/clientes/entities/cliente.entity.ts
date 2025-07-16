import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  endereco: string;

  @CreateDateColumn({ name: 'data_criacao' })
  data_criacao: Date;

  @UpdateDateColumn({ name: 'atualizado_em' })
  atualizado_em: Date;

  @Column({ name: 'deletado_em', type: 'timestamp', nullable: true })
  deletado_em: Date | null;
}