import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string; // Ej: 'ARS', 'USDT', 'PYG'

  @Column('decimal', { precision: 14, scale: 2, default: 0 })
  balance: number;

  @ManyToOne(() => User, user => user.wallets, { eager: false, onDelete: 'CASCADE' })
  user: User;
}
