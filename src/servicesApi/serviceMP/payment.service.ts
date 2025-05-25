import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentEntity } from '../../model/payment.entity';
import { User } from '../../model/user.entity';
import { Transaction } from '../../model/transaction.entity';
import { Wallet } from '../../model/wallet.entity';
import { PaymentDto } from './paymentDto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

   async savePayment(data: PaymentDto): Promise<PaymentEntity> {
    const existing = await this.paymentRepository.findOne({ where: { mpPaymentId: data.id } });
    if (existing) {
      return existing;
    }

    const user = await this.userRepository.findOne({ where: { email: data.payerEmail } });

    const payment = this.paymentRepository.create({
      mpPaymentId: data.id,
      status: data.status,
      amount: data.amount,
      currency: data.currency,
      user,
    });
    await this.paymentRepository.save(payment);

    if (data.status === 'approved' && user) {
      const amountTo = data.amount * 0.9;

      const transaction = this.transactionRepository.create({
        user,
        fromCurrency: data.currency,
        toCurrency: 'USDT',
        amountFrom: data.amount,
        amountTo,
        status: 'completed',
      });
      await this.transactionRepository.save(transaction);

      let wallet = await this.walletRepository.findOne({ where: { user, currency: 'USDT' } });
      if (!wallet) {
        wallet = this.walletRepository.create({ user, currency: 'USDT', balance: 0 });
      }

      wallet.balance += amountTo;
      await this.walletRepository.save(wallet);

      payment.transaction = transaction;
      await this.paymentRepository.save(payment);
    }

    return payment;
  }
}
