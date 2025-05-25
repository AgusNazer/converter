import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../../model/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { MercadoPagoService } from './mercadopago.service';
import { Wallet } from 'src/model/wallet.entity';
import { User } from 'src/model/user.entity';
import { Transaction } from 'src/model/Transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, User, Transaction, Wallet])],
  controllers: [PaymentsController],
  providers: [PaymentService, MercadoPagoService],
  exports:[PaymentService]
})
export class PaymentModule {}
