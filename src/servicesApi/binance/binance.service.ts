import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import axios from 'axios';

@Injectable()
export class BinanceService {
  private readonly baseUrl = 'https://api.binance.com/api/v3';

  async getAllTickerPrices(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/ticker/price`);
      return response.data.slice(0, 20); // Limitamos a 20 resultados
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
}