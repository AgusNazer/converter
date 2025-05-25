import { Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadoPago.controller';
import { PaymentModule } from './payment.module';
@Module({
    imports: [
        PaymentModule,
    ],
  providers: [MercadoPagoService],
  controllers: [MercadoPagoController],
  exports: [MercadoPagoService], // Para usar en otros modulos
})
export class MercadoPagoModule {}