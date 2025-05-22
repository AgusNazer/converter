import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Wallet } from "./wallet.entity";
import { Transaction } from "./transaction.entity";


@Entity()
export class User{
    @PrimaryGeneratedColumn()
      id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @OneToMany(() => Wallet, wallet => wallet.user)
  wallets: Wallet[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];
}

