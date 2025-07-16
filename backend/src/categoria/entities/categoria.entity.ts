import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Produto } from './../../produto/entities/produto.entity';

@Entity('categorias')
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  nome: string;

  @Column({ type: 'text', nullable: true })
  descricao?: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos: Produto[];
}