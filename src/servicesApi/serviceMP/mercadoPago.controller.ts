import { Controller, Post, Body, Get, Param, Query, HttpCode } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { PaymentService } from './payment.service';
import { PaymentDto } from './paymentDto';

@Controller('payments')
export class MercadoPagoController {
  constructor(
    private readonly mercadoPagoService: MercadoPagoService,
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-preference')
  async createPreference(
    @Body() createPreferenceDto: { amount: number; description: string }
  ) {
    const { amount, description } = createPreferenceDto;
    return await this.mercadoPagoService.createPreference(amount, description);
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(@Body() body: any) {
    console.log('Webhook recibido:', body);

    const liveMode = body.live_mode;
    console.log('live mode:', liveMode);
    

    // Manejar webhook de payment directo
    if (body?.type === 'payment' && body?.data?.id) {
      // Remover debugPayment para producción
      // await this.debugPayment(body.data.id); 
      
      // Procesar de forma asíncrona sin bloquear la respuesta del webhook
      this.processPaymentWebhookAsync(body.data.id);
      
    // Manejar webhook de merchant_order  
    } else if (body?.topic === 'merchant_order' && body?.resource) {
      const merchantOrderId = body.resource.split('/').pop();
      await this.processMerchantOrderWebhook(merchantOrderId);
      
    } else {
      console.log('Webhook recibido con tipo o id no válido:', body);
    }
  }

  // Método asíncrono que no bloquea el webhook
  private async processPaymentWebhookAsync(paymentId: string) {
    try {
      await this.processPaymentWebhook(paymentId);
    } catch (error) {
      console.error('💥 Error en procesamiento asíncrono:', error);
    }
  }

  // Método temporal para debugging
  private async debugPayment(paymentId: string) {
    try {
      console.log('🧪 Testing direct API call for payment:', paymentId);
      
      // Probar diferentes endpoints
      const endpoints = [
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        `https://api.mercadolibre.com/payments/${paymentId}`,
      ];
      
      for (const endpoint of endpoints) {
        console.log('🔗 Testing endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log('📊 Status:', response.status);
        const data = await response.json();
        console.log('📄 Response:', JSON.stringify(data, null, 2));
      }
      
    } catch (error) {
      console.error('❌ Debug error:', error);
    }
  }

  private async processPaymentWebhook(paymentId: string, retries = 5) {
    console.log('🔍 Procesando payment ID:', paymentId);
    console.log('🔑 Token (primeros 10 chars):', process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 10));
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    
    // Delay inicial más largo para payment.created
    console.log('⏳ Esperando 5 segundos inicial (payment.created tiene delay)...');
    await this.delay(5000);
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      const delayTime = attempt * 5000; 
      try {
        console.log(`Intento ${attempt} para obtener pago ${paymentId}`);
        
        // Usar la URL correcta de la API
        const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
        console.log('📡 URL:', url);
        
        const mpResponse = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📊 Response status:', mpResponse.status);

        if (!mpResponse.ok) {
          const errorResponse = await mpResponse.json();
          console.log('❌ Error response:', JSON.stringify(errorResponse, null, 2));
          
          // Si es 404 y aún hay intentos, esperar y reintentar con delays más largos
          if (mpResponse.status === 404 && attempt < retries) {
            const delayTime = attempt * 5000; // 5s, 10s, 15s, 20s
            console.log(`⏳ Pago no encontrado, reintentando en ${delayTime/1000} segundos...`);
            await this.delay(delayTime);
            continue;
          }
          
          // Si es error de autenticación
          if (mpResponse.status === 401) {
            console.error('🚫 Error de autenticación - verifica tu ACCESS_TOKEN');
            return;
          }
          
          console.error('💥 Error fetching payment:', errorResponse);
          return;
        }

        const paymentDetails = await mpResponse.json();
        console.log('✅ Payment encontrado:', {
          id: paymentDetails.id,
          status: paymentDetails.status,
          amount: paymentDetails.transaction_amount,
          email: paymentDetails.payer?.email
        });

        const paymentData: PaymentDto = {
          id: paymentDetails.id,
          status: paymentDetails.status,
          amount: paymentDetails.transaction_amount,
          currency: paymentDetails.currency_id,
          payerEmail: paymentDetails.payer?.email || 'unknown',
          createdAt: paymentDetails.date_created,
          method: paymentDetails.payment_method_id || 'unknown',
        };

        await this.paymentService.savePayment(paymentData);
        console.log('💾 Payment guardado exitosamente');
        return; // Éxito, salir del loop
        
      } catch (error) {
        console.error(`💥 Exception en intento ${attempt}:`, error);
        
        if (attempt < retries) {
          console.log(`⏳ Esperando ${delayTime/1000} segundos antes del siguiente intento...`);
          await this.delay(delayTime);
        }
      }
    }
    
    console.error(`❌ No se pudo obtener el pago ${paymentId} después de ${retries} intentos`);
    
    // Como último recurso, intentar obtener el pago desde merchant_order
    console.log('🔄 Intentando obtener el pago desde merchant orders como último recurso...');
    await this.tryGetPaymentFromMerchantOrders(paymentId);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Método de último recurso: buscar el pago en merchant orders
  private async tryGetPaymentFromMerchantOrders(paymentId: string) {
    try {
      console.log('🔍 Buscando merchant orders que puedan contener el pago:', paymentId);
      
      // Esto es un workaround - en un caso real necesitarías almacenar la relación
      // payment_id -> merchant_order_id para poder hacer esta consulta
      console.log('⚠️ Necesitas implementar un mecanismo para relacionar payments con merchant_orders');
      
      // Alternativamente, podrías guardar el payment ID para procesarlo más tarde
      console.log('💡 Consideración: Guardar payment ID para procesamiento posterior');
      
    } catch (error) {
      console.error('❌ Error en búsqueda de último recurso:', error);
    }
  }

  private async processMerchantOrderWebhook(merchantOrderId: string) {
    try {
      console.log('🏪 Procesando merchant order:', merchantOrderId);
      
      const mpResponse = await fetch(`https://api.mercadopago.com/merchant_orders/${merchantOrderId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!mpResponse.ok) {
        const errorResponse = await mpResponse.json();
        console.error('❌ Error fetching merchant order:', errorResponse);
        return;
      }

      const merchantOrder = await mpResponse.json();
      console.log('📦 merchantOrder:', {
        id: merchantOrder.id,
        status: merchantOrder.status,
        paymentsCount: merchantOrder.payments?.length || 0,
        totalAmount: merchantOrder.total_amount,
        paidAmount: merchantOrder.paid_amount
      });

      // SOLO procesar si hay pagos en la orden
      if (merchantOrder.payments && merchantOrder.payments.length > 0) {
        console.log('💳 Procesando pagos de la merchant order:', merchantOrder.payments);
        
        for (const payment of merchantOrder.payments) {
          console.log(`💰 Procesando pago: ${payment.id} - Status: ${payment.status}`);
          
          if (payment.status === 'approved') {
            await this.processPaymentWebhook(payment.id);
          } else {
            console.log(`⏸️ Pago ${payment.id} no está aprobado (${payment.status})`);
          }
        }
      } else {
        console.log('📝 Merchant order sin pagos asociados aún - esto es normal');
      }
      
    } catch (error) {
      console.error('💥 Exception handling merchant order webhook:', error);
    }
  }

  @Get('success')
  async paymentSuccess(@Query() query: any) {
    console.log('✅ Pago exitoso:', query);
    return { message: 'Pago realizado con éxito', data: query };
  }

  @Get('failure')
  async paymentFailure(@Query() query: any) {
    console.log('❌ Pago fallido:', query);
    return { message: 'Pago falló', data: query };
  }

  @Get('pending')
  async paymentPending(@Query() query: any) {
    console.log('⏳ Pago pendiente:', query);
    return { message: 'Pago pendiente', data: query };
  }

  @Get('status/:paymentId')
  async getPaymentStatus(@Param('paymentId') paymentId: string) {
    console.log('🔍 Consultando status del pago:', paymentId);
    return await this.mercadoPagoService.getPaymentStatus(paymentId);
  }
}