import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BinanceService } from '../binance/binance.service';

@ApiTags('converter')
@Controller('binance')
export class BinanceController {
  constructor(private readonly binanceService: BinanceService) {}

  //traer todas las cryptos (20)
  @Get('/prices')
  @ApiOperation({ summary: 'Obtener precios de todas las criptomonedas' })
  @ApiResponse({ status: 200, description: 'Lista de precios de criptomonedas' })
  @ApiResponse({ status: 400, description: 'Error al consultar Binance' })
  async getAllTickerPrices() {
    return this.binanceService.getAllTickerPrices();
  }
  
  // búsqueda por símbolo
  @Get('/price/:symbol')
  @ApiOperation({ summary: 'Obtener precio de una criptomoneda específica, Y PONER EL PAR USDT' })
  @ApiResponse({ status: 200, description: 'Precio de la criptomoneda' })
  @ApiResponse({ status: 400, description: 'Error al consultar Binance' })
  async getTickerPriceBySymbol(@Param('symbol') symbol: string) {
    return this.binanceService.getTickerPriceBySymbol(symbol);
  }
  //get convertidor 
@Get('/convert/from/ars-to-brl/:amount')
  async convertArsToBrl(@Param('amount') amountStr: string) {
    const amount = parseFloat(amountStr);

    // Validación: debe ser un numero positivo
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('El parámetro ":amount" debe ser un número positivo.');
    }
    
    return this.binanceService.convertArsToBrl(amount);
  }

}