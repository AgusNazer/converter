// payment.entity.ts
import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, ManyToOne
} from 'typeorm';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';

@Entity()
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mpPaymentId: string;

  @Column()
  status: string;

  @Column('decimal', { precision: 14, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Transaction, { nullable: true })
  transaction: Transaction;

  @CreateDateColumn()
  createdAt: Date;
}
