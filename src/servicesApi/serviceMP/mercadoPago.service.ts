import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
  private client: MercadoPagoConfig;
  private preference: Preference;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: {
        timeout: 5000,
      }
    });
    this.preference = new Preference(this.client);
  }

  async createPreference(amount: number, description: string) {
    try {
      const response = await this.preference.create({
        body: {
          items: [
            {
              id: 'conversion-item-001',
              title: description,
              quantity: 1,
              unit_price: amount,
              currency_id: 'ARS'
            }
          ],
          payer: {
      email: 'test_user_1391546833@testuser.com', // usuario comprador de prueba
    },
          back_urls: {
                  success: 'https://f572-2803-9800-b992-80b4-2de5-d52b-4aab-d62.ngrok-free.app/payments/success',
                  failure: 'https://f572-2803-9800-b992-80b4-2de5-d52b-4aab-d62.ngrok-free.app/payments/failure',
                  pending: 'https://f572-2803-9800-b992-80b4-2de5-d52b-4aab-d62.ngrok-free.app/payments/pending'
          },
          auto_return: 'approved',
          notification_url: 'https://f572-2803-9800-b992-80b4-2de5-d52b-4aab-d62.ngrok-free.app/payments/webhook'

        }
      });

      return {
        id: response.id,
        init_point: response.init_point,
        sandbox_init_point: response.sandbox_init_point
      };
    } catch (error) {
      throw new HttpException(
        `Error creando preferencia de MercadoPago: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getPaymentStatus(paymentId: string) {
    try {
      // Para consultar el estado de un pago
      const payment = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      });
      
      return await payment.json();
    } catch (error) {
      throw new HttpException(
        `Error consultando pago: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}