import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../model/user.entity';


@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    fromCurrency: string; // Ej: 'ARS'

    @Column()
    toCurrency: string; // Ej: 'PYG'

    @Column('decimal', { precision: 14, scale: 2 })
    amountFrom: number;

    @Column('decimal', { precision: 14, scale: 2 })
    amountTo: number;

    @Column({ default: 'pending' }) // 'pending', 'completed', 'failed'
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    completedAt: Date;
}