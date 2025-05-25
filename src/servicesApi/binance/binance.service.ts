import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios from 'axios';

@Injectable()
export class BinanceService {
  private readonly baseUrl = 'https://api.binance.com/api/v3';

  async getAllTickerPrices(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker/price`);
      // return response.data.slice(0, 30); // Limitamos a 20 resultados
      return response.data;
    } catch (error) {
      throw new HttpException('Error al consultar Binance', HttpStatus.BAD_REQUEST);
    }
  }
  
  //  buscar por símbolo:
  async getTickerPriceBySymbol(symbol: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker/price`, {
        params: { symbol },
      });
      return response.data;
    } catch (error) {
      throw new HttpException('Error al consultar Binance', HttpStatus.BAD_REQUEST);
    }
  }
  //convertir de ars a usdt y de usdt a brl
  async convertArsToBrl(amountArs: number): Promise<any> {
  try {
    // Paso 1: ARS → USDT
    const arsToUsdt = await this.getTickerPriceBySymbol('USDTARS');
    // cantidad en dolares == cantidad en pesos / precio en el que esta
    // el dolar crypto EJ: 100 / 1100 usdt == 0.09 aprox
    const usdtAmount = amountArs / parseFloat(arsToUsdt.price);

    // Paso 2: USDT → BRL
    const usdtToBrl = await this.getTickerPriceBySymbol('USDTBRL');
    // caso inverso al paso 1 con los pesos ars, en vez de dividir * por usdt
    const brlAmount = usdtAmount * parseFloat(usdtToBrl.price);

    return {
      original: `${amountArs} ARS`,
      usdt: `${usdtAmount.toFixed(2)} USDT`,
      brl: `${brlAmount.toFixed(2)} BRL`,
    };
  } catch (error) {
    throw new HttpException('Error en la conversión ARS → BRL', HttpStatus.BAD_REQUEST);
  }
}
}