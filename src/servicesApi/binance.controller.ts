import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BinanceService } from './binance.service';

@ApiTags('converter')
@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  //traer todas las cryptos (20)
  @Get('ticker/prices')
  @ApiOperation({ summary: 'Obtener precios de todas las criptomonedas' })
  @ApiResponse({ status: 200, description: 'Lista de precios de criptomonedas' })
  @ApiResponse({ status: 400, description: 'Error al consultar Binance' })
  async getAllTickerPrices() {
    return this.binanceService.getAllTickerPrices();
  }
  
  // búsqueda por símbolo
  @Get('ticker/price/:symbol')
  @ApiOperation({ summary: 'Obtener precio de una criptomoneda específica, Y PONER EL PAR USDT' })
  @ApiResponse({ status: 200, description: 'Precio de la criptomoneda' })
  @ApiResponse({ status: 400, description: 'Error al consultar Binance' })
  async getTickerPriceBySymbol(@Param('symbol') symbol: string) {
    return this.binanceService.getTickerPriceBySymbol(symbol);
  }
}