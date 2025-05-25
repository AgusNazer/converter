import { Controller, Post, Req, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MercadoPagoService } from './mercadopago.service';

interface MercadoPagoPaymentDetails {
  id: string;
  status: string;
  transaction_amount: number;
  currency_id: string;
  payment_method_id: string;
  payer?: {
    email?: string;
  };
  date_created: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('webhook')
  async handleWebhook(@Req() req) {
    const paymentData = req.body;

    const paymentId = paymentData.data?.id;
    if (!paymentId) {
      throw new HttpException('No payment id found in webhook data', HttpStatus.BAD_REQUEST);
    }

    const paymentDetails: MercadoPagoPaymentDetails = await this.mercadoPagoService.getPaymentStatus(paymentId);

    await this.paymentService.savePayment({
      id: paymentDetails.id,
      status: paymentDetails.status,
      amount: paymentDetails.transaction_amount,
      method: paymentDetails.payment_method_id,
      currency: paymentDetails.currency_id || 'unknown',
      payerEmail: paymentDetails.payer?.email || 'unknown',
      createdAt: paymentDetails.date_created,
    });

    return { received: true };
  }
}
